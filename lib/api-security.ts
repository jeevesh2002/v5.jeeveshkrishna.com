import { createHash, timingSafeEqual } from "node:crypto";

export function secretsMatch(provided: unknown, expected: string | undefined): boolean {
  if (typeof provided !== "string" || !provided || provided.length > 4096 || !expected) {
    return false;
  }
  return timingSafeEqual(
    createHash("sha256").update(provided).digest(),
    createHash("sha256").update(expected).digest()
  );
}

export function validSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= 255 && /^[a-z0-9][a-z0-9-]*$/.test(value);
}

export function isAllowedOrigin(req: Request): boolean {
  if (req.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = req.headers.get("origin");
  // Non-browser clients still require JSON and authentication on admin routes.
  if (!origin) return true;
  const allowed = new Set(["https://jeeveshkrishna.com", "https://www.jeeveshkrishna.com"]);
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
    if (host) allowed.add(`https://${host}`);
  }
  if (process.env.NODE_ENV !== "production") {
    const current = new URL(req.url);
    if (["localhost", "127.0.0.1", "[::1]"].includes(current.hostname)) {
      allowed.add(current.origin);
    }
  }
  try {
    const parsed = new URL(origin);
    return parsed.origin === origin && allowed.has(parsed.origin);
  } catch {
    return false;
  }
}

type JsonBody =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: number; error: string };

// Bound the actual byte stream, including requests without Content-Length.
export async function readJsonBody(req: Request, maxBytes = 16_384): Promise<JsonBody> {
  if (req.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() !== "application/json") {
    return { ok: false, status: 415, error: "Content-Type must be application/json." };
  }
  const length = req.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes)) {
    return { ok: false, status: 413, error: "Request too large." };
  }
  if (!req.body) return { ok: false, status: 400, error: "Invalid request." };
  const reader = req.body.getReader();
  try {
    let size = 0;
    let text = "";
    const decoder = new TextDecoder("utf-8", { fatal: true });
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        void reader.cancel().catch(() => {});
        return { ok: false, status: 413, error: "Request too large." };
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    const body: unknown = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { ok: false, status: 400, error: "Invalid request." };
    }
    return { ok: true, body: body as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400, error: "Invalid request." };
  } finally {
    reader.releaseLock();
  }
}
