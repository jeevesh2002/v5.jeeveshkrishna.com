import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import { siteConfig } from "@/lib/data";
import { buildWelcomeHtml, buildWelcomeText } from "@/lib/email";

function getDb() {
  const url = process.env.v5sitedb_DATABASE_URL;
  if (!url) throw new Error("Database not configured.");
  return neon(url);
}

const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function ensureTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      unsubscribe_token UUID NOT NULL
    )
  `;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { email, hp } = body;

  // Honeypot: bots fill every visible field
  if (hp) return NextResponse.json({ ok: true }, { status: 201 });

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!process.env.v5sitedb_DATABASE_URL) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  try {
    await ensureTable();
    const sql = getDb();
    const token = randomUUID();

    const rows = await sql`
      INSERT INTO newsletter_subscribers (email, unsubscribe_token)
      VALUES (${email.toLowerCase().trim()}, ${token})
      ON CONFLICT (email) DO NOTHING
      RETURNING unsubscribe_token
    `;

    // rows is empty if the email already existed - silently succeed, no duplicate welcome
    if (rows.length > 0) {
      const unsubscribeToken = rows[0].unsubscribe_token as string;
      await sendWelcomeEmail(email.toLowerCase().trim(), unsubscribeToken);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[subscribe POST]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

async function sendWelcomeEmail(email: string, unsubscribeToken: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return; // Fail silently - subscription still succeeded

  const unsubscribeUrl = `${siteConfig.siteUrl}/api/unsubscribe?token=${unsubscribeToken}`;
  const resend = new Resend(resendApiKey);

  const { error } = await resend.emails.send({
    from: "Jeevesh Krishna <newsletter@jeeveshkrishna.com>",
    to: email,
    subject: "You are subscribed.",
    html: buildWelcomeHtml({ unsubscribeUrl }),
    text: buildWelcomeText({ unsubscribeUrl }),
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });

  if (error) {
    console.error("[subscribe welcome email]", error);
  }
}
