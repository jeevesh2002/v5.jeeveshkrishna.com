import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Colophon",
  description: "About this site: what it is, how it is built, and the thinking behind it.",
};

export default function ColophonPage() {
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
          marginBottom: "3rem",
        }}
      >
        Colophon
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        <section>
          <h2
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-4)",
              marginBottom: "0.75rem",
            }}
          >
            What this is
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-2)",
              lineHeight: 1.75,
            }}
          >
            This is my personal site. A place where I write about things I am genuinely thinking
            about: networking, security, civilizational risk, space, and whatever else I cannot stop
            turning over in my head. The writing here is exploratory. I am not always certain. I
            follow ideas to see where they lead.
          </p>
        </section>

        <section>
          <h2
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-4)",
              marginBottom: "0.75rem",
            }}
          >
            Content
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-2)",
              lineHeight: 1.75,
            }}
          >
            All ideas here are my own. I sometimes use AI as a writing aid to help express and
            deliver ideas clearly, but the thinking, direction, and substance are entirely mine. The
            views and opinions here do not reflect the positions of any employer, institution, or
            affiliated entity, past or present.
          </p>
        </section>

        <section>
          <h2
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-4)",
              marginBottom: "0.75rem",
            }}
          >
            Built with
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-2)",
              lineHeight: 1.75,
            }}
          >
            Next.js, TypeScript, and Tailwind CSS. No tracking beyond basic analytics. No ads. Posts
            are written in Markdown. The site is statically exported and hosted on Vercel.
          </p>
        </section>

        <section>
          <h2
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-4)",
              marginBottom: "0.75rem",
            }}
          >
            Copyright
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-2)",
              lineHeight: 1.75,
            }}
          >
            Written content on this site is licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-1)", textDecoration: "underline" }}
            >
              CC BY-NC 4.0
            </a>
            . You may share or adapt it with attribution, but not for commercial purposes. The site
            code is released under the MIT license.
          </p>
        </section>

        <section>
          <h2
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-4)",
              marginBottom: "0.75rem",
            }}
          >
            Contact
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-2)",
              lineHeight: 1.75,
            }}
          >
            If something I wrote is factually wrong, I want to know. Reach me at{" "}
            <a
              href="mailto:contactme@jeeveshkrishna.com"
              style={{ color: "var(--text-1)", textDecoration: "underline" }}
            >
              contactme@jeeveshkrishna.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-4)",
              marginBottom: "0.75rem",
            }}
          >
            Past projects and iterations
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-2)",
              lineHeight: 1.75,
            }}
          >
            A record of every iteration and experiment that no longer lives. Discontinued sites,
            replaced projects, and ideas that got outgrown.{" "}
            <Link
              href="/graveyard"
              style={{
                color: "var(--text-1)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                textDecorationThickness: "1px",
                textDecorationColor: "var(--border)",
              }}
            >
              Browse the graveyard
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
