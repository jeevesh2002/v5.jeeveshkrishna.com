import type { Metadata } from "next";
import { experience, education } from "@/lib/data";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
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
          marginBottom: "3.5rem",
        }}
      >
        Work & Education
      </h1>

      <section style={{ marginBottom: "4rem" }}>
        <p
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: "var(--text-4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          Experience
        </p>
        {experience.map((job) => (
          <div key={job.company} style={{ marginBottom: "3rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "0.25rem",
              }}
            >
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-1)" }}>
                {job.company}
              </h3>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-4)" }}>{job.period}</span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-3)", marginBottom: "0.125rem" }}>
              {job.role}
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-4)", marginBottom: "1rem" }}>
              {job.location}
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {job.bullets.map((b, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-2)",
                    lineHeight: 1.75,
                    paddingLeft: "1rem",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "0.65em",
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      backgroundColor: "var(--text-4)",
                      display: "inline-block",
                    }}
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <hr
        style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: "3.5rem" }}
      />

      <section>
        <p
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: "var(--text-4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          Education
        </p>
        {education.map((edu) => (
          <div key={edu.school} style={{ marginBottom: "2.25rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "0.25rem",
              }}
            >
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-1)" }}>
                {edu.school}
              </h3>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-4)" }}>{edu.period}</span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-3)", marginBottom: "0.125rem" }}>
              {edu.degree}
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-4)", marginBottom: "0.625rem" }}>
              {edu.location} · GPA {edu.gpa}
            </p>
            {edu.courses.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                {edu.courses.map((c) => (
                  <span
                    key={c}
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-3)",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "3px",
                      padding: "0.2rem 0.5rem",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
