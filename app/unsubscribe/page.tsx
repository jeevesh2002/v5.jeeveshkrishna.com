import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = { title: "Unsubscribe" };

const messages: Record<string, { heading: string; body: string }> = {
  success: {
    heading: "You are unsubscribed.",
    body: "Your email has been removed. You will not receive any more posts.",
  },
  "not-found": {
    heading: "Link not recognized.",
    body: "That unsubscribe link has already been used or is no longer valid.",
  },
  invalid: {
    heading: "Invalid link.",
    body: "This unsubscribe link does not look right. Try clicking the link in your email again.",
  },
  error: {
    heading: "Something went wrong.",
    body: `Could not process your request. Please email ${siteConfig.email} and I will remove you manually.`,
  },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const msg = (status ? messages[status] : undefined) ?? {
    heading: "Unsubscribe",
    body: "Use the link in your email to unsubscribe from future posts.",
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "5.5rem 24px" }}>
      <h1
        style={{
          fontFamily: "var(--font-lora), serif",
          fontSize: "clamp(1.75rem, 4vw, 2.375rem)",
          fontWeight: 600,
          color: "var(--text-1)",
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
          marginBottom: "1.5rem",
        }}
      >
        {msg.heading}
      </h1>
      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--text-2)",
          lineHeight: 1.85,
          marginBottom: "2.5rem",
        }}
      >
        {msg.body}
      </p>
      <Link
        href="/blog"
        style={{
          fontSize: "0.875rem",
          color: "var(--text-3)",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          textDecorationThickness: "1px",
          textDecorationColor: "var(--border)",
        }}
      >
        Back to blog
      </Link>
    </div>
  );
}
