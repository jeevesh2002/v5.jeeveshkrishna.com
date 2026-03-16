"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/reading", label: "Reading" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    return document.documentElement.getAttribute("data-theme") === "dark";
  });

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: "var(--nav-bg)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>

          <Link href="/" style={{
            fontFamily: "var(--font-lora), serif",
            fontWeight: 600, fontSize: "1.0625rem",
            color: "var(--text-1)", textDecoration: "none", letterSpacing: "-0.02em",
          }}>
            JK
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
            {links.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link key={href} href={href} style={{
                  fontSize: "0.875rem", fontWeight: active ? 500 : 400,
                  color: active ? "var(--text-1)" : "var(--text-4)",
                  textDecoration: "none", transition: "color 0.15s",
                }}>
                  {label}
                </Link>
              );
            })}

            <button
              onClick={toggle}
              aria-label="Toggle theme"
              style={{
                background: "none", border: "1px solid var(--border)",
                borderRadius: "5px", width: "28px", height: "28px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-4)", cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
                flexShrink: 0,
                visibility: isDark === null ? "hidden" : "visible",
              }}
            >
              {isDark ? (
                // Sun
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              ) : (
                // Moon
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>

        </nav>
      </div>
    </header>
  );
}
