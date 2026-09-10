import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { siteConfig } from "@/lib/data";
import { buildNewsletterHtml, buildNewsletterText } from "@/lib/email";
import { deliverNewsletterOnce, type NewsletterPost, type NewsletterSql } from "@/lib/newsletter";

export function newsletterDb() {
  const url = process.env.v5sitedb_DATABASE_URL;
  if (!url) throw new Error("Database not configured.");
  return neon(url);
}

export async function sendNewsletter(sql: NewsletterSql, post: NewsletterPost) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Email service not configured.");
  const resend = new Resend(key);
  const postUrl = `${siteConfig.siteUrl}/blog/${encodeURIComponent(post.slug)}`;

  return deliverNewsletterOnce({
    sql,
    post,
    async sendBatch(subscribers, idempotencyKey) {
      const emails = subscribers.map((subscriber) => {
        const unsubscribeUrl = `${siteConfig.siteUrl}/api/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`;
        return {
          from: "Jeevesh Krishna <newsletter@jeeveshkrishna.com>",
          to: subscriber.email,
          subject: `New post: ${post.title}`,
          html: buildNewsletterHtml({ ...post, postUrl, unsubscribeUrl }),
          text: buildNewsletterText({ ...post, postUrl, unsubscribeUrl }),
          headers: {
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        };
      });
      const { data, error } = await resend.batch.send(emails, { idempotencyKey });
      if (error) throw new Error("Email batch was not acknowledged.");
      return data?.data?.length ?? 0;
    },
  });
}
