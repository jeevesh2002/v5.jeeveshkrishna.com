import Link from "next/link";
import { Mail, Rss } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { GitHubIcon, LinkedInIcon } from "@/components/BrandIcons";

const socialLinks = [
  {
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    icon: <Mail size={14} strokeWidth={1.5} />,
    external: false,
  },
  {
    label: "GitHub",
    href: siteConfig.github,
    icon: <GitHubIcon size={14} />,
    external: true,
  },
  {
    label: "LinkedIn",
    href: siteConfig.linkedin,
    icon: <LinkedInIcon size={14} />,
    external: true,
  },
];

export default function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid var(--border)", marginTop: "7rem", padding: "2rem 24px" }}
    >
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-4)", margin: 0 }}>
            &copy; {new Date().getFullYear()} Jeevesh Krishna Arigala
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-4)", margin: 0, opacity: 0.7 }}>
            Views are my own. Not those of my employer or any affiliated institution.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {socialLinks.map(({ label, href, icon, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="icon-link"
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-4)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  transition: "color 0.15s",
                }}
              >
                {icon}
                {label}
              </a>
            ))}
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-4)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                transition: "color 0.15s",
              }}
            >
              <Rss size={14} strokeWidth={1.5} />
              RSS
            </a>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              href="/bugs"
              style={{
                fontSize: "0.75rem",
                color: "var(--text-4)",
                textDecoration: "none",
                opacity: 0.7,
              }}
            >
              Bugs &amp; Feedback
            </Link>
            <Link
              href="/colophon"
              style={{
                fontSize: "0.75rem",
                color: "var(--text-4)",
                textDecoration: "none",
                opacity: 0.7,
              }}
            >
              Colophon
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
