"use client";

import { useState, useEffect, useCallback } from "react";
import type { InterestSection } from "@/lib/data";

interface FlatLink { title: string; source: string; url: string; description: string; category: string; }

function score(query: string, link: FlatLink): number {
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;
  const t = link.title.toLowerCase(), d = link.description.toLowerCase(), s = link.source.toLowerCase(), c = link.category.toLowerCase();
  let sc = 0;
  if (t.includes(q)) sc += 20;
  if (d.includes(q)) sc += 8;
  for (const term of terms) {
    if (t.startsWith(term)) sc += 12;
    else if (t.includes(term)) sc += 6;
    if (d.includes(term)) sc += 3;
    if (s.includes(term)) sc += 2;
    if (c.includes(term)) sc += 2;
  }
  if (terms.every((term) => (t + d + s + c).includes(term))) sc += 5;
  return sc;
}

const short = (title: string) =>
  title.replace(" (GCR)", "").replace("Global Catastrophic Risks", "Global Risks");

export default function ReadingContent({ sections }: { sections: InterestSection[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(sections[0]?.id ?? "");

  const allLinks: FlatLink[] = sections.flatMap((s) => s.links.map((l) => ({ ...l, category: s.title })));
  const searching = query.trim().length > 0;

  const results: FlatLink[] = searching
    ? allLinks.map((l) => ({ l, s: score(query, l) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.l)
    : [];

  useEffect(() => {
    if (searching) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-12% 0px -75% 0px", threshold: 0 }
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [searching, sections]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Search */}
      <div className="search-wrap" style={{ marginBottom: "2.5rem" }}>
        <input className="search-input" type="text" placeholder="Search reading list…" value={query} onChange={(e) => setQuery(e.target.value)} />
        {searching && (
          <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-4)" }}>{results.length} result{results.length !== 1 ? "s" : ""}</span>
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "var(--text-4)", cursor: "pointer", fontSize: "1.125rem", lineHeight: 1, padding: 0 }}>×</button>
          </div>
        )}
      </div>

      {/* Mobile section jumps */}
      {!searching && (
        <div className="reading-jumps">
          {sections.map((s, i) => (
            <span key={s.id}>
              {i > 0 && <span style={{ color: "var(--border)", marginRight: "1.25rem" }}>·</span>}
              <button onClick={() => scrollTo(s.id)} style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                fontSize: "0.875rem",
                color: active === s.id ? "var(--text-1)" : "var(--text-4)",
                fontWeight: active === s.id ? 500 : 400,
                transition: "color 0.15s",
              }}>
                {short(s.title)}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search results */}
      {searching ? (
        results.length === 0 ? (
          <p style={{ fontSize: "0.9375rem", color: "var(--text-4)" }}>No results for &ldquo;{query}&rdquo;.</p>
        ) : (
          <div>
            {results.map((link, i) => (
              <LinkRow key={link.url} link={link} index={i} category={link.category} />
            ))}
          </div>
        )
      ) : (
        <div className="reading-layout">
          {/* Sidebar */}
          <nav className="reading-sidenav">
            {sections.map((s) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "0.3rem 0", textAlign: "left", width: "100%",
                fontSize: "0.8125rem", lineHeight: 1.45,
                color: active === s.id ? "var(--text-1)" : "var(--text-4)",
                fontWeight: active === s.id ? 500 : 400,
                transition: "color 0.15s",
              }}>
                {short(s.title)}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text-4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  {section.title}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.625rem" }}>
                  {section.links.map((link) => (
                    <LinkCard key={link.url} link={link} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function LinkCard({ link }: { link: { title: string; source: string; url: string; description: string } }) {
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{
      display: "flex", flexDirection: "column", padding: "0.875rem",
      border: "1px solid var(--border)", borderRadius: "5px",
      textDecoration: "none",
    }}>
      <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-1)", lineHeight: 1.4, marginBottom: "0.25rem" }}>{link.title}</span>
      <span style={{ fontSize: "0.75rem", color: "var(--text-4)", marginBottom: "0.5rem" }}>{link.source}</span>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", lineHeight: 1.5, margin: 0 }}>{link.description}</p>
    </a>
  );
}

function LinkRow({ link, index, category }: { link: { title: string; source: string; url: string; description: string }; index: number; category?: string }) {
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{
      display: "block", padding: "0.875rem 0",
      borderTop: index === 0 ? "1px solid var(--border)" : "none",
      borderBottom: "1px solid var(--border)", textDecoration: "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--text-1)", lineHeight: 1.4 }}>{link.title}</span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-4)", flexShrink: 0 }}>{link.source}</span>
      </div>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", lineHeight: 1.55, margin: 0 }}>{link.description}</p>
      {category && (
        <span style={{ display: "inline-block", marginTop: "0.375rem", fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-4)", border: "1px solid var(--border)", borderRadius: "3px", padding: "0.1rem 0.4rem" }}>
          {category}
        </span>
      )}
    </a>
  );
}
