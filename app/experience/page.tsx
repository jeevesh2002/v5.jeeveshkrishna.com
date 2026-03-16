import type { Metadata } from "next";
import { experience, education } from "@/lib/data";

export const metadata: Metadata = { title: "Experience" };

const sectionLabel = {
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#6b7280",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  marginBottom: "2rem",
};

const periodStyle = {
  fontSize: "0.8125rem",
  color: "#6b7280",
  fontWeight: 400,
  whiteSpace: "nowrap" as const,
};

export default function ExperiencePage() {
  return (
    <div style={{ maxWidth: "672px", margin: "0 auto", padding: "4rem 20px" }}>

      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#111111",
          letterSpacing: "-0.02em",
          marginBottom: "3.5rem",
        }}
      >
        Experience & Education
      </h1>

      {/* Work Experience */}
      <section style={{ marginBottom: "4rem" }}>
        <p style={sectionLabel}>Work</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {experience.map((job) => (
            <div key={job.company}>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.375rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#111111",
                  }}
                >
                  {job.company}
                </h3>
                <span style={periodStyle}>{job.period}</span>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#1e3a5f",
                  fontWeight: 500,
                  marginBottom: "0.25rem",
                }}
              >
                {job.role}
              </p>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "#9ca3af",
                  marginBottom: "1rem",
                }}
              >
                {job.location}
              </p>
              {/* Bullets */}
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {job.bullets.map((b, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "0.875rem",
                      color: "#374151",
                      lineHeight: 1.7,
                      paddingLeft: "1rem",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "0.6em",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: "#1e3a5f",
                        display: "inline-block",
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", marginBottom: "4rem" }} />

      {/* Education */}
      <section>
        <p style={sectionLabel}>Education</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {education.map((edu) => (
            <div key={edu.school}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.375rem",
                }}
              >
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#111111" }}>
                  {edu.school}
                </h3>
                <span style={periodStyle}>{edu.period}</span>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#1e3a5f",
                  fontWeight: 500,
                  marginBottom: "0.25rem",
                }}
              >
                {edu.degree}
              </p>
              <p style={{ fontSize: "0.8125rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
                {edu.location} · GPA {edu.gpa}
              </p>
              {edu.courses.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.75rem" }}>
                  {edu.courses.map((c) => (
                    <span
                      key={c}
                      style={{
                        fontSize: "0.75rem",
                        color: "#374151",
                        backgroundColor: "#f4f4f2",
                        border: "1px solid #e5e7eb",
                        borderRadius: "4px",
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
        </div>
      </section>

    </div>
  );
}
