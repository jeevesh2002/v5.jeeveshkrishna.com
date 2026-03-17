import type { Metadata } from "next";
import { discontinuedSites } from "@/lib/data";

export const metadata: Metadata = { title: "Graveyard" };

export default function GraveyardPage() {
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
          marginBottom: "0.875rem",
        }}
      >
        Graveyard
      </h1>

      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--text-3)",
          lineHeight: 1.75,
          marginBottom: "3rem",
        }}
      >
        Every site I have built that no longer exists - iterations of this site, random experiments,
        and other projects that got discontinued, replaced, or outgrown.
      </p>

      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {discontinuedSites.map((site) => (
          <li
            key={site.name}
            style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}
          >
            <a
              href={site.archiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.9375rem",
                color: "var(--text-1)",
                fontWeight: 500,
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              {site.name}
            </a>
            <span
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-4)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                textDecorationThickness: "1px",
                textDecorationColor: "var(--border)",
              }}
            >
              {site.archiveUrl?.replace("https://", "")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
