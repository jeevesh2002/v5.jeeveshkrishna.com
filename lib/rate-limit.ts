import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { neon } from "@neondatabase/serverless";

export function clientIp(req: Request): string {
  // Trust forwarding headers only when the hosting platform supplies them.
  const forwarded =
    process.env.VERCEL === "1"
      ? (req.headers.get("x-vercel-forwarded-for") ?? req.headers.get("x-forwarded-for"))
      : null;
  const ip = forwarded?.split(",")[0]?.trim();
  return ip && isIP(ip) ? ip : "unknown";
}

// Atomic Postgres counters are shared across cold starts and serverless instances.
// A global budget is checked first to bound email work and per-client row creation.
export async function isRateLimited(
  req: Request,
  action: "comment" | "delete" | "subscribe"
): Promise<boolean> {
  const url = process.env.v5sitedb_DATABASE_URL;
  if (!url) throw new Error("Database not configured.");
  const sql = neon(url);
  const limits = {
    comment: { global: 60, limit: 3, seconds: 600 },
    subscribe: { global: 50, limit: 5, seconds: 60 },
    delete: { global: 120, limit: 20, seconds: 60 },
  }[action];
  const client = createHash("sha256").update(clientIp(req)).digest("hex");
  const key = `${action}:${client}`;
  const globalKey = `${action}:global`;
  const results = await sql.transaction([
    // Serialize bounded admission and first-use table setup across instances.
    sql`SELECT pg_advisory_xact_lock(hashtext('portfolio-api-rate-limits'))`,
    sql`CREATE TABLE IF NOT EXISTS api_rate_limits (
      key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at TIMESTAMPTZ NOT NULL
    )`,
    sql`DELETE FROM api_rate_limits WHERE expires_at <= NOW()`,
    sql`
      WITH client_admission AS (
        INSERT INTO api_rate_limits (key, count, expires_at)
        SELECT ${key}, 1, NOW() + (${limits.seconds} * INTERVAL '1 second')
        WHERE COALESCE((SELECT count FROM api_rate_limits WHERE key = ${globalKey}), 0) < ${limits.global}
        ON CONFLICT (key) DO UPDATE SET count = api_rate_limits.count + 1
        WHERE api_rate_limits.count < ${limits.limit}
        RETURNING key
      )
      INSERT INTO api_rate_limits (key, count, expires_at)
      SELECT ${globalKey}, 1, NOW() + INTERVAL '1 hour' FROM client_admission
      ON CONFLICT (key) DO UPDATE SET count = api_rate_limits.count + 1
      RETURNING count
    `,
  ]);
  return results[3].length === 0;
}
