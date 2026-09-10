import sanitizeHtml from "sanitize-html";

// One allowlist for stored comments and the local Markdown preview.
export function sanitizeCommentHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "s",
      "code",
      "pre",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
    ],
    allowedAttributes: { a: ["href", "rel", "target"] },
    allowedSchemes: ["https", "http", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tag, attrs) => ({
        tagName: "a",
        attribs: { href: attrs.href ?? "", rel: "nofollow noopener noreferrer", target: "_blank" },
      }),
    },
  });
}
