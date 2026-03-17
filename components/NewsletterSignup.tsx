"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

  return (
    <div
      style={{
        marginTop: "4rem",
        paddingTop: "2.5rem",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}
      >
        <Mail size={15} strokeWidth={1.5} style={{ color: "var(--text-3)", flexShrink: 0 }} />
        <p
          style={{
            margin: 0,
            fontSize: "0.9375rem",
            fontWeight: 500,
            color: "var(--text-1)",
          }}
        >
          Get posts in your inbox
        </p>
      </div>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--text-3)",
          lineHeight: 1.7,
          marginBottom: "1.25rem",
          maxWidth: "480px",
        }}
      >
        These posts are original and take a while to get right - finding the right angle, doing the
        research, sitting with the idea long enough that it is worth writing down. I aim for at
        least one a month, but there is no fixed schedule. When something is ready, it goes out. You
        will not get anything else.
      </p>

      {status === "success" ? (
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-3)",
            lineHeight: 1.7,
          }}
        >
          You are subscribed. Look out for the next one.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot - hidden from real users, bots fill it in */}
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

          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              maxLength={254}
              disabled={status === "loading"}
              style={{
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--border)",
                outline: "none",
                padding: "0.25rem 0",
                fontSize: "0.875rem",
                color: "var(--text-2)",
                width: "220px",
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
              }}
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </div>

          {status === "error" && (
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.8125rem",
                color: "var(--text-3)",
              }}
            >
              {errorMsg}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
