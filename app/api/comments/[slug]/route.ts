import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeCommentHtml } from "@/lib/comment-html";
import { secretsMatch, validSlug, isAllowedOrigin, readJsonBody } from "@/lib/api-security";
import { isRateLimited } from "@/lib/rate-limit";
import { getAllSlugs } from "@/lib/posts";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { Resend } from "resend";
import { siteConfig } from "@/lib/data";
import { buildCommentNotificationHtml, buildCommentNotificationText } from "@/lib/email";

function getDb() {
  const url = process.env.v5sitedb_DATABASE_URL;
  if (!url) throw new Error("Database not configured.");
  return neon(url);
}

// Plain-text sanitization for name field - strip all markup
function sanitizeName(str: string): string {
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

// Convert markdown to sanitized HTML for storage
async function processMarkdown(markdown: string): Promise<string> {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(markdown);
  return sanitizeCommentHtml(result.toString());
}

// ── Owner notification ────────────────────────────────────────────────────────

async function sendOwnerCommentNotification(opts: {
  slug: string;
  name: string;
  rawContent: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!resendApiKey || !notifyEmail) return;

  const { slug, name, rawContent } = opts;
  const preview = rawContent.replace(/<[^>]*>/g, "").slice(0, 300);
  const postUrl = `${siteConfig.siteUrl}/blog/${slug}`;

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: "Jeevesh Krishna <notifications@jeeveshkrishna.com>",
    to: notifyEmail,
    subject: `New comment on /${slug} from ${name}`,
    html: buildCommentNotificationHtml({ slug, name, preview, postUrl }),
    text: buildCommentNotificationText({ slug, name, preview, postUrl }),
  });

  if (error) {
    console.error("[comment notification] Delivery failed.");
  }
}

// ── Table bootstrap ───────────────────────────────────────────────────────────
async function ensureTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_slug VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      is_owner BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}

// ── GET /api/comments/[slug] ──────────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!validSlug(slug)) {
    return NextResponse.json({ error: "Invalid post." }, { status: 400 });
  }

  if (!getAllSlugs().includes(slug))
    return NextResponse.json({ error: "Post not found." }, { status: 404 });

  if (!process.env.v5sitedb_DATABASE_URL) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    await ensureTable();
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, content, is_owner, created_at
      FROM comments
      WHERE post_slug = ${slug}
      ORDER BY created_at ASC
      LIMIT 500
    `;
    return NextResponse.json(rows);
  } catch {
    console.error("[comments GET] Database operation failed.");
    return NextResponse.json({ error: "Failed to fetch comments." }, { status: 500 });
  }
}

// ── DELETE /api/comments/[slug] ───────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!validSlug(slug)) return NextResponse.json({ error: "Invalid post." }, { status: 400 });
  if (!isAllowedOrigin(req)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const { id, adminKey } = body;

  if (!secretsMatch(adminKey, process.env.ADMIN_KEY)) {
    // Generic error - don't reveal whether the key was wrong vs. missing
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (typeof id !== "number" || !Number.isSafeInteger(id) || id < 1) {
    return NextResponse.json({ error: "Comment ID required." }, { status: 400 });
  }

  try {
    if (await isRateLimited(req, "delete"))
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    await ensureTable();
    const sql = getDb();
    await sql`DELETE FROM comments WHERE id = ${id} AND post_slug = ${slug}`;
    return NextResponse.json({ ok: true });
  } catch {
    console.error("[comments DELETE] Database operation failed.");
    return NextResponse.json({ error: "Failed to delete comment." }, { status: 500 });
  }
}

// ── POST /api/comments/[slug] ─────────────────────────────────────────────────
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!isAllowedOrigin(req)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!validSlug(slug)) return NextResponse.json({ error: "Invalid post." }, { status: 400 });
  if (!getAllSlugs().includes(slug))
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const { name, content, adminKey, hp } = body;

  // Honeypot: bots typically fill in every field they see. If this hidden
  // field has a value, silently pretend it succeeded.
  if (hp) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (
    typeof name !== "string" ||
    typeof content !== "string" ||
    (adminKey !== undefined && typeof adminKey !== "string")
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const cleanName = sanitizeName(name);
  const rawContent = content.trim();

  if (!cleanName || !rawContent) {
    return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
  }
  if (cleanName.length > 100) {
    return NextResponse.json({ error: "Name too long." }, { status: 400 });
  }
  if (rawContent.length > 2000) {
    return NextResponse.json({ error: "Message too long (max 2000 characters)." }, { status: 400 });
  }

  if (!process.env.v5sitedb_DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const isOwner = secretsMatch(adminKey, process.env.ADMIN_KEY);

  try {
    if (await isRateLimited(req, "comment"))
      return NextResponse.json({ error: "Too many comments. Try again later." }, { status: 429 });
    const cleanContent = await processMarkdown(rawContent);
    await ensureTable();
    const sql = getDb();
    const rows = await sql`
      INSERT INTO comments (post_slug, name, content, is_owner)
      VALUES (${slug}, ${cleanName}, ${cleanContent}, ${isOwner})
      RETURNING id, name, content, is_owner, created_at
    `;

    if (!isOwner) {
      await sendOwnerCommentNotification({ slug, name: cleanName, rawContent }).catch(() => {});
    }

    return NextResponse.json(rows[0], { status: 201 });
  } catch {
    console.error("[comments POST] Request failed.");
    return NextResponse.json({ error: "Failed to post comment." }, { status: 500 });
  }
}
