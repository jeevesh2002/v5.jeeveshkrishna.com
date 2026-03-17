import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { Resend } from "resend";
import { getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/data";
import { buildNewsletterHtml, buildNewsletterText } from "@/lib/email";

function getDb() {
  const url = process.env.v5sitedb_DATABASE_URL;
  if (!url) throw new Error("Database not configured.");
  return neon(url);
}

function isValidAdminKey(provided: string): boolean {
  const key = process.env.ADMIN_KEY;
  if (!key || !provided) return false;
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(key).digest();
  return a.equals(b) && provided.length === key.length;
}

async function ensureSentTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_sent (
      slug VARCHAR(255) PRIMARY KEY,
      sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      recipient_count INTEGER DEFAULT 0
    )
  `;
}

// Resend batch endpoint accepts up to 100 emails per call
const BATCH_SIZE = 100;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { adminKey, slug } = body;

  if (!isValidAdminKey(adminKey)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Post slug required." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured (RESEND_API_KEY missing)." },
      { status: 503 }
    );
  }

  if (!process.env.v5sitedb_DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const post = await getPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  await ensureSentTable();
  const sql = getDb();

  // Prevent double-sending the same post
  const alreadySent = await sql`SELECT slug FROM newsletter_sent WHERE slug = ${slug}`;
  if (alreadySent.length > 0) {
    return NextResponse.json(
      { error: `Already sent for slug "${slug}". Use auto-send or check newsletter_sent table.` },
      { status: 409 }
    );
  }

  const subscribers = await sql`SELECT email, unsubscribe_token FROM newsletter_subscribers`;
  if (subscribers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, failed: 0, message: "No subscribers." });
  }

  const { sent, failed } = await sendToSubscribers({ post, subscribers });

  // Record as sent regardless of partial failures
  await sql`
    INSERT INTO newsletter_sent (slug, recipient_count)
    VALUES (${slug}, ${sent})
    ON CONFLICT (slug) DO NOTHING
  `;

  return NextResponse.json({ ok: true, sent, failed });
}

// ── Shared send helper (also used by auto-send) ───────────────────────────────

export async function sendToSubscribers({
  post,
  subscribers,
}: {
  post: { slug: string; title: string; excerpt: string; readingTime: number; date: string };
  subscribers: Record<string, unknown>[];
}): Promise<{ sent: number; failed: number }> {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const postUrl = `${siteConfig.siteUrl}/blog/${post.slug}`;
  let sent = 0;
  let failed = 0;

  const emails = subscribers.map((sub) => {
    const unsubscribeUrl = `${siteConfig.siteUrl}/api/unsubscribe?token=${sub.unsubscribe_token}`;
    return {
      from: "Jeevesh Krishna <newsletter@jeeveshkrishna.com>",
      to: sub.email as string,
      subject: `New post: ${post.title}`,
      html: buildNewsletterHtml({
        title: post.title,
        excerpt: post.excerpt ?? "",
        postUrl,
        readingTime: post.readingTime,
        date: post.date,
        unsubscribeUrl,
      }),
      text: buildNewsletterText({
        title: post.title,
        excerpt: post.excerpt ?? "",
        postUrl,
        unsubscribeUrl,
      }),
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    };
  });

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    const { data, error } = await resend.batch.send(batch);

    if (error) {
      console.error(`[newsletter] Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error);
      failed += batch.length;
    } else {
      sent += data?.data?.length ?? 0;
      failed += batch.length - (data?.data?.length ?? 0);
    }
  }

  return { sent, failed };
}
