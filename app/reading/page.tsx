import type { Metadata } from "next";
import { interests, siteConfig } from "@/lib/data";
import ReadingContent from "./ReadingContent";

export const metadata: Metadata = { title: "Reading" };

export default function ReadingPage() {
  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "5.5rem 24px" }}>
      <div style={{ maxWidth: "560px", marginBottom: "3rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-lora), serif",
            fontSize: "clamp(1.75rem, 4vw, 2.375rem)",
            fontWeight: 600,
            color: "var(--text-1)",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            marginBottom: "0.75rem",
          }}
        >
          Reading List
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-3)", lineHeight: 1.7 }}>
          Things that shaped how I think. Updated as I go.
        </p>
      </div>

      <ReadingContent sections={interests} />

      <p
        style={{
          marginTop: "4rem",
          fontSize: "0.8125rem",
          color: "var(--text-4)",
          lineHeight: 1.6,
        }}
      >
        Have a suggestion?{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          style={{
            color: "var(--text-3)",
            textDecoration: "underline",
            textUnderlineOffset: "2px",
            textDecorationThickness: "1px",
          }}
        >
          Email me
        </a>
        .
      </p>
    </div>
  );
}
