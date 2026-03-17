import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = { title: "Bugs & Feedback" };

const knownBugs: { id: string; description: string; severity: "minor" | "cosmetic" }[] = [
  // Add known bugs here as they are discovered. Example:
  // { id: "BUG-001", description: "...", severity: "minor" },
];

export default function BugsPage() {
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
          marginBottom: "1rem",
        }}
      >
        Bugs &amp; Feedback
      </h1>

      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--text-3)",
          lineHeight: 1.7,
          marginBottom: "3.5rem",
        }}
      >
        I built this site myself. It is a personal project, not a production product, so the
        occasional bug is a real possibility. If something looks broken or behaves oddly, I
        genuinely want to know.
      </p>

      {/* Known bugs */}
      <section style={{ marginBottom: "3.5rem" }}>
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
          Known bugs
        </p>

        {knownBugs.length === 0 ? (
          <p style={{ fontSize: "0.9375rem", color: "var(--text-3)", lineHeight: 1.7 }}>
            None at the moment. If you find one, you are ahead of me.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {knownBugs.map((bug) => (
              <li
                key={bug.id}
                style={{
                  display: "flex",
                  gap: "0.875rem",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color: "var(--text-4)",
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                    fontFamily: "var(--font-inter), sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  {bug.id}
                </span>
                <span style={{ fontSize: "0.9375rem", color: "var(--text-2)", lineHeight: 1.7 }}>
                  {bug.description}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr
        style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: "3.5rem" }}
      />

      {/* Report a bug */}
      <section style={{ marginBottom: "3.5rem" }}>
        <p
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: "var(--text-4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Found something?
        </p>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--text-2)",
            lineHeight: 1.85,
            marginBottom: "1rem",
          }}
        >
          If you run into a bug, a broken layout, something that does not render correctly, or just
          something that feels off - please reach out. A quick description of what you saw and what
          browser or device you were on is all I need.
        </p>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--text-2)",
            lineHeight: 1.85,
          }}
        >
          Same goes for feature ideas. If there is something you think would make the site better, I
          am open to hearing it.
        </p>
        <a
          href={`mailto:${siteConfig.email}?subject=Bug report`}
          style={{
            display: "inline-block",
            marginTop: "1.25rem",
            fontSize: "0.875rem",
            color: "var(--text-1)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            textDecorationThickness: "1px",
            textDecorationColor: "var(--border)",
            transition: "color 0.15s",
          }}
        >
          {siteConfig.email}
        </a>
      </section>

      <hr
        style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: "3.5rem" }}
      />

      {/* Topic collaboration */}
      <section>
        <p
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: "var(--text-4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Want to suggest a topic or collaborate?
        </p>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--text-2)",
            lineHeight: 1.85,
            marginBottom: "1rem",
          }}
        >
          If there is something you have been thinking about and would like me to write about, I am
          always interested. Some of the best writing starts with a question someone else is sitting
          with.
        </p>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--text-2)",
            lineHeight: 1.85,
          }}
        >
          If you want to work through an idea together and build something worth posting, that is
          also on the table. Just email me with a rough sense of what you have in mind.
        </p>
        <a
          href={`mailto:${siteConfig.email}?subject=Topic suggestion`}
          style={{
            display: "inline-block",
            marginTop: "1.25rem",
            fontSize: "0.875rem",
            color: "var(--text-1)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            textDecorationThickness: "1px",
            textDecorationColor: "var(--border)",
            transition: "color 0.15s",
          }}
        >
          {siteConfig.email}
        </a>
      </section>
    </div>
  );
}
