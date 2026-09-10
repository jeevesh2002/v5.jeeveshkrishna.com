import assert from "node:assert/strict";
import test from "node:test";
import { secretsMatch, validSlug, isAllowedOrigin, readJsonBody } from "../lib/api-security.ts";
import { sanitizeCommentHtml } from "../lib/comment-html.ts";

function request(body, headers = {}) {
  return new Request("https://jeeveshkrishna.com/api/comments/hello-world/", {
    method: "POST",
    body,
    headers: { "content-type": "application/json", ...headers },
  });
}

test("secret comparison fails closed for malformed, missing, oversized, and incorrect values", () => {
  for (const value of [undefined, null, {}, [], 1, true, "", "wrong", "x".repeat(4097)]) {
    assert.equal(secretsMatch(value, "test-secret"), false);
  }
  assert.equal(secretsMatch("test-secret", undefined), false);
  assert.equal(secretsMatch("test-secret", "test-secret"), true);
  assert.equal(secretsMatch("tést-secret", "tést-secret"), true);
});

test("origin validation rejects substring tricks, null, foreign ports, and cross-site requests", () => {
  for (const origin of [
    "https://jeeveshkrishna.com.attacker.example",
    "https://attacker.example/jeeveshkrishna.com",
    "null",
    "http://jeeveshkrishna.com",
    "https://jeeveshkrishna.com:444",
  ]) {
    assert.equal(isAllowedOrigin(request("{}", { origin })), false, origin);
  }
  assert.equal(isAllowedOrigin(request("{}", { origin: "https://jeeveshkrishna.com" })), true);
  assert.equal(isAllowedOrigin(request("{}", { "sec-fetch-site": "cross-site" })), false);
  assert.equal(isAllowedOrigin(request("{}")), true);
});

test("JSON parser enforces media type, shape, UTF8 and actual streamed size", async () => {
  assert.equal((await readJsonBody(request("{}", { "content-type": "text/plain" }))).status, 415);
  for (const value of ["null", "[]", "3", '"text"', "{"]) {
    assert.equal((await readJsonBody(request(value))).status, 400);
  }
  assert.deepEqual(await readJsonBody(request('{"name":"Reader"}')), {
    ok: true,
    body: { name: "Reader" },
  });
  assert.equal((await readJsonBody(request("{}", { "content-length": "99999" }))).status, 413);
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"name":"'));
      controller.enqueue(new TextEncoder().encode("x".repeat(17_000)));
      controller.close();
    },
  });
  const streamed = new Request("https://jeeveshkrishna.com", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: stream,
    duplex: "half",
  });
  assert.equal((await readJsonBody(streamed)).status, 413);
  assert.equal((await readJsonBody(request(new Uint8Array([0xff])))).status, 400);
});

test("post slugs reject traversal, separators and overlong values", () => {
  for (const value of [
    null,
    {},
    "../README",
    "a/b",
    "a\\b",
    "%2e%2e",
    ".hidden",
    "a".repeat(256),
  ]) {
    assert.equal(validSlug(value), false);
  }
  assert.equal(validSlug("hello-world"), true);
});

test("comment preview and storage remove active HTML and dangerous URL schemes", () => {
  const clean = sanitizeCommentHtml(
    '<p onclick="alert(1)">hello</p><img src=x onerror="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">click</a><a href="//evil.example">external</a>'
  );
  assert.doesNotMatch(clean, /onclick|onerror|<script|<img|javascript:|\/\/evil/);
  const safe = sanitizeCommentHtml(
    '<p><strong>Bold</strong> <a href="https://example.com">link</a></p>'
  );
  assert.match(safe, /<strong>Bold<\/strong>/);
  assert.match(safe, /href="https:\/\/example.com"/);
  assert.match(safe, /rel="nofollow noopener noreferrer"/);
});
