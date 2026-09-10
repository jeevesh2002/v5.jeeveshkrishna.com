import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";
import { isAllowedOrigin, readJsonBody, secretsMatch, validSlug } from "@/lib/api-security";
import { ensureNewsletterTable } from "@/lib/newsletter";
import { newsletterDb, sendNewsletter } from "@/lib/newsletter-delivery";

export async function POST(req: NextRequest) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  const parsed = await readJsonBody(req);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }
  const { adminKey, slug } = parsed.body;
  if (!secretsMatch(adminKey, process.env.ADMIN_KEY)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!validSlug(slug)) {
    return NextResponse.json({ error: "Valid post slug required." }, { status: 400 });
  }
  if (!process.env.RESEND_API_KEY || !process.env.v5sitedb_DATABASE_URL) {
    return NextResponse.json({ error: "Newsletter service unavailable." }, { status: 503 });
  }

  try {
    const post = await getPostBySlug(slug);
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    const sql = newsletterDb();
    await ensureNewsletterTable(sql);
    const result = await sendNewsletter(sql, post);
    if (result.status === "already_claimed") {
      return NextResponse.json(
        {
          error:
            "This post already has a send attempt. Review its delivery record before retrying.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { ok: result.status === "sent", ...result },
      { status: result.status === "sent" ? 200 : 502 }
    );
  } catch {
    // Do not expose provider errors, recipients, connection strings, or admin secrets.
    console.error("[newsletter send] Send attempt requires review.");
    return NextResponse.json(
      { error: "Newsletter send unavailable. Review the send record." },
      { status: 503 }
    );
  }
}
