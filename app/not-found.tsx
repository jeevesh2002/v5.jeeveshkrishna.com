import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "404 - Page Not Found" };

export default function NotFound() {
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "5.5rem 24px" }}>
      <p
        style={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          color: "var(--text-4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "1.25rem",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--font-lora), serif",
          fontSize: "clamp(1.75rem, 4vw, 2.375rem)",
          fontWeight: 600,
          color: "var(--text-1)",
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          marginBottom: "1.25rem",
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--text-3)",
          lineHeight: 1.75,
          marginBottom: "3rem",
        }}
      >
        This page does not exist. It may have been moved, deleted, or never existed. If you followed
        a link here, it is probably outdated.
      </p>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--text-1)",
            textDecoration: "none",
            border: "1px solid var(--border)",
            borderRadius: "5px",
            padding: "0.5rem 1rem",
            transition: "border-color 0.15s",
          }}
        >
          Go home
        </Link>
        <Link
          href="/blog"
          style={{
            fontSize: "0.875rem",
            color: "var(--text-4)",
            textDecoration: "none",
            padding: "0.5rem 0",
            transition: "color 0.15s",
          }}
        >
          Browse the blog
        </Link>
      </div>
    </div>
  );
}
