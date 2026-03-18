"use client";

import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import {
  Bold,
  Code,
  Code2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";

// Single newlines become <br> tags, matching GitHub comment behavior
marked.use({ breaks: true });

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

// ── Markdown editor ───────────────────────────────────────────────────────────

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
}

function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");

  const previewHtml =
    tab === "preview" ? (marked.parse(value || "_Nothing to preview._") as string) : "";

  // Insert inline syntax wrapping the current selection (or a placeholder)
  function wrap(before: string, after: string = before, placeholder = "text") {
    const el = taRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = value.slice(s, e);
    const ins = sel ? `${before}${sel}${after}` : `${before}${placeholder}${after}`;
    onChange(value.slice(0, s) + ins + value.slice(e));
    const ns = s + before.length;
    const ne = ns + (sel ? sel.length : placeholder.length);
    raf(() => {
      el.focus();
      el.setSelectionRange(ns, ne);
    });
  }

  // Prefix each selected line (or insert a sample line at cursor)
  function linePrefix(prefix: string, placeholder = "") {
    const el = taRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = value.slice(s, e);
    let ins: string, ns: number, ne: number;
    if (sel) {
      ins = sel
        .split("\n")
        .map((l) => `${prefix}${l}`)
        .join("\n");
      ns = s;
      ne = s + ins.length;
    } else {
      ins = `${prefix}${placeholder}`;
      ns = s + prefix.length;
      ne = ns + placeholder.length;
    }
    onChange(value.slice(0, s) + ins + value.slice(e));
    raf(() => {
      el.focus();
      el.setSelectionRange(ns, ne);
    });
  }

  function insertCodeBlock() {
    const el = taRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = value.slice(s, e);
    const inner = sel || "code here";
    const ins = `\`\`\`\n${inner}\n\`\`\``;
    onChange(value.slice(0, s) + ins + value.slice(e));
    raf(() => {
      el.focus();
      el.setSelectionRange(s + 4, s + 4 + inner.length);
    });
  }

  function insertLink() {
    const el = taRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = value.slice(s, e);
    const url = window.prompt("Enter URL:");
    if (!url) return;
    const txt = sel || "link text";
    onChange(value.slice(0, s) + `[${txt}](${url})` + value.slice(e));
    raf(() => {
      el.focus();
      el.setSelectionRange(s + 1, s + 1 + txt.length);
    });
  }

  function raf(fn: () => void) {
    requestAnimationFrame(fn);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key === "b") {
      e.preventDefault();
      wrap("**", "**", "bold text");
    } else if (mod && e.key === "i") {
      e.preventDefault();
      wrap("_", "_", "italic text");
    } else if (mod && e.key === "e") {
      e.preventDefault();
      wrap("`", "`", "code");
    } else if (mod && e.key === "k") {
      e.preventDefault();
      insertLink();
    }
  }

  // onMouseDown + preventDefault keeps focus in the textarea when toolbar is clicked
  const btn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    border: "none",
    borderRadius: 3,
    background: "none",
    color: "var(--text-3)",
    cursor: "pointer",
    padding: 0,
    flexShrink: 0,
    transition: "color 0.1s",
  };

  const sep: React.CSSProperties = {
    width: 1,
    height: 16,
    background: "var(--border)",
    margin: "0 2px",
    flexShrink: 0,
  };

  // Prevents the textarea from losing focus when toolbar buttons are clicked
  function noFocusLoss(e: React.MouseEvent) {
    e.preventDefault();
  }

  return (
    <div>
      {/* Write / Preview tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "0.375rem 0.875rem",
              fontSize: "0.8125rem",
              fontWeight: tab === t ? 500 : 400,
              color: tab === t ? "var(--text-1)" : "var(--text-4)",
              background: tab === t ? "var(--bg)" : "transparent",
              border: "1px solid transparent",
              borderColor:
                tab === t ? "var(--border) var(--border) var(--bg) var(--border)" : "transparent",
              borderRadius: "5px 5px 0 0",
              marginBottom: tab === t ? "-1px" : 0,
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
              transition: "color 0.1s",
              position: "relative",
              zIndex: tab === t ? 1 : 0,
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Editor box */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "0 5px 5px 5px",
          background: "var(--bg)",
          overflow: "hidden",
        }}
      >
        {/* Toolbar — only in write mode */}
        {tab === "write" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: "0.3rem 0.5rem",
              background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onMouseDown={noFocusLoss}
              onClick={() => wrap("**", "**", "bold text")}
              title="Bold (Ctrl+B)"
              aria-label="Bold"
              style={btn}
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onMouseDown={noFocusLoss}
              onClick={() => wrap("_", "_", "italic text")}
              title="Italic (Ctrl+I)"
              aria-label="Italic"
              style={btn}
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              onMouseDown={noFocusLoss}
              onClick={() => wrap("~~", "~~", "strikethrough")}
              title="Strikethrough"
              aria-label="Strikethrough"
              style={btn}
            >
              <Strikethrough size={14} />
            </button>
            <div style={sep} />
            <button
              type="button"
              onMouseDown={noFocusLoss}
              onClick={() => wrap("`", "`", "code")}
              title="Inline code (Ctrl+E)"
              aria-label="Inline code"
              style={btn}
            >
              <Code size={14} />
            </button>
            <button
              type="button"
              onMouseDown={noFocusLoss}
              onClick={insertCodeBlock}
              title="Code block"
              aria-label="Code block"
              style={btn}
            >
              <Code2 size={14} />
            </button>
            <div style={sep} />
            <button
              type="button"
              onMouseDown={noFocusLoss}
              onClick={() => linePrefix("> ", "quoted text")}
              title="Blockquote"
              aria-label="Blockquote"
              style={btn}
            >
              <Quote size={14} />
            </button>
            <button
              type="button"
              onMouseDown={noFocusLoss}
              onClick={() => linePrefix("- ", "list item")}
              title="Bullet list"
              aria-label="Bullet list"
              style={btn}
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onMouseDown={noFocusLoss}
              onClick={() => linePrefix("1. ", "list item")}
              title="Numbered list"
              aria-label="Numbered list"
              style={btn}
            >
              <ListOrdered size={14} />
            </button>
            <div style={sep} />
            <button
              type="button"
              onMouseDown={noFocusLoss}
              onClick={insertLink}
              title="Link (Ctrl+K)"
              aria-label="Add link"
              style={btn}
            >
              <Link2 size={14} />
            </button>
          </div>
        )}

        {/* Write textarea */}
        {tab === "write" ? (
          <textarea
            ref={taRef}
            placeholder="Leave a comment..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
            style={{
              display: "block",
              padding: "0.625rem 0.75rem",
              border: "none",
              background: "transparent",
              color: "var(--text-1)",
              fontSize: "0.9375rem",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
              fontFamily: "var(--font-inter)",
              resize: "vertical",
              lineHeight: 1.65,
            }}
          />
        ) : (
          /* Preview pane — same styles as rendered comments */
          <div
            className="comment-content"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
            style={{
              padding: "0.625rem 0.75rem",
              minHeight: 96,
              fontSize: "0.9375rem",
              color: "var(--text-2)",
              lineHeight: 1.65,
            }}
          />
        )}

        {/* Footer hint */}
        <div
          style={{
            padding: "0.3rem 0.75rem",
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            fontSize: "0.75rem",
            color: "var(--text-4)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          Markdown supported
        </div>
      </div>
    </div>
  );
}

// ── Comments section ──────────────────────────────────────────────────────────

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!content.trim()) {
      setError("Please write a comment.");
      return;
    }
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
              {/* content is markdown converted to HTML and sanitized on the server */}
              <div
                className="comment-content"
                dangerouslySetInnerHTML={{ __html: c.content }}
                style={{ fontSize: "0.9375rem", color: "var(--text-2)", lineHeight: 1.65 }}
              />
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
          maxLength={100}
          style={inputStyle}
        />
        <MarkdownEditor value={content} onChange={setContent} />
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
