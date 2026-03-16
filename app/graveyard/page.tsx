import type { Metadata } from "next";
import { discontinuedSites } from "@/lib/data";

export const metadata: Metadata = { title: "Graveyard" };

export default function GraveyardPage() {
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "5.5rem 24px" }}>
      <h1 style={{
        fontFamily: "var(--font-lora), serif",
        fontSize: "clamp(1.75rem, 4vw, 2.375rem)", fontWeight: 600,
        color: "var(--text-1)", letterSpacing: "-0.025em", lineHeight: 1.1,
        marginBottom: "0.875rem",
      }}>
        Graveyard
      </h1>

      <p style={{
        fontSize: "0.9375rem", color: "var(--text-3)", lineHeight: 1.75,
        marginBottom: "3.5rem",
      }}>
        Every site I have built that no longer exists - iterations of this site, random experiments, and other projects that got discontinued, replaced, or outgrown.
      </p>

      {discontinuedSites.length === 0 ? (
        <p style={{ fontSize: "0.875rem", color: "var(--text-4)", lineHeight: 1.75 }}>
          Nothing here yet.
        </p>
      ) : (
        discontinuedSites.map((site, i) => (
          <div key={site.name} style={{
            padding: "1.75rem 0",
            borderTop: i === 0 ? "1px solid var(--border)" : "none",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-1)", lineHeight: 1.35 }}>
                {site.archiveUrl ? (
                  <a href={site.archiveUrl} target="_blank" rel="noopener noreferrer" style={{
                    color: "var(--text-1)", textDecoration: "underline",
                    textUnderlineOffset: "3px", textDecorationThickness: "1px",
                    textDecorationColor: "var(--border)",
                  }}>
                    {site.name}
                  </a>
                ) : site.name}
              </h2>
              <span style={{
                fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.06em",
                textTransform: "uppercase", color: "var(--text-4)",
                border: "1px solid var(--border)", borderRadius: "3px", padding: "0.1rem 0.45rem",
              }}>
                discontinued
              </span>
            </div>

            <p style={{ fontSize: "0.8125rem", color: "var(--text-4)", marginBottom: "0.625rem" }}>
              {site.period}
            </p>

            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.75, marginBottom: site.tech.length > 0 ? "0.875rem" : 0 }}>
              {site.description}
            </p>

            {site.reason && (
              <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", lineHeight: 1.7, marginBottom: site.tech.length > 0 ? "0.875rem" : 0, fontStyle: "italic" }}>
                {site.reason}
              </p>
            )}

            {site.tech.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                {site.tech.map((t) => (
                  <span key={t} style={{
                    fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.06em",
                    textTransform: "uppercase", color: "var(--text-4)",
                    border: "1px solid var(--border)", borderRadius: "3px", padding: "0.1rem 0.45rem",
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
