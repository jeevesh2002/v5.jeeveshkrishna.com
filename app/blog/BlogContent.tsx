"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

function score(query: string, post: PostMeta): number {
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;

  const title = post.title.toLowerCase();
  const excerpt = (post.excerpt ?? "").toLowerCase();
  const tags = post.tags.join(" ").toLowerCase();
  let s = 0;

  if (title.includes(q)) s += 20;
  if (excerpt.includes(q)) s += 8;
  for (const t of terms) {
    if (title.startsWith(t)) s += 12;
    else if (title.includes(t)) s += 6;
    if (excerpt.includes(t)) s += 3;
    if (tags.includes(t)) s += 4;
  }
  if (terms.every((t) => (title + excerpt + tags).includes(t))) s += 5;
  return s;
}

export default function BlogContent({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const shown = searching
    ? posts
        .map((p) => ({ p, s: score(query, p) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.p)
    : posts;

  return (
    <>
      <div className="search-wrap" style={{ marginBottom: "2.5rem" }}>
        <input
          className="search-input"
          type="text"
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {searching && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-4)" }}>
              {shown.length} of {posts.length}
            </span>
            <button
              onClick={() => setQuery("")}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-4)",
                cursor: "pointer",
                fontSize: "1.125rem",
                lineHeight: 1,
                padding: "0.25rem",
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {shown.length === 0 ? (
        <p style={{ fontSize: "0.9375rem", color: "var(--text-4)" }}>
          {searching ? `No results for "${query}".` : "No posts yet."}
        </p>
      ) : (
        shown.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{
              display: "block",
              padding: "1.5rem 0",
              borderTop: i === 0 ? "1px solid var(--border)" : "none",
              borderBottom: "1px solid var(--border)",
              textDecoration: "none",
            }}
          >
            <div
              style={{ display: "flex", gap: "0.625rem", marginBottom: "0.5rem", flexWrap: "wrap" }}
            >
              <span style={{ fontSize: "0.8125rem", color: "var(--text-4)" }}>
                {formatDate(post.date)}
              </span>
              <span style={{ color: "var(--border)" }}>·</span>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-4)" }}>
                {post.readingTime} min read
              </span>
            </div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-1)",
                lineHeight: 1.35,
                marginBottom: post.excerpt ? "0.5rem" : 0,
              }}
            >
              {post.title}
            </h2>
            {post.excerpt && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-3)",
                  lineHeight: 1.65,
                  marginBottom: post.tags.length ? "0.75rem" : 0,
                }}
              >
                {post.excerpt}
              </p>
            )}
            {post.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
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
          </Link>
        ))
      )}
    </>
  );
}
