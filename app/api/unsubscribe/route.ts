import { neon } from "@neondatabase/serverless";
import { isAllowedOrigin } from "@/lib/api-security";
import { unsubscribeHandlers } from "@/lib/newsletter-unsubscribe";

const handlers = unsubscribeHandlers({
  isAllowedOrigin,
  async deleteToken(token) {
    const url = process.env.v5sitedb_DATABASE_URL;
    if (!url) throw new Error("Database not configured.");
    const sql = neon(url);
    const result = await sql`
      DELETE FROM newsletter_subscribers
      WHERE unsubscribe_token = ${token}
      RETURNING id
    `;
    return result.length > 0;
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
