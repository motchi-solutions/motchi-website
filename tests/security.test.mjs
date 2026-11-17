import assert from "node:assert/strict";
import test from "node:test";
import {
  claim,
  hit,
  memoryHit,
  release,
  resetMemoryLimits,
  settle,
} from "../src/lib/security/rate-limit.ts";
import { verifyTurnstile } from "../src/lib/security/turnstile.ts";
import { contactMessage, isReference } from "../src/lib/email/feedback.ts";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

test("memory limits allow up to the limit, then report the wait", () => {
  resetMemoryLimits();
  assert.deepEqual(memoryHit("k", 2, 1000, 0), {
    allowed: true,
    retryAfterMs: 0,
  });
  assert.equal(memoryHit("k", 2, 1000, 10).allowed, true);
  assert.deepEqual(memoryHit("k", 2, 1000, 400), {
    allowed: false,
    retryAfterMs: 600,
  });
  // The window resets once it expires.
  assert.equal(memoryHit("k", 2, 1000, 1001).allowed, true);
});

test("Upstash limits use one atomic transaction and read the remaining window", async () => {
  const calls = [];
  const fakeFetch = async (url, init) => {
    calls.push({
      url,
      body: JSON.parse(init.body),
      auth: init.headers.Authorization,
    });
    return json([{ result: 4 }, { result: 0 }, { result: 90_000 }]);
  };
  const redis = { url: "https://example.upstash.io", token: "t" };
  const result = await hit("contact:ip:abc", 3, 600_000, redis, fakeFetch);
  assert.deepEqual(result, { allowed: false, retryAfterMs: 90_000 });
  assert.equal(calls[0].url, "https://example.upstash.io/multi-exec");
  assert.equal(calls[0].auth, "Bearer t");
  assert.deepEqual(calls[0].body, [
    ["INCR", "contact:ip:abc"],
    ["PEXPIRE", "contact:ip:abc", 600_000, "NX"],
    ["PTTL", "contact:ip:abc"],
  ]);
});

test("an Upstash outage falls back to memory instead of blocking visitors", async () => {
  resetMemoryLimits();
  const original = console.error;
  console.error = () => {};
  try {
    const failing = async () => json({ error: "down" }, 500);
    const redis = { url: "https://example.upstash.io", token: "t" };
    const result = await hit("contact:fallback", 1, 1000, redis, failing);
    assert.equal(result.allowed, true);
    assert.equal(await claim("once", 1000, redis, failing), null);
    assert.equal(await claim("once", 1000, redis, failing), "pending");
  } finally {
    console.error = original;
  }
});

test("a claim remembers its outcome, and a released claim can be claimed again", async () => {
  resetMemoryLimits();
  assert.equal(await claim("send", 1000, null), null);
  assert.equal(await claim("send", 1000, null), "pending");
  await settle("send", "sent", 1000, null);
  assert.equal(await claim("send", 1000, null), "sent");
  await release("send", null);
  assert.equal(await claim("send", 1000, null), null);
});

test("Upstash claims set only if absent and return the earlier outcome", async () => {
  const sent = [];
  const redis = { url: "https://example.upstash.io", token: "t" };
  const reply = await claim(
    "contact:sent:x",
    5000,
    redis,
    async (url, init) => {
      sent.push({ url, body: JSON.parse(init.body) });
      return json({ result: "partial" });
    },
  );
  assert.equal(reply, "partial");
  assert.deepEqual(sent[0], {
    url: "https://example.upstash.io",
    body: ["SET", "contact:sent:x", "pending", "NX", "GET", "PX", 5000],
  });
});

test("Turnstile: success requires the expected action and hostname", async () => {
  const verify = (reply, options = {}) =>
    verifyTurnstile(
      {
        token: "token",
        secret: options.secret ?? "real-secret",
        ip: "203.0.113.5",
        hostname: "motchi.ca",
      },
      async (url, init) => {
        assert.equal(
          url,
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        );
        const sent = new URLSearchParams(init.body);
        assert.equal(sent.get("remoteip"), "203.0.113.5");
        assert.ok(sent.get("idempotency_key"));
        return typeof reply === "function" ? reply() : json(reply);
      },
    );
  assert.deepEqual(
    await verify({ success: true, action: "contact", hostname: "motchi.ca" }),
    { ok: true },
  );
  assert.deepEqual(
    await verify({ success: true, action: "login", hostname: "motchi.ca" }),
    { ok: false, reason: "failed" },
  );
  assert.deepEqual(
    await verify({ success: true, action: "contact", hostname: "evil.test" }),
    { ok: false, reason: "failed" },
  );
  assert.deepEqual(
    await verify({ success: false, "error-codes": ["timeout-or-duplicate"] }),
    { ok: false, reason: "failed" },
  );
  assert.deepEqual(
    await verify({ success: false, "error-codes": ["invalid-input-secret"] }),
    { ok: false, reason: "unavailable" },
  );
  assert.deepEqual(
    await verify(() => {
      throw new Error("network");
    }),
    { ok: false, reason: "unavailable" },
  );
  // Cloudflare's test secret reports a placeholder hostname and action.
  assert.deepEqual(
    await verify(
      { success: true, action: "", hostname: "example.com" },
      { secret: "1x0000000000000000000000000000000AA" },
    ),
    { ok: true },
  );
});

test("Turnstile retries an internal error once with the same idempotency key", async () => {
  const keys = [];
  let calls = 0;
  const result = await verifyTurnstile(
    { token: "t", secret: "s", hostname: "motchi.ca" },
    async (_url, init) => {
      keys.push(new URLSearchParams(init.body).get("idempotency_key"));
      calls++;
      return calls === 1
        ? json({ success: false, "error-codes": ["internal-error"] })
        : json({ success: true, action: "contact", hostname: "motchi.ca" });
    },
  );
  assert.deepEqual(result, { ok: true });
  assert.equal(keys[0], keys[1]);
});

test("Turnstile rejects missing and oversized tokens without a network call", async () => {
  const never = async () => assert.fail("no request expected");
  for (const token of ["", "x".repeat(2049)])
    assert.deepEqual(
      await verifyTurnstile(
        { token, secret: "s", hostname: "motchi.ca" },
        never,
      ),
      { ok: false, reason: "failed" },
    );
});

test("contact messages explain the wait and accept only safe references", () => {
  assert.match(
    contactMessage("limited", { retryMinutes: 7 }),
    /about 7 minutes/,
  );
  assert.match(
    contactMessage("limited", { retryMinutes: 1 }),
    /about a minute/,
  );
  assert.match(
    contactMessage("limited", { retryMinutes: 600 }),
    /about 10 hours/,
  );
  assert.match(contactMessage("limited"), /try again later/);
  assert.match(contactMessage("unavailable"), /instead of trying again/);
  assert.match(contactMessage("failed"), /try again in a few minutes/);
  assert.equal(isReference("AB12CD34"), true);
  for (const value of ["ab12cd34", "AB12", "<script>", 12345678])
    assert.equal(isReference(value), false);
});
