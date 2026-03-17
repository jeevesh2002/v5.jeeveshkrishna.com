import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import BlogContent from "./BlogContent";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "5.5rem 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-lora), serif",
            fontSize: "clamp(1.75rem, 4vw, 2.375rem)",
            fontWeight: 600,
            color: "var(--text-1)",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
          }}
        >
          Blog
        </h1>
        <a
          href="/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link"
          title="Subscribe via RSS"
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-4)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            flexShrink: 0,
            transition: "color 0.15s",
          }}
        >
          <Rss size={13} strokeWidth={1.5} />
          RSS
        </a>
      </div>
      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--text-3)",
          lineHeight: 1.7,
          marginBottom: "3rem",
        }}
      >
        Things I went deep on - technical rabbit holes, ideas about how technology shapes the world,
        and whatever I could not stop thinking about long enough to write down.
      </p>
      <BlogContent posts={posts} />
    </div>
  );
}
