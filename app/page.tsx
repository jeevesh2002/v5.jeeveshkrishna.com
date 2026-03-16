import Link from "next/link";
import { siteConfig, interests } from "@/lib/data";
import { getAllPosts, formatDate } from "@/lib/posts";

const recentReads = interests.flatMap((s) => s.links).slice(0, 5);

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px" }}>

      {/* Hero */}
      <section style={{ paddingTop: "7rem", paddingBottom: "5.5rem" }}>
        <h1 style={{
          fontFamily: "var(--font-lora), serif",
          fontSize: "clamp(2.625rem, 7vw, 4rem)",
          fontWeight: 600, lineHeight: 1.06,
          letterSpacing: "-0.025em", color: "var(--text-1)",
          marginBottom: "1.875rem",
        }}>
          Jeevesh Krishna<br />Arigala
        </h1>

        <p style={{
          fontSize: "1rem", color: "var(--text-3)",
          lineHeight: 1.85, maxWidth: "480px", marginBottom: "2.25rem",
        }}>
          I work on networks and security. I think about how technology
          and public policy shape civilization and whether we make it to the
          next level on the Kardashev scale.
        </p>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "GitHub", href: siteConfig.github },
            { label: "LinkedIn", href: siteConfig.linkedin },
            { label: "Email", href: `mailto:${siteConfig.email}` },
          ].map(({ label, href }) => (
            <a key={label} href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              style={{
                fontSize: "0.875rem", color: "var(--text-4)",
                textDecoration: "none", transition: "color 0.15s",
              }}
            >
              {label} ↗
            </a>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: "4.5rem" }} />

      {/* Recent writing */}
      <section style={{ marginBottom: "4.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.75rem" }}>
          <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text-4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Recent Writing
          </span>
          <Link href="/blog" style={{ fontSize: "0.8125rem", color: "var(--text-4)", textDecoration: "none" }}>
            All posts →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p style={{ fontSize: "0.9375rem", color: "var(--text-4)" }}>No posts yet.</p>
        ) : posts.map((post, i) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            gap: "1.5rem", padding: "0.875rem 0",
            borderTop: i === 0 ? "1px solid var(--border)" : "none",
            borderBottom: "1px solid var(--border)", textDecoration: "none",
          }}>
            <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--text-1)", lineHeight: 1.4 }}>
              {post.title}
            </span>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-4)", whiteSpace: "nowrap", flexShrink: 0 }}>
              {formatDate(post.date)}
            </span>
          </Link>
        ))}
      </section>

      {/* Recent reading */}
      <section style={{ marginBottom: "5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.75rem" }}>
          <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text-4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            From the Reading List
          </span>
          <Link href="/reading" style={{ fontSize: "0.8125rem", color: "var(--text-4)", textDecoration: "none" }}>
            Full list →
          </Link>
        </div>

        {recentReads.map((item, i) => (
          <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: "block", padding: "0.875rem 0",
              borderTop: i === 0 ? "1px solid var(--border)" : "none",
              borderBottom: "1px solid var(--border)", textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1.5rem", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--text-1)", lineHeight: 1.4 }}>
                {item.title}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-4)", whiteSpace: "nowrap", flexShrink: 0 }}>
                {item.source}
              </span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", lineHeight: 1.55, margin: 0 }}>
              {item.description}
            </p>
          </a>
        ))}
      </section>

    </div>
  );
}
