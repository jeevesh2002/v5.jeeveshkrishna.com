import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAllowedOrigin, readJsonBody } from "@/lib/api-security";
import { isRateLimited } from "@/lib/rate-limit";
import { promises as dns } from "dns";
import { Resend } from "resend";
import { siteConfig } from "@/lib/data";

function getDb() {
  const url = process.env.v5sitedb_DATABASE_URL;
  if (!url) throw new Error("Database not configured.");
  return neon(url);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function hasMxRecords(email: string): Promise<boolean> {
  try {
    const domain = email.split("@")[1];
    if (!domain) return false;
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

async function ensureTable() {
  const sql = getDb();
  await sql.transaction([
    sql`SELECT pg_advisory_xact_lock(hashtext('portfolio-newsletter-subscribers'))`,
    sql`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL,
      subscribed_at TIMESTAMPTZ DEFAULT NOW(), unsubscribe_token UUID NOT NULL
    )`,
    sql`CREATE TABLE IF NOT EXISTS newsletter_pending (
      email VARCHAR(255) PRIMARY KEY, token UUID UNIQUE NOT NULL, expires_at TIMESTAMPTZ NOT NULL
    )`,
    sql`DELETE FROM newsletter_pending WHERE expires_at <= NOW()`,
  ]);
}

export async function POST(req: NextRequest) {
  if (!isAllowedOrigin(req)) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const { email, hp } = body;

  // Honeypot: bots fill every visible field
  if (hp) return NextResponse.json({ ok: true }, { status: 201 });

  if (!email || typeof email !== "string" || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (!process.env.v5sitedb_DATABASE_URL || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  try {
    if (await isRateLimited(req, "subscribe"))
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    const mxValid = await hasMxRecords(email.toLowerCase().trim());
    if (!mxValid) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    await ensureTable();
    const sql = getDb();
    const token = randomUUID();

    const rows = await sql`
      INSERT INTO newsletter_pending (email, token, expires_at)
      SELECT ${email.toLowerCase().trim()}, ${token}, NOW() + INTERVAL '24 hours'
      WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = ${email.toLowerCase().trim()})
      ON CONFLICT (email) DO NOTHING
      RETURNING token
    `;

    // Pending recipients receive at most one confirmation per 24 hours.
    // Only a subsequent explicit confirmation adds them to the mailing list.
    if (rows.length > 0) {
      await sendConfirmationEmail(email.toLowerCase().trim(), rows[0].token as string);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    console.error("[subscribe POST] Request failed.");
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

async function sendConfirmationEmail(email: string, token: string) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const confirmUrl = `${siteConfig.siteUrl}/subscribe-confirm?token=${token}`;
  const { error } = await resend.emails.send(
    {
      from: "Jeevesh Krishna <newsletter@jeeveshkrishna.com>",
      to: email,
      subject: "Confirm your subscription",
      text: `Confirm that you want new posts from Jeevesh Krishna: ${confirmUrl}\n\nThis link expires in 24 hours. If you did not request this, ignore this email. You have not been subscribed.`,
      html: `<p>Confirm that you want new posts from Jeevesh Krishna.</p><p><a href="${confirmUrl}">Confirm subscription</a></p><p>This link expires in 24 hours. If you did not request this, ignore this email. You have not been subscribed.</p>`,
    },
    { idempotencyKey: `subscribe-confirm/${token}` }
  );
  if (error) throw new Error("Confirmation delivery failed.");
}
