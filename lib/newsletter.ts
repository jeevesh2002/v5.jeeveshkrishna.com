import { createHash } from "node:crypto";

export type NewsletterPost = {
  slug: string;
  title: string;
  excerpt: string;
  readingTime: number;
  date: string;
};
export type Subscriber = { email: string; unsubscribe_token: string };
export type NewsletterSql = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;
export type NewsletterResult = {
  status: "sent" | "needs_review" | "already_claimed";
  sent: number;
  failed: number;
};

export async function ensureNewsletterTable(sql: NewsletterSql) {
  await sql`
    DO $$
    BEGIN
      PERFORM pg_advisory_xact_lock(hashtext('newsletter_sent_schema'));
      CREATE TABLE IF NOT EXISTS newsletter_sent (
        slug VARCHAR(255) PRIMARY KEY,
        sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        recipient_count INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'sent',
        failed_count INTEGER NOT NULL DEFAULT 0
      );
      ALTER TABLE newsletter_sent ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'sent';
      ALTER TABLE newsletter_sent ADD COLUMN IF NOT EXISTS failed_count INTEGER NOT NULL DEFAULT 0;
    END;
    $$
  `;
  // Existing records are historical sends; only new attempts start as 'sending'.
}

export async function deliverNewsletterOnce({
  sql,
  post,
  sendBatch,
}: {
  sql: NewsletterSql;
  post: NewsletterPost;
  sendBatch: (subscribers: Subscriber[], idempotencyKey: string) => Promise<number>;
}): Promise<NewsletterResult> {
  // PostgreSQL's unique key elects one sender across manual requests and cron instances.
  // Never remove/retry a claim automatically: a timed-out provider call may have sent mail.
  const claim = await sql`
    INSERT INTO newsletter_sent (slug, recipient_count, status, failed_count)
    VALUES (${post.slug}, 0, 'sending', 0)
    ON CONFLICT (slug) DO NOTHING
    RETURNING slug
  `;
  if (claim.length === 0) return { status: "already_claimed", sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;
  let status: NewsletterResult["status"] = "sent";
  try {
    const rows =
      await sql`SELECT email, unsubscribe_token FROM newsletter_subscribers ORDER BY email`;
    if (
      rows.some((row) => typeof row.email !== "string" || typeof row.unsubscribe_token !== "string")
    ) {
      throw new Error("Invalid subscriber record.");
    }
    const subscribers = rows as Subscriber[];
    for (let index = 0; index < subscribers.length; index += 100) {
      const batch = subscribers.slice(index, index + 100);
      // Supplement the durable database claim with Resend's 24-hour duplicate guard.
      const digest = createHash("sha256")
        .update(JSON.stringify({ post, subscribers: batch }))
        .digest("hex");
      try {
        const accepted = await sendBatch(batch, `newsletter/${digest}`);
        if (!Number.isInteger(accepted) || accepted < 0 || accepted > batch.length) {
          throw new Error("Invalid email provider result.");
        }
        sent += accepted;
        failed += batch.length - accepted;
      } catch {
        failed += batch.length;
      }
    }
    if (failed > 0) status = "needs_review";
  } catch {
    status = "needs_review";
  }

  // If this update fails, the original 'sending' claim remains and still blocks replay.
  // recipient_count counts provider acknowledgements, not inbox delivery confirmation.
  await sql`
    UPDATE newsletter_sent
    SET recipient_count = ${sent}, failed_count = ${failed}, status = ${status}
    WHERE slug = ${post.slug}
  `;
  return { status, sent, failed };
}
