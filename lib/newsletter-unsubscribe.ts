const SITE_ORIGIN = "https://jeeveshkrishna.com";
const PRIVATE_HEADERS = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };

export function validUnsubscribeToken(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

function redirect(parameters: Record<string, string>) {
  const target = new URL("/unsubscribe", SITE_ORIGIN);
  target.search = new URLSearchParams(parameters).toString();
  return new Response(null, {
    status: 303,
    headers: { ...PRIVATE_HEADERS, Location: target.href },
  });
}

function reply(error: string, status: number) {
  return Response.json({ error }, { status, headers: PRIVATE_HEADERS });
}

async function boundedForm(req: Request): Promise<FormData | null> {
  const contentType = req.headers.get("content-type") ?? "";
  const mediaType = contentType.split(";")[0].trim().toLowerCase();
  if (!["application/x-www-form-urlencoded", "multipart/form-data"].includes(mediaType))
    return null;
  const length = req.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > 8192)) return null;
  if (!req.body) return null;
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        void reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return await new Response(bytes, { headers: { "Content-Type": contentType } }).formData();
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

export function unsubscribeHandlers({
  isAllowedOrigin,
  deleteToken,
}: {
  isAllowedOrigin: (request: Request) => boolean;
  deleteToken: (token: string) => Promise<boolean>;
}) {
  return {
    GET(req: Request) {
      const token = new URL(req.url).searchParams.get("token");
      // Link scanners and browser prefetches must never change subscription state.
      return validUnsubscribeToken(token) ? redirect({ token }) : redirect({ status: "invalid" });
    },
    async POST(req: Request) {
      if (!isAllowedOrigin(req)) return reply("Origin not allowed.", 403);
      const form = await boundedForm(req);
      if (!form) return reply("Invalid unsubscribe request.", 400);
      const oneClick = form.get("List-Unsubscribe") === "One-Click";
      const token = oneClick ? new URL(req.url).searchParams.get("token") : form.get("token");
      if (
        !validUnsubscribeToken(token) ||
        (!oneClick && form.get("confirm") !== "unsubscribe") ||
        form.getAll("List-Unsubscribe").length > 1 ||
        form.getAll("token").length > 1
      )
        return reply("Invalid unsubscribe request.", 400);

      try {
        const removed = await deleteToken(token);
        // RFC 8058 requires a direct response for mail-provider POSTs, never a redirect.
        if (oneClick) return Response.json({ ok: true }, { headers: PRIVATE_HEADERS });
        return redirect({ status: removed ? "success" : "not-found" });
      } catch {
        // Tokens, subscriber details, and provider errors must not enter logs or redirects.
        if (oneClick) return reply("Unsubscribe service unavailable.", 503);
        return redirect({ status: "error" });
      }
    },
  };
}
