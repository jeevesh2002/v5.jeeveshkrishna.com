import { siteConfig } from "@/lib/data";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: "7rem", padding: "2rem 24px" }}>
      <div style={{
        maxWidth: "640px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem",
      }}>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-4)" }}>
          © {new Date().getFullYear()} Jeevesh Krishna Arigala
        </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[
            { label: "Email", href: `mailto:${siteConfig.email}` },
            { label: "GitHub", href: siteConfig.github },
            { label: "LinkedIn", href: siteConfig.linkedin },
          ].map(({ label, href }) => (
            <a key={label} href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              style={{ fontSize: "0.8125rem", color: "var(--text-4)", textDecoration: "none" }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
