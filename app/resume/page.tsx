import type { Metadata } from "next";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
      <div style={{
        display: "flex", justifyContent: "flex-end", alignItems: "center",
        padding: "0.625rem 1.5rem",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        flexShrink: 0,
      }}>
        <a
          href="/resume.pdf"
          download="Jeevesh_Krishna_Arigala_Resume.pdf"
          style={{
            fontSize: "0.8125rem", fontWeight: 500,
            color: "var(--text-1)",
            border: "1px solid var(--border)",
            borderRadius: "5px",
            padding: "0.375rem 0.875rem",
            textDecoration: "none",
          }}
        >
          Save PDF
        </a>
      </div>
      <iframe
        src="/resume.pdf"
        title="Jeevesh Krishna Arigala - Resume"
        style={{ flex: 1, border: "none", width: "100%" }}
      />
    </div>
  );
}
