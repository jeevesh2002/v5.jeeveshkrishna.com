import type { Metadata } from "next";
import Link from "next/link";
import { getAllSlugs, getPostBySlug, formatDate } from "@/lib/posts";
import { notFound } from "next/navigation";
import Comments from "@/components/Comments";
import ShareButtons from "@/components/ShareButtons";
import NewsletterSidebar from "@/components/NewsletterSidebar";
import { siteConfig } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  const url = `${siteConfig.siteUrl}/blog/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      siteName: siteConfig.name,
      publishedTime: post.date,
      authors: [siteConfig.name],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "5.5rem 24px" }}>
      <Link
        href="/blog"
        style={{
          fontSize: "0.8125rem",
          color: "var(--text-4)",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: "3rem",
        }}
      >
        ← All posts
      </Link>

      {/* Two-column layout: main content + sticky sidebar on desktop */}
      <div style={{ display: "flex", gap: "3.5rem", alignItems: "flex-start" }}>
        {/* Main content column */}
        <div style={{ minWidth: 0, flex: 1, maxWidth: "640px" }}>

      <article>
        <header style={{ marginBottom: "3rem" }}>
          {post.tags.length > 0 && (
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1rem" }}
            >
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--text-4)",
                    border: "1px solid var(--border)",
                    borderRadius: "3px",
                    padding: "0.1rem 0.45rem",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1
            style={{
              fontFamily: "var(--font-lora), serif",
              fontSize: "clamp(1.625rem, 4vw, 2.125rem)",
              fontWeight: 600,
              color: "var(--text-1)",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            {post.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--text-3)" }}>
              Jeevesh Krishna Arigala
            </span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span style={{ fontSize: "0.875rem", color: "var(--text-4)" }}>
              {formatDate(post.date)}
            </span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span style={{ fontSize: "0.875rem", color: "var(--text-4)" }}>
              {post.readingTime} min read
            </span>
          </div>

          {post.excerpt && (
            <p
              style={{
                marginTop: "1.375rem",
                fontSize: "0.9375rem",
                color: "var(--text-3)",
                lineHeight: 1.75,
                fontStyle: "italic",
                borderLeft: "2px solid var(--border)",
                paddingLeft: "1rem",
              }}
            >
              {post.excerpt}
            </p>
          )}
        </header>

        <hr
          style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: "2.5rem" }}
        />
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      <ShareButtons title={post.title} slug={slug} />

      <Comments slug={slug} />

      <div style={{ marginTop: "3rem" }}>
        <Link
          href="/blog"
          style={{ fontSize: "0.875rem", color: "var(--text-3)", textDecoration: "none" }}
        >
          ← Back to all posts
        </Link>
      </div>

        </div>{/* end main content column */}

        {/* Newsletter sidebar — visible only at ≥900px via CSS class */}
        <aside className="post-sidebar" style={{ position: "sticky", top: "88px" }}>
          <NewsletterSidebar />
        </aside>

      </div>{/* end two-column flex */}
    </div>
  );
}
