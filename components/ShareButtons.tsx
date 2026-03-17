"use client";

import { useState } from "react";
import { Link2, Check, Share2, Rss } from "lucide-react";
import { siteConfig } from "@/lib/data";

interface Props {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);
  const [canShare] = useState(() => typeof navigator !== "undefined" && !!navigator.share);
  const url = `${siteConfig.siteUrl}/blog/${slug}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  }

  async function handleShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // user cancelled
    }
  }

  return (
    <div
      style={{
        marginTop: "3rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={handleCopy}
        className="share-btn"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: "0.8125rem",
          color: "var(--text-4)",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          transition: "color 0.15s",
        }}
      >
        {copied ? <Check size={14} strokeWidth={1.5} /> : <Link2 size={14} strokeWidth={1.5} />}
        {copied ? "Copied" : "Copy link"}
      </button>

      {canShare && (
        <button
          onClick={handleShare}
          className="share-btn"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontSize: "0.8125rem",
            color: "var(--text-4)",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            transition: "color 0.15s",
          }}
        >
          <Share2 size={14} strokeWidth={1.5} />
          Share
        </button>
      )}

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
        Subscribe
      </a>
    </div>
  );
}
