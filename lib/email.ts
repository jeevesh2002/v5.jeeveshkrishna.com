import { siteConfig } from "@/lib/data";

// ── Helpers ───────────────────────────────────────────────────────────────────

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Newsletter email (new post notification) ──────────────────────────────────

export function buildNewsletterHtml(opts: {
  title: string;
  excerpt: string;
  postUrl: string;
  readingTime: number;
  date: string;
  unsubscribeUrl: string;
}): string {
  const { title, excerpt, postUrl, readingTime, date, unsubscribeUrl } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f3ede3;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3ede3;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #d5cdbf;">
              <p style="margin:0;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:13px;color:#a89e95;letter-spacing:0.08em;text-transform:uppercase;">
                Jeevesh Krishna
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:32px;padding-bottom:32px;">
              <p style="margin:0 0 10px;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:12px;color:#a89e95;letter-spacing:0.08em;text-transform:uppercase;">
                New post &middot; ${escapeHtml(formatDate(date))} &middot; ${readingTime} min read
              </p>
              <h1 style="margin:0 0 20px;font-family:'Georgia',serif;font-size:26px;font-weight:600;color:#302c23;line-height:1.2;letter-spacing:-0.02em;">
                ${escapeHtml(title)}
              </h1>
              ${
                excerpt
                  ? `<p style="margin:0 0 28px;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:15px;color:#48443b;line-height:1.75;">${escapeHtml(excerpt)}</p>`
                  : ""
              }
              <a href="${postUrl}" style="display:inline-block;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:14px;color:#302c23;text-decoration:underline;text-underline-offset:3px;">
                Read the full post &rarr;
              </a>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid #d5cdbf;padding-top:28px;">
              <p style="margin:0;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:12px;color:#a89e95;line-height:1.6;">
                You are receiving this because you subscribed to updates from
                <a href="${siteConfig.siteUrl}" style="color:#a89e95;">${siteConfig.siteUrl}</a>.
                Posts are infrequent and original - roughly one a month when inspiration strikes.
                <br /><br />
                <a href="${unsubscribeUrl}" style="color:#a89e95;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildNewsletterText(opts: {
  title: string;
  excerpt: string;
  postUrl: string;
  unsubscribeUrl: string;
}): string {
  const { title, excerpt, postUrl, unsubscribeUrl } = opts;
  return [
    `New post: ${title}`,
    "",
    ...(excerpt ? [excerpt, ""] : []),
    `Read the full post: ${postUrl}`,
    "",
    "---",
    `You are receiving this because you subscribed at ${siteConfig.siteUrl}.`,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");
}

// ── Welcome email ─────────────────────────────────────────────────────────────

export function buildWelcomeHtml(opts: { unsubscribeUrl: string }): string {
  const { unsubscribeUrl } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
</head>
<body style="margin:0;padding:0;background:#f3ede3;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3ede3;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #d5cdbf;">
              <p style="margin:0;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:13px;color:#a89e95;letter-spacing:0.08em;text-transform:uppercase;">
                Jeevesh Krishna
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:32px;padding-bottom:32px;">
              <h1 style="margin:0 0 20px;font-family:'Georgia',serif;font-size:26px;font-weight:600;color:#302c23;line-height:1.2;letter-spacing:-0.02em;">
                You are subscribed.
              </h1>
              <p style="margin:0 0 16px;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:15px;color:#48443b;line-height:1.75;">
                When I publish something new, it will land in your inbox. These posts are original and take real work to get right - finding the angle, doing the research, sitting with the idea long enough to write it well.
              </p>
              <p style="margin:0 0 28px;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:15px;color:#48443b;line-height:1.75;">
                I aim for at least one a month, but there is no fixed schedule. You will not get anything other than new posts.
              </p>
              <a href="${siteConfig.siteUrl}/blog" style="display:inline-block;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:14px;color:#302c23;text-decoration:underline;text-underline-offset:3px;">
                Browse existing posts &rarr;
              </a>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid #d5cdbf;padding-top:28px;">
              <p style="margin:0;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:12px;color:#a89e95;line-height:1.6;">
                You subscribed at
                <a href="${siteConfig.siteUrl}" style="color:#a89e95;">${siteConfig.siteUrl}</a>.
                <br /><br />
                <a href="${unsubscribeUrl}" style="color:#a89e95;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildWelcomeText(opts: { unsubscribeUrl: string }): string {
  const { unsubscribeUrl } = opts;
  return [
    "You are subscribed.",
    "",
    "When I publish something new, it will land in your inbox. These posts are original and take real work - finding the angle, doing the research, sitting with the idea long enough to write it well.",
    "",
    "I aim for at least one a month, but there is no fixed schedule. You will not get anything other than new posts.",
    "",
    `Browse existing posts: ${siteConfig.siteUrl}/blog`,
    "",
    "---",
    `You subscribed at ${siteConfig.siteUrl}.`,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");
}

// ── Owner notification emails ─────────────────────────────────────────────────

export function buildCommentNotificationHtml(opts: {
  slug: string;
  name: string;
  preview: string;
  postUrl: string;
}): string {
  const { slug, name, preview, postUrl } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New comment on /${escapeHtml(slug)}</title>
</head>
<body style="margin:0;padding:0;background:#f3ede3;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3ede3;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #d5cdbf;">
              <p style="margin:0;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:13px;color:#a89e95;letter-spacing:0.08em;text-transform:uppercase;">
                Jeevesh Krishna &middot; New Comment
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:32px;padding-bottom:32px;">
              <p style="margin:0 0 8px;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:12px;color:#a89e95;letter-spacing:0.08em;text-transform:uppercase;">
                /${escapeHtml(slug)}
              </p>
              <h1 style="margin:0 0 20px;font-family:'Georgia',serif;font-size:22px;font-weight:600;color:#302c23;line-height:1.2;letter-spacing:-0.02em;">
                ${escapeHtml(name)} left a comment
              </h1>
              <p style="margin:0 0 28px;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:15px;color:#48443b;line-height:1.75;border-left:3px solid #d5cdbf;padding-left:16px;">
                ${escapeHtml(preview)}${preview.length >= 300 ? "..." : ""}
              </p>
              <a href="${postUrl}" style="display:inline-block;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:14px;color:#302c23;text-decoration:underline;text-underline-offset:3px;">
                View post &rarr;
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildCommentNotificationText(opts: {
  slug: string;
  name: string;
  preview: string;
  postUrl: string;
}): string {
  const { slug, name, preview, postUrl } = opts;
  return [
    `New comment on /${slug}`,
    "",
    `From: ${name}`,
    "",
    preview + (preview.length >= 300 ? "..." : ""),
    "",
    `View post: ${postUrl}`,
  ].join("\n");
}

export function buildSubscribeNotificationHtml(opts: {
  email: string;
  subscribedAt: string;
}): string {
  const { email, subscribedAt } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New subscriber</title>
</head>
<body style="margin:0;padding:0;background:#f3ede3;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3ede3;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #d5cdbf;">
              <p style="margin:0;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:13px;color:#a89e95;letter-spacing:0.08em;text-transform:uppercase;">
                Jeevesh Krishna &middot; New Subscriber
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:32px;padding-bottom:32px;">
              <h1 style="margin:0 0 24px;font-family:'Georgia',serif;font-size:22px;font-weight:600;color:#302c23;line-height:1.2;letter-spacing:-0.02em;">
                New subscriber
              </h1>
              <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="font-family:'Inter',Helvetica,Arial,sans-serif;font-size:12px;color:#a89e95;letter-spacing:0.06em;text-transform:uppercase;padding-right:20px;padding-bottom:10px;white-space:nowrap;">Email</td>
                  <td style="font-family:'Inter',Helvetica,Arial,sans-serif;font-size:15px;color:#302c23;padding-bottom:10px;">${escapeHtml(email)}</td>
                </tr>
                <tr>
                  <td style="font-family:'Inter',Helvetica,Arial,sans-serif;font-size:12px;color:#a89e95;letter-spacing:0.06em;text-transform:uppercase;padding-right:20px;white-space:nowrap;">Time</td>
                  <td style="font-family:'Inter',Helvetica,Arial,sans-serif;font-size:15px;color:#302c23;">${escapeHtml(subscribedAt)}</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildSubscribeNotificationText(opts: {
  email: string;
  subscribedAt: string;
}): string {
  const { email, subscribedAt } = opts;
  return ["New subscriber", "", `Email: ${email}`, `Time:  ${subscribedAt}`].join("\n");
}
