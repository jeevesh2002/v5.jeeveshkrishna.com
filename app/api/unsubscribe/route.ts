import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

function getDb() {
  const url = process.env.v5sitedb_DATABASE_URL;
  if (!url) throw new Error("Database not configured.");
  return neon(url);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token || !UUID_RE.test(token)) {
    return NextResponse.redirect(new URL("/unsubscribe?status=invalid", req.url));
  }

  if (!process.env.v5sitedb_DATABASE_URL) {
    return NextResponse.redirect(new URL("/unsubscribe?status=error", req.url));
  }

  try {
    const sql = getDb();
    const result = await sql`
      DELETE FROM newsletter_subscribers
      WHERE unsubscribe_token = ${token}
      RETURNING id
    `;

    if (result.length > 0) {
      return NextResponse.redirect(new URL("/unsubscribe?status=success", req.url));
    } else {
      return NextResponse.redirect(new URL("/unsubscribe?status=not-found", req.url));
    }
  } catch (err) {
    console.error("[unsubscribe GET]", err);
    return NextResponse.redirect(new URL("/unsubscribe?status=error", req.url));
  }
}
