import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { secretsMatch } from "@/lib/api-security";
import { ensureNewsletterTable, type NewsletterResult } from "@/lib/newsletter";
import { newsletterDb, sendNewsletter } from "@/lib/newsletter-delivery";

export async function GET(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  const bearer = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
  if (!secretsMatch(bearer, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!process.env.v5sitedb_DATABASE_URL || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Newsletter service unavailable." }, { status: 503 });
  }

  try {
    const sql = newsletterDb();
    await ensureNewsletterTable(sql);
    const attempted = await sql`SELECT slug FROM newsletter_sent`;
    const attemptedSlugs = new Set(attempted.map((row) => row.slug));
    const results: ({ slug: string } & NewsletterResult)[] = [];

    for (const metadata of getAllPosts()) {
      if (attemptedSlugs.has(metadata.slug)) continue;
      const post = await getPostBySlug(metadata.slug);
      if (!post) continue;
      const result = await sendNewsletter(sql, post);
      if (result.status !== "already_claimed") results.push({ slug: post.slug, ...result });
    }
    const needsReview = results.some((result) => result.status === "needs_review");
    return NextResponse.json(
      { ok: !needsReview, processed: results.length, results },
      { status: needsReview ? 502 : 200 }
    );
  } catch {
    console.error("[newsletter auto-send] Send attempt requires review.");
    return NextResponse.json(
      { error: "Newsletter send unavailable. Review the send record." },
      { status: 503 }
    );
  }
}
