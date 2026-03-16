import type { Metadata } from "next";
import { projects } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "5.5rem 24px" }}>
      <h1 style={{
        fontFamily: "var(--font-lora), serif",
        fontSize: "clamp(1.75rem, 4vw, 2.375rem)", fontWeight: 600,
        color: "var(--text-1)", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "3.5rem",
      }}>
        Projects
      </h1>

      {projects.map((project, i) => (
        <div key={project.title} style={{
          padding: "1.75rem 0",
          borderTop: i === 0 ? "1px solid var(--border)" : "none",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "0.625rem" }}>
            {project.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.06em",
                textTransform: "uppercase", color: "var(--text-4)",
                border: "1px solid var(--border)", borderRadius: "3px", padding: "0.1rem 0.45rem",
              }}>
                {tag}
              </span>
            ))}
          </div>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-1)", marginBottom: "0.875rem", lineHeight: 1.35 }}>
            {project.title}
          </h2>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {project.bullets.map((b, j) => (
              <li key={j} style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.75, paddingLeft: "1rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, top: "0.65em", width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "var(--text-4)", display: "inline-block" }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
