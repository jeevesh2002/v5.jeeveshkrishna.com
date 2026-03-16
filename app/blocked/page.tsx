import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Access Restricted",
};

export default function BlockedPage() {
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px" }}>
      <section style={{ paddingTop: "7rem", paddingBottom: "5.5rem" }}>
        <p style={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          color: "var(--text-4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
        }}>
          403 Restricted
        </p>

        <h1 style={{
          fontFamily: "var(--font-lora), serif",
          fontSize: "clamp(2rem, 6vw, 3rem)",
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          color: "var(--text-1)",
          marginBottom: "1.5rem",
        }}>
          This site is only available in the United States.
        </h1>

        <p style={{
          fontSize: "1rem",
          color: "var(--text-3)",
          lineHeight: 1.85,
          maxWidth: "480px",
          marginBottom: "2.25rem",
        }}>
          Access is currently restricted to US-based visitors. If you believe
          this is a mistake, feel free to reach out.
        </p>

        <Link
          href="mailto:contactme@jeeveshkrishna.com"
          style={{
            fontSize: "0.875rem",
            color: "var(--text-4)",
            textDecoration: "none",
          }}
        >
          Contact me ↗
        </Link>
      </section>
    </div>
  );
}
