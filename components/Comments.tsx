"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: number;
  name: string;
  content: string;
  is_owner: boolean;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [showAdminField, setShowAdminField] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/comments/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(() => {});
  }, [slug]);

  async function handleDelete(id: number) {
    if (!adminKey) return;
    setDeleting(id);
    const res = await fetch(`/api/comments/${slug}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminKey }),
    });
    setDeleting(null);
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    } else {
      const data = await res.json();
      setError(data.error || "Failed to delete.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/comments/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, content, adminKey: adminKey || undefined, hp: honeypot }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      return;
    }

    const newComment = await res.json();
    setComments((prev) => [...prev, newComment]);
    setName("");
    setContent("");
    setAdminKey("");
    setShowAdminField(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  const inputStyle: React.CSSProperties = {
    padding: "0.625rem 0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "5px",
    background: "var(--bg)",
    color: "var(--text-1)",
    fontSize: "0.9375rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "var(--font-inter)",
  };

  return (
    <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
      <h2
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--text-2)",
          marginBottom: "1.5rem",
          letterSpacing: "-0.01em",
        }}
      >
        Comments
        {comments.length > 0 && (
          <span style={{ fontWeight: 400, color: "var(--text-4)", marginLeft: "0.375rem" }}>
            ({comments.length})
          </span>
        )}
      </h2>

      {comments.length > 0 && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}
        >
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                padding: "0.875rem 1rem",
                border: "1px solid var(--border)",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-2)" }}>
                  {c.name}
                </span>
                {c.is_owner && (
                  <span
                    style={{
                      fontSize: "0.625rem",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-4)",
                      border: "1px solid var(--border)",
                      borderRadius: "3px",
                      padding: "0.1rem 0.35rem",
                    }}
                  >
                    author
                  </span>
                )}
                <span style={{ fontSize: "0.8125rem", color: "var(--text-4)", marginLeft: "auto" }}>
                  {formatDate(c.created_at)}
                </span>
                {showAdminField && adminKey && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={deleting === c.id}
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-4)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      marginLeft: "0.5rem",
                    }}
                  >
                    {deleting === c.id ? "..." : "Remove"}
                  </button>
                )}
              </div>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--text-2)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        {/* Honeypot: invisible to humans, bots fill it in and get silently dropped server-side */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          style={inputStyle}
        />
        <textarea
          placeholder="Leave a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          maxLength={2000}
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        {showAdminField && (
          <input
            type="password"
            placeholder="Admin key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={inputStyle}
          />
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setShowAdminField((v) => !v)}
            style={{
              fontSize: "0.75rem",
              color: "var(--text-4)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {showAdminField ? "Cancel" : "Reply as author"}
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "0.5rem 1.25rem",
              background: "var(--text-1)",
              color: "var(--bg)",
              border: "none",
              borderRadius: "5px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
        {error && (
          <p style={{ fontSize: "0.875rem", color: "var(--text-3)", margin: 0 }}>{error}</p>
        )}
        {success && (
          <p style={{ fontSize: "0.875rem", color: "var(--text-3)", margin: 0 }}>Comment posted.</p>
        )}
      </form>
    </div>
  );
}
