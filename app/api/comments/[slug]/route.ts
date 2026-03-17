import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function getDb() {
  const url = process.env.v5sitedb_DATABASE_URL;
  if (!url) throw new Error("Database not configured.");
  return neon(url);
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
// In-memory per serverless instance. Good enough for a personal blog;
// use Vercel KV if you need cross-instance enforcement.
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

// ── Admin auth ────────────────────────────────────────────────────────────────
// Hash both sides to the same length before comparing, so timingSafeEqual
// never throws (it throws on length mismatch, leaking info about key length).
function isValidAdminKey(provided: string): boolean {
  const key = process.env.ADMIN_KEY;
  if (!key || !provided) return false;
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(key).digest();
  // timingSafeEqual prevents timing-based brute-force attacks
  return a.equals(b) && provided.length === key.length;
}

// ── Validation helpers ────────────────────────────────────────────────────────
const VALID_SLUG = /^[a-z0-9][a-z0-9-]*$/;

// Strip any HTML/script tags from user input before storing
function sanitize(str: string): string {
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
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
  if (!VALID_SLUG.test(slug)) {
    return NextResponse.json({ error: "Invalid post." }, { status: 400 });
  }

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
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[comments GET]", err);
    return NextResponse.json({ error: "Failed to fetch comments." }, { status: 500 });
  }
}

// ── DELETE /api/comments/[slug] ───────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await params;
  const ip = clientIp(req);

  // Allow 20 deletes per minute for admin (generous since it's keyed behind a secret)
  if (isRateLimited(`del:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { id, adminKey } = body;

  if (!isValidAdminKey(adminKey)) {
    // Generic error - don't reveal whether the key was wrong vs. missing
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!id || typeof id !== "number") {
    return NextResponse.json({ error: "Comment ID required." }, { status: 400 });
  }

  try {
    await ensureTable();
    const sql = getDb();
    await sql`DELETE FROM comments WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[comments DELETE]", err);
    return NextResponse.json({ error: "Failed to delete comment." }, { status: 500 });
  }
}

// ── POST /api/comments/[slug] ─────────────────────────────────────────────────
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Reject requests that don't look like they came from this site
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.includes(host.split(":")[0])) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (!VALID_SLUG.test(slug)) {
    return NextResponse.json({ error: "Invalid post." }, { status: 400 });
  }

  const ip = clientIp(req);

  // 3 comments per IP per 10 minutes
  if (isRateLimited(`post:${ip}`, 3, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many comments. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { name, content, adminKey, hp } = body;

  // Honeypot: bots typically fill in every field they see. If this hidden
  // field has a value, silently pretend it succeeded.
  if (hp) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const cleanName = sanitize(name ?? "");
  const cleanContent = sanitize(content ?? "");

  if (!cleanName || !cleanContent) {
    return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
  }
  if (cleanName.length > 100) {
    return NextResponse.json({ error: "Name too long." }, { status: 400 });
  }
  if (cleanContent.length > 2000) {
    return NextResponse.json({ error: "Message too long (max 2000 characters)." }, { status: 400 });
  }

  if (!process.env.v5sitedb_DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const isOwner = isValidAdminKey(adminKey);

  try {
    await ensureTable();
    const sql = getDb();
    const rows = await sql`
      INSERT INTO comments (post_slug, name, content, is_owner)
      VALUES (${slug}, ${cleanName}, ${cleanContent}, ${isOwner})
      RETURNING id, name, content, is_owner, created_at
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error("[comments POST]", err);
    return NextResponse.json({ error: "Failed to post comment." }, { status: 500 });
  }
}
