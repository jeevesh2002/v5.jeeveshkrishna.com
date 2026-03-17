import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { getPostBySlug } from "@/lib/posts";
import { sendToSubscribers } from "@/app/api/newsletter/send/route";

function getDb() {
  const url = process.env.v5sitedb_DATABASE_URL;
  if (!url) throw new Error("Database not configured.");
  return neon(url);
}

// Vercel automatically sets CRON_SECRET and passes it as Bearer token on cron invocations
function isValidCronRequest(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${cronSecret}`;
}

async function ensureTables() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_sent (
      slug VARCHAR(255) PRIMARY KEY,
      sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      recipient_count INTEGER DEFAULT 0
    )
  `;
}

export async function GET(req: NextRequest) {
  if (!isValidCronRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!process.env.v5sitedb_DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not set." }, { status: 503 });
  }

  await ensureTables();
  const sql = getDb();

  // Find published posts that have never been sent
  const allPosts = getAllPosts(); // sorted newest first, published only
  const sentRows = await sql`SELECT slug FROM newsletter_sent`;
  const sentSlugs = new Set(sentRows.map((r) => r.slug as string));
  const unsentPosts = allPosts.filter((p) => !sentSlugs.has(p.slug));

  if (unsentPosts.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, message: "No new posts to send." });
  }

  const subscribers = await sql`SELECT email, unsubscribe_token FROM newsletter_subscribers`;

  const results: { slug: string; sent: number; failed: number }[] = [];

  for (const postMeta of unsentPosts) {
    const post = await getPostBySlug(postMeta.slug);
    if (!post) continue;

    let sent = 0;
    let failed = 0;

    if (subscribers.length > 0) {
      ({ sent, failed } = await sendToSubscribers({ post, subscribers }));
    }

    // Mark as sent even if there are zero subscribers - prevents re-queuing old posts
    await sql`
      INSERT INTO newsletter_sent (slug, recipient_count)
      VALUES (${post.slug}, ${sent})
      ON CONFLICT (slug) DO NOTHING
    `;

    results.push({ slug: post.slug, sent, failed });
    console.log(`[newsletter auto-send] ${post.slug}: sent=${sent} failed=${failed}`);
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
