import type { Metadata } from "next";
import { interests } from "@/lib/data";

export const metadata: Metadata = { title: "Interests" };

export default function InterestsPage() {
  return (
    <div style={{ maxWidth: "672px", margin: "0 auto", padding: "4rem 20px" }}>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#111111",
          letterSpacing: "-0.02em",
          marginBottom: "0.75rem",
        }}
      >
        Interests & Reading
      </h1>
      <p
        style={{
          fontSize: "0.9375rem",
          color: "#6b7280",
          lineHeight: 1.75,
          marginBottom: "3.5rem",
          maxWidth: "520px",
        }}
      >
        Things I find myself thinking about beyond the day-to-day of code and systems. A curated
        list of topics, resources, and articles that shape how I see the world.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
        {interests.map((section, sIdx) => (
          <section key={section.id}>
            {/* Section header */}
            <div style={{ marginBottom: "1.75rem" }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#6b7280",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "0.625rem",
                }}
              >
                {String(sIdx + 1).padStart(2, "0")}
              </p>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "#111111",
                  marginBottom: "0.75rem",
                }}
              >
                {section.title}
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#4b5563",
                  lineHeight: 1.75,
                }}
              >
                {section.intro}
              </p>
            </div>

            {/* Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {section.links.map((link, i) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    padding: "1rem 0",
                    borderTop: i === 0 ? "1px solid #e5e7eb" : "none",
                    borderBottom: "1px solid #e5e7eb",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      gap: "0.25rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 500,
                        color: "#1e3a5f",
                      }}
                    >
                      {link.title}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                        flexShrink: 0,
                      }}
                    >
                      {link.source}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#6b7280",
                      lineHeight: 1.6,
                    }}
                  >
                    {link.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Note */}
      <div
        style={{
          marginTop: "4rem",
          padding: "1.25rem",
          backgroundColor: "#f4f4f2",
          borderRadius: "6px",
          border: "1px solid #e5e7eb",
        }}
      >
        <p style={{ fontSize: "0.8125rem", color: "#6b7280", lineHeight: 1.6 }}>
          This page is a living document - I update it as I encounter new resources worth sharing.
          If you have suggestions or want to discuss any of these topics,{" "}
          <a
            href="mailto:jarigala@umass.edu"
            style={{ color: "#1e3a5f", textDecoration: "underline", textUnderlineOffset: "2px" }}
          >
            reach out
          </a>
          .
        </p>
      </div>
    </div>
  );
}
