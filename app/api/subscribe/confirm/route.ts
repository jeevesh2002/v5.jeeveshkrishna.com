import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isAllowedOrigin } from "@/lib/api-security";
import { sendOwnerSubscribeNotification, sendWelcomeEmail } from "@/lib/subscription-email";

export async function POST(req: NextRequest) {
  const redirect = (status: string) =>
    NextResponse.redirect(
      new URL(`/subscribe-confirm?status=${status}`, "https://jeeveshkrishna.com"),
      { status: 303, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } }
    );
  if (!isAllowedOrigin(req)) return new NextResponse("Forbidden", { status: 403 });
  const token = req.nextUrl.searchParams.get("token");
  if (!token || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    return redirect("invalid");
  }
  const url = process.env.v5sitedb_DATABASE_URL;
  if (!url) return redirect("error");
  try {
    const sql = neon(url);
    const unsubscribeToken = randomUUID();
    // Delete-and-activate in one statement makes confirmation single-use.
    const rows = await sql`
      WITH confirmed AS (
        DELETE FROM newsletter_pending WHERE token = ${token} AND expires_at > NOW()
        RETURNING email
      )
      INSERT INTO newsletter_subscribers (email, unsubscribe_token)
      SELECT email, ${unsubscribeToken} FROM confirmed
      ON CONFLICT (email) DO NOTHING
      RETURNING email, unsubscribe_token
    `;
    if (!rows.length) return redirect("invalid");
    const email = rows[0].email as string;
    await sendWelcomeEmail(email, rows[0].unsubscribe_token as string).catch(() => {});
    await sendOwnerSubscribeNotification(email).catch(() => {});
    return redirect("success");
  } catch {
    console.error("[subscribe confirmation] Request failed.");
    return redirect("error");
  }
}
