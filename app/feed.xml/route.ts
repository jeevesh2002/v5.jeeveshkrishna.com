import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/data";

export const dynamic = "force-static";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = siteConfig.siteUrl;

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : "";
      const categories = post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("");

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(siteConfig.email)} (${escapeXml(siteConfig.name)})</author>
      ${categories}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <description>Things I went deep on - technical rabbit holes, ideas about how technology shapes the world, and whatever I could not stop thinking about long enough to write down.</description>
    <language>en-us</language>
    <managingEditor>${escapeXml(siteConfig.email)} (${escapeXml(siteConfig.name)})</managingEditor>
    <webMaster>${escapeXml(siteConfig.email)} (${escapeXml(siteConfig.name)})</webMaster>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
