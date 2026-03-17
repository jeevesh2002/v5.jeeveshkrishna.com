"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="scroll-top-btn"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "2.25rem",
        height: "2.25rem",
        borderRadius: "50%",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--text-4)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.2s, color 0.15s",
        zIndex: 50,
      }}
    >
      <ArrowUp size={14} strokeWidth={1.5} />
    </button>
  );
}
