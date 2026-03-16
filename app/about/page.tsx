import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "5.5rem 24px" }}>

      <h1 style={{
        fontFamily: "var(--font-lora), serif",
        fontSize: "clamp(1.75rem, 4vw, 2.375rem)",
        fontWeight: 600, color: "var(--text-1)",
        letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "3rem",
      }}>
        About
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.375rem", marginBottom: "4rem" }}>
        {[
          <>Hi, I&apos;m Jeevesh Krishna. I grew up in <span className="redact">[redacted]</span>, India. I hold a Master of Science in Computer Science, specializing in networks and security, from UMass Amherst, and a Bachelor&apos;s in Computer Science from SSN College of Engineering in Chennai.</>,
          <>I work on networks and security at Cisco. Before that, I interned at NatWest Group building a security application, and at Rivos, a RISC-V chip startup in Santa Clara, on DevOps and infrastructure. Rivos was acquired by Meta while I was there.</>,
          <>Outside the technical work, I think seriously about how technology interacts with the world at large scales: AI safety, biosecurity, nuclear risk, and the governance of systems that could go catastrophically wrong.</>,
          <>Beyond work, I enjoy outdoor activities. I read widely too - books, articles, and papers across whatever I find interesting at the time.</>,
          <>The <a href="/blog" style={{ color: "var(--text-1)", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationThickness: "1px", textDecorationColor: "var(--border)" }}>blog</a> is where I think out loud. The <a href="/reading" style={{ color: "var(--text-1)", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationThickness: "1px", textDecorationColor: "var(--border)" }}>reading list</a> is a window into what I find worth paying attention to.</>,
        ].map((content, i) => (
          <p key={i} style={{ fontSize: "0.9375rem", color: "var(--text-2)", lineHeight: 1.85 }}>
            {content}
          </p>
        ))}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: "3.5rem" }} />

      <section>
        <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text-4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
          Curriculum Vitae
        </p>
        <div style={{ display: "flex", gap: "2rem" }}>
          <a href="/resume" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.9375rem", color: "var(--text-1)", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationThickness: "1px", textDecorationColor: "var(--border)" }}>
            Download CV ↗
          </a>
          <a href={`mailto:${siteConfig.email}`} style={{ fontSize: "0.9375rem", color: "var(--text-1)", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationThickness: "1px", textDecorationColor: "var(--border)" }}>
            Email me ↗
          </a>
        </div>
      </section>

    </div>
  );
}
