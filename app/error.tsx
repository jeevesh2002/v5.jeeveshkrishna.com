"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        Error
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
        Something went wrong
      </h1>
      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--text-3)",
          lineHeight: 1.75,
          marginBottom: "3rem",
        }}
      >
        An unexpected error occurred. This is a bug on my end. If it keeps happening, feel free to
        let me know.
      </p>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <button
          onClick={reset}
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--text-1)",
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "5px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            fontSize: "0.875rem",
            color: "var(--text-4)",
            textDecoration: "none",
            padding: "0.5rem 0",
            transition: "color 0.15s",
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
