"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISMISSED_KEY = "newsletter_dismissed";

export default function NewsletterSidebar() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [alreadySubscribed, setAlreadySubscribed] = useState(
    () => typeof window !== "undefined" && !!localStorage.getItem(DISMISSED_KEY),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const trimmed = email.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setErrorMsg("Valid email required.");
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
        localStorage.setItem(DISMISSED_KEY, "1");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "1.25rem",
        background: "var(--surface)",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.625rem" }}
      >
        <Mail size={13} strokeWidth={1.5} style={{ color: "var(--text-3)", flexShrink: 0 }} />
        <p
          style={{
            margin: 0,
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--text-1)",
            letterSpacing: "-0.01em",
          }}
        >
          Get new posts
        </p>
      </div>

      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--text-3)",
          lineHeight: 1.65,
          marginBottom: "1rem",
        }}
      >
        No schedule. When something is ready, it goes out.
      </p>

      {alreadySubscribed || status === "success" ? (
        <p style={{ fontSize: "0.75rem", color: "var(--text-3)", lineHeight: 1.65 }}>
          You&rsquo;re subscribed.
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

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            maxLength={254}
            disabled={status === "loading"}
            style={{
              display: "block",
              width: "100%",
              background: "none",
              border: "none",
              borderBottom: "1px solid var(--border)",
              outline: "none",
              padding: "0.2rem 0",
              fontSize: "0.8125rem",
              color: "var(--text-2)",
              marginBottom: "0.75rem",
              transition: "border-color 0.15s",
              boxSizing: "border-box",
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
              fontSize: "0.8125rem",
              color: status === "loading" ? "var(--text-4)" : "var(--text-1)",
              cursor: status === "loading" || !email ? "default" : "pointer",
              opacity: !email ? 0.4 : 1,
              transition: "color 0.15s, opacity 0.15s",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              textDecorationThickness: "1px",
              textDecorationColor: "var(--border)",
            }}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>

          {status === "error" && (
            <p
              style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--text-3)" }}
            >
              {errorMsg}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
