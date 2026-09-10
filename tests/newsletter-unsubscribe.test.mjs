import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { unsubscribeHandlers } from "../lib/newsletter-unsubscribe.ts";
import { isAllowedOrigin } from "../lib/api-security.ts";

const token = randomUUID();
const url = `https://jeeveshkrishna.com/api/unsubscribe?token=${token}`;
function fixture() {
  const deleted = [];
  const handlers = unsubscribeHandlers({
    isAllowedOrigin,
    async deleteToken(value) {
      deleted.push(value);
      return true;
    },
  });
  return { ...handlers, deleted };
}
const formRequest = (body, endpoint = url, headers = {}) =>
  new Request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", ...headers },
    body,
  });

test("GET link scanning only opens a fixed-origin confirmation without deleting", () => {
  const handler = fixture();
  const response = handler.GET(new Request(`https://attacker.test/api/unsubscribe?token=${token}`));
  assert.deepEqual(handler.deleted, []);
  assert.equal(response.status, 303);
  assert.equal(
    response.headers.get("location"),
    `https://jeeveshkrishna.com/unsubscribe?token=${token}`
  );
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
});

test("manual unsubscribe needs an explicit POST confirmation and removes token from redirect", async () => {
  const handler = fixture();
  assert.equal((await handler.POST(formRequest(`token=${token}`))).status, 400);
  assert.deepEqual(handler.deleted, []);
  const response = await handler.POST(formRequest(`token=${token}&confirm=unsubscribe`));
  assert.deepEqual(handler.deleted, [token]);
  assert.equal(response.status, 303);
  assert.equal(
    response.headers.get("location"),
    "https://jeeveshkrishna.com/unsubscribe?status=success"
  );
});

test("RFC8058 accepts form-urlencoded and multipart one-click POST without redirects", async () => {
  for (const multipart of [false, true]) {
    const handler = fixture();
    const form = new FormData();
    form.set("List-Unsubscribe", "One-Click");
    const request = multipart
      ? new Request(url, { method: "POST", body: form })
      : formRequest("List-Unsubscribe=One-Click");
    const response = await handler.POST(request);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    assert.deepEqual(handler.deleted, [token]);
  }
});

test("cross-site, malformed, duplicate-token, and oversized bodies never delete", async () => {
  const handler = fixture();
  const requests = [
    formRequest("List-Unsubscribe=One-Click", url, { Origin: "https://attacker.test" }),
    formRequest(
      "List-Unsubscribe=One-Click",
      "https://jeeveshkrishna.com/api/unsubscribe?token=bad"
    ),
    formRequest(`token=${token}&token=${token}&confirm=unsubscribe`),
    formRequest(`token=${token}&confirm=unsubscribe&extra=${"x".repeat(9000)}`),
    new Request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    }),
  ];
  for (const request of requests) assert.ok((await handler.POST(request)).status >= 400);
  assert.deepEqual(handler.deleted, []);
});

test("provider/database failures have no token-bearing error redirect or automatic replay", async () => {
  const handler = unsubscribeHandlers({
    isAllowedOrigin,
    deleteToken: async () => {
      throw new Error("private");
    },
  });
  const machine = await handler.POST(formRequest("List-Unsubscribe=One-Click"));
  assert.equal(machine.status, 503);
  assert.equal(machine.headers.get("location"), null);
  assert.doesNotMatch(await machine.text(), /private/);
  const human = await handler.POST(formRequest(`token=${token}&confirm=unsubscribe`));
  assert.equal(
    human.headers.get("location"),
    "https://jeeveshkrishna.com/unsubscribe?status=error"
  );
});
