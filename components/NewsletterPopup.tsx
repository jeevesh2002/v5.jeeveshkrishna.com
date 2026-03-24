"use client";

import { useState, useEffect } from "react";
import { Mail, X } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISMISSED_KEY = "newsletter_dismissed";

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const timer = setTimeout(() => setVisible(true), 5 * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const trimmed = email.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, hp }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        // mark dismissed so popup never shows again after subscribing
        localStorage.setItem(DISMISSED_KEY, "1");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: "rgba(48, 44, 35, 0.38)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Newsletter signup"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          width: "min(420px, calc(100vw - 48px))",
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "2rem",
          animation: "popup-in 220ms ease both",
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            padding: "0.25rem",
            cursor: "pointer",
            color: "var(--text-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-2)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-4)")}
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        {/* Header */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}
        >
          <Mail size={15} strokeWidth={1.5} style={{ color: "var(--text-3)", flexShrink: 0 }} />
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-lora), serif",
              fontSize: "1.0625rem",
              fontWeight: 600,
              color: "var(--text-1)",
              letterSpacing: "-0.015em",
            }}
          >
            Stay in the loop
          </p>
        </div>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-3)",
            lineHeight: 1.7,
            marginBottom: "1.5rem",
          }}
        >
          These posts take a while to get right. No fixed schedule — when something is ready, it
          goes out. You will not get anything else.
        </p>

        {status === "success" ? (
          <p style={{ fontSize: "0.875rem", color: "var(--text-3)", lineHeight: 1.7 }}>
            You are subscribed. Look out for the next one.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0 }}
              autoComplete="off"
            />

            <div
              style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", alignItems: "center" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                maxLength={254}
                disabled={status === "loading"}
                autoFocus
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  outline: "none",
                  padding: "0.25rem 0",
                  fontSize: "0.875rem",
                  color: "var(--text-2)",
                  flex: 1,
                  minWidth: "160px",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderBottomColor = "var(--text-3)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderBottomColor = "var(--border)";
                }}
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "0.875rem",
                  color: status === "loading" ? "var(--text-4)" : "var(--text-1)",
                  cursor: status === "loading" || !email ? "default" : "pointer",
                  opacity: !email ? 0.4 : 1,
                  transition: "color 0.15s, opacity 0.15s",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  textDecorationThickness: "1px",
                  textDecorationColor: "var(--border)",
                  flexShrink: 0,
                }}
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>

            {status === "error" && (
              <p
                style={{ marginTop: "0.5rem", fontSize: "0.8125rem", color: "var(--text-3)" }}
              >
                {errorMsg}
              </p>
            )}
          </form>
        )}
      </div>
    </>
  );
}
