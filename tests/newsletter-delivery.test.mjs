import assert from "node:assert/strict";
import test from "node:test";
import { deliverNewsletterOnce } from "../lib/newsletter.ts";

const post = { slug: "test-post", title: "Test", excerpt: "", readingTime: 1, date: "2026-09-10" };
const subscribers = Array.from({ length: 101 }, (_, index) => ({
  email: `reader${index}@example.test`,
  unsubscribe_token: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
}));

function fakeDatabase({ failRead = false, failUpdate = false } = {}) {
  const records = new Map();
  const events = [];
  async function sql(strings, ...values) {
    const query = strings.join("?").replace(/\s+/g, " ").trim();
    if (query.startsWith("INSERT INTO newsletter_sent")) {
      assert.match(query, /ON CONFLICT \(slug\) DO NOTHING RETURNING slug/);
      const slug = values[0];
      if (records.has(slug)) return [];
      records.set(slug, { status: "sending", sent: 0, failed: 0 });
      events.push("claim");
      return [{ slug }];
    }
    if (query.startsWith("SELECT email")) {
      events.push("read-subscribers");
      if (failRead) throw new Error("Database unavailable");
      return subscribers;
    }
    if (query.startsWith("UPDATE newsletter_sent")) {
      if (failUpdate) throw new Error("Database unavailable");
      const [sent, failed, status, slug] = values;
      records.set(slug, { sent, failed, status });
      events.push("record-outcome");
      return [];
    }
    throw new Error(`Unexpected SQL operation: ${query}`);
  }
  return { sql, records, events };
}

test("concurrent manual and cron attempts elect one sender before loading recipients", async () => {
  const db = fakeDatabase();
  const batches = [];
  const sendBatch = async (batch, idempotencyKey) => {
    assert.ok(db.records.has(post.slug));
    db.events.push("send");
    batches.push({ batch, idempotencyKey });
    await new Promise((resolve) => setImmediate(resolve));
    return batch.length;
  };
  const results = await Promise.all(
    Array.from({ length: 8 }, () => deliverNewsletterOnce({ sql: db.sql, post, sendBatch }))
  );
  assert.equal(results.filter((result) => result.status === "sent").length, 1);
  assert.equal(results.filter((result) => result.status === "already_claimed").length, 7);
  assert.deepEqual(
    batches.map(({ batch }) => batch.length),
    [100, 1]
  );
  assert.equal(db.events[0], "claim");
  assert.equal(new Set(batches.map(({ idempotencyKey }) => idempotencyKey)).size, 2);
  assert.ok(
    batches.every(({ idempotencyKey }) => /^newsletter\/[a-f0-9]{64}$/.test(idempotencyKey))
  );
  assert.deepEqual(db.records.get(post.slug), { status: "sent", sent: 101, failed: 0 });
});

test("provider timeout keeps the claim and prevents automatic duplicate emails", async () => {
  const db = fakeDatabase();
  let attempts = 0;
  const sendBatch = async () => {
    attempts += 1;
    throw new Error("Timed out after provider may have accepted mail");
  };
  const first = await deliverNewsletterOnce({ sql: db.sql, post, sendBatch });
  const retry = await deliverNewsletterOnce({ sql: db.sql, post, sendBatch });
  assert.deepEqual(first, { status: "needs_review", sent: 0, failed: 101 });
  assert.equal(retry.status, "already_claimed");
  assert.equal(attempts, 2);
});

test("partial acknowledgement records a reviewable result and never replays recipients", async () => {
  const db = fakeDatabase();
  const result = await deliverNewsletterOnce({
    sql: db.sql,
    post,
    sendBatch: async (batch) => batch.length - 1,
  });
  assert.deepEqual(result, { status: "needs_review", sent: 99, failed: 2 });
  assert.deepEqual(db.records.get(post.slug), result);
});

test("database failure after the claim cannot release an uncertain send", async () => {
  for (const options of [{ failRead: true }, { failUpdate: true }]) {
    const db = fakeDatabase(options);
    let attempts = 0;
    const sendBatch = async (batch) => {
      attempts += 1;
      return batch.length;
    };
    if (options.failUpdate) {
      await assert.rejects(
        deliverNewsletterOnce({ sql: db.sql, post, sendBatch }),
        /Database unavailable/
      );
    } else {
      assert.equal(
        (await deliverNewsletterOnce({ sql: db.sql, post, sendBatch })).status,
        "needs_review"
      );
      assert.equal(attempts, 0);
    }
    assert.equal(
      (await deliverNewsletterOnce({ sql: db.sql, post, sendBatch })).status,
      "already_claimed"
    );
    assert.ok(db.records.has(post.slug));
  }
});
