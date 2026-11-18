import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { signToken } from "../src/lib/email/abuse.ts";
import { handleContact, prepareContactForm } from "../src/lib/email/index.ts";
import { getRedisSettings } from "../src/lib/config/env.ts";
import { resetMemoryLimits } from "../src/lib/security/rate-limit.ts";

// Each request comes from a different visitor unless a test says otherwise.
const randomIp = () => `203.0.113.${Math.floor(Math.random() * 250) + 1}`;

function makeRequest(overrides = {}, headers = {}) {
  const token = signToken(
    process.env.CONTACT_FORM_SECRET,
    Date.now() - 3000,
    randomBytes(16).toString("hex"),
  );
  const params = new URLSearchParams({
    token,
    name: "Alex",
    email: `${randomBytes(4).toString("hex")}@example.com`,
    company: "Example",
    interest: "Websites",
    message: "We would like to discuss a website.",
    // Cloudflare's published dummy token, accepted by its test secret.
    "cf-turnstile-response": "XXXX.DUMMY.TOKEN.XXXX",
    ...overrides,
  });
  return new Request("https://www.motchi.ca/api/contact", {
    method: "POST",
    headers: {
      origin: "https://www.motchi.ca",
      "content-type": "application/x-www-form-urlencoded",
      "x-real-ip": randomIp(),
      ...headers,
    },
    body: params.toString(),
  });
}
// Rejected origins redirect relatively; accepted ones use the site origin.
function result(response) {
  return new URL(response.headers.get("location"), "https://relative.invalid")
    .searchParams;
}
function status(response) {
  return result(response).get("status");
}
const siteverify = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
// Answers Turnstile checks and records Brevo sends.
function fakeServices(
  calls,
  brevo = () => new Response("{}", { status: 201 }),
) {
  return async (url, options) => {
    if (url === siteverify)
      return Response.json({ success: true, hostname: "example.com" });
    calls.push(JSON.parse(options.body));
    return brevo(calls.length);
  };
}

test("native contact submission handles validation, delivery, partial failure, and replay", async (t) => {
  const saved = { ...process.env };
  const originalFetch = globalThis.fetch;
  process.env.NODE_ENV = "production";
  process.env.CONTACT_FORM_SECRET = "a".repeat(64);
  process.env.BREVO_API_KEY = "test-key";
  process.env.CONTACT_FROM_EMAIL = "sender@example.com";
  process.env.CONTACT_TO_EMAIL = "inbox@example.com";
  process.env.TURNSTILE_SITE_KEY = "1x00000000000000000000BB";
  process.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";
  for (const variable of [
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "KV_REST_API_URL",
    "KV_REST_API_TOKEN",
  ])
    delete process.env[variable];
  resetMemoryLimits();
  const quiet = console.error;
  console.error = () => {};
  try {
    let calls = [];
    globalThis.fetch = fakeServices(calls);
    await t.test(
      "cross-origin and invalid fields never send mail",
      async () => {
        const rejected = await handleContact(
          makeRequest({}, { origin: "https://other.example" }),
          "solutions",
        );
        assert.equal(status(rejected), "invalid");
        // Never send the browser to another origin, which connect-src blocks.
        assert.match(rejected.headers.get("location"), /^\/contact\?/);
        const response = await handleContact(
          makeRequest({ email: "invalid" }),
          "solutions",
        );
        assert.equal(status(response), "invalid");
        assert.equal(calls.length, 0);
        assert.equal(
          new URL(response.headers.get("location")).searchParams.get("fields"),
          "email",
        );
      },
    );
    await t.test(
      "honeypot, tampered tokens, and oversized bodies never send mail",
      async () => {
        assert.equal(
          status(
            await handleContact(makeRequest({ fax: "spam" }), "solutions"),
          ),
          "sent",
        );
        assert.equal(
          status(
            await handleContact(makeRequest({ token: "bad" }), "solutions"),
          ),
          "expired",
        );
        assert.equal(
          status(
            await handleContact(
              makeRequest({ message: "x".repeat(25000) }),
              "solutions",
            ),
          ),
          "invalid",
        );
        assert.equal(calls.length, 0);
      },
    );
    await t.test(
      "notification and acknowledgement use the correct recipients and reply-to",
      async () => {
        const request = makeRequest();
        const duplicate = request.clone();
        const response = await handleContact(request, "solutions");
        assert.equal(response.status, 303);
        assert.equal(status(response), "sent");
        assert.equal(calls.length, 2);
        assert.equal(calls[0].to[0].email, "inbox@example.com");
        assert.equal(calls[1].to[0].email, calls[0].replyTo.email);
        assert.equal(calls[1].replyTo.email, "inbox@example.com");
        assert.ok(calls.every((mail) => mail.textContent && mail.htmlContent));
        assert.equal(
          status(await handleContact(duplicate, "solutions")),
          "sent",
        );
        assert.equal(calls.length, 2);
      },
    );
    await t.test(
      "staging overrides govern accepted origins and email links together",
      async () => {
        calls = [];
        globalThis.fetch = fakeServices(calls);
        process.env.SOLUTIONS_URL = "https://motchi.staging.example";
        try {
          assert.equal(
            status(await handleContact(makeRequest(), "solutions")),
            "invalid",
          );
          assert.equal(calls.length, 0);
          const original = makeRequest();
          const response = await handleContact(
            new Request("https://motchi.staging.example/api/contact", {
              method: "POST",
              headers: {
                origin: "https://motchi.staging.example",
                "content-type": "application/x-www-form-urlencoded",
              },
              body: await original.text(),
            }),
            "solutions",
          );
          assert.equal(status(response), "sent");
          assert.equal(
            new URL(response.headers.get("location")).origin,
            "https://motchi.staging.example",
          );
          assert.equal(calls.length, 2);
          assert.ok(
            calls.every((mail) =>
              mail.htmlContent.includes(
                'href="https://motchi.staging.example"',
              ),
            ),
          );
          assert.ok(
            calls[1].textContent.includes("https://motchi.staging.example"),
          );
        } finally {
          delete process.env.SOLUTIONS_URL;
        }
      },
    );
    await t.test(
      "acknowledgement failure reports that enquiry was sent and avoids a resend",
      async () => {
        calls = [];
        globalThis.fetch = fakeServices(
          calls,
          (count) => new Response("", { status: count === 1 ? 201 : 503 }),
        );
        const request = makeRequest();
        const duplicate = request.clone();
        assert.equal(
          status(await handleContact(request, "solutions")),
          "partial",
        );
        assert.equal(
          status(await handleContact(duplicate, "solutions")),
          "partial",
        );
        assert.equal(calls.length, 2);
      },
    );
    await t.test(
      "a rejected send can be retried; an unconfirmed one cannot, and both give a reference",
      async () => {
        calls = [];
        globalThis.fetch = fakeServices(
          calls,
          () => new Response("", { status: 503 }),
        );
        const request = makeRequest();
        const retry = request.clone();
        const rejected = await handleContact(request, "solutions");
        assert.equal(status(rejected), "failed");
        assert.match(result(rejected).get("ref"), /^[A-Z0-9]{8}$/);
        // Definitely not sent, so the same form may try again.
        assert.equal(status(await handleContact(retry, "solutions")), "failed");
        assert.equal(calls.length, 2);

        calls = [];
        globalThis.fetch = async (url) => {
          if (url === siteverify)
            return Response.json({ success: true, hostname: "example.com" });
          calls.push({});
          throw new DOMException("The operation timed out.", "TimeoutError");
        };
        const timedOut = makeRequest();
        const again = timedOut.clone();
        const unconfirmed = await handleContact(timedOut, "solutions");
        assert.equal(status(unconfirmed), "unavailable");
        assert.match(result(unconfirmed).get("ref"), /^[A-Z0-9]{8}$/);
        // Delivery is unknown, so a retry must not send a second copy.
        assert.equal(status(await handleContact(again, "solutions")), "busy");
        assert.equal(calls.length, 1);
      },
    );
    await t.test(
      "a failed bot check sends nothing and asks the visitor to try again",
      async () => {
        calls = [];
        globalThis.fetch = async (url) => {
          if (url === siteverify)
            return Response.json({
              success: false,
              "error-codes": ["invalid-input-response"],
            });
          calls.push({});
          return new Response("{}", { status: 201 });
        };
        const response = await handleContact(makeRequest(), "solutions");
        assert.equal(status(response), "verification");
        assert.equal(result(response).get("ref"), null);
        assert.equal(calls.length, 0);
      },
    );
    await t.test(
      "failed bot checks do not use up an email address's or the site's limit",
      async () => {
        calls = [];
        const email = { email: "shared@example.com" };
        globalThis.fetch = async (url) => {
          if (url === siteverify)
            return Response.json({
              success: false,
              "error-codes": ["invalid-input-response"],
            });
          calls.push({});
          return new Response("{}", { status: 201 });
        };
        for (let attempt = 0; attempt < 6; attempt++)
          assert.equal(
            status(await handleContact(makeRequest(email), "solutions")),
            "verification",
          );
        globalThis.fetch = fakeServices(calls);
        for (let attempt = 0; attempt < 3; attempt++)
          assert.equal(
            status(await handleContact(makeRequest(email), "solutions")),
            "sent",
          );
        // The fourth verified enquiry for one mailbox within the hour waits,
        // including a plus-tag variant of the same address.
        const limited = await handleContact(
          makeRequest({ email: "Shared+again@example.com" }),
          "solutions",
        );
        assert.equal(status(limited), "limited");
        assert.equal(calls.length, 6);
      },
    );
    await t.test(
      "too many attempts from one address are limited with a wait time",
      async () => {
        calls = [];
        globalThis.fetch = fakeServices(calls);
        const ip = { "x-real-ip": "198.51.100.7" };
        for (let attempt = 0; attempt < 5; attempt++)
          assert.equal(
            status(await handleContact(makeRequest({}, ip), "solutions")),
            "sent",
          );
        const limited = await handleContact(makeRequest({}, ip), "solutions");
        assert.equal(status(limited), "limited");
        assert.equal(result(limited).get("retry"), "10");
        assert.equal(calls.length, 10);
        // Another visitor is unaffected.
        assert.equal(
          status(await handleContact(makeRequest(), "solutions")),
          "sent",
        );
      },
    );
    await t.test(
      "the form is offered only when every sending setting is usable",
      async () => {
        const ready = prepareContactForm("solutions");
        assert.ok(ready?.token);
        assert.equal(ready?.siteKey, "1x00000000000000000000BB");
        for (const variable of [
          "BREVO_API_KEY",
          "CONTACT_TO_EMAIL",
          "TURNSTILE_SECRET_KEY",
        ]) {
          const saved = process.env[variable];
          delete process.env[variable];
          assert.equal(prepareContactForm("solutions"), null, variable);
          process.env[variable] = saved;
        }
        process.env.CONTACT_FROM_EMAIL = "not an email";
        assert.equal(prepareContactForm("solutions"), null);
        process.env.CONTACT_FROM_EMAIL = "sender@example.com";
      },
    );
    await t.test(
      "shared limits use the Vercel integration's names, falling back to Upstash's",
      async () => {
        process.env.UPSTASH_REDIS_REST_URL = "https://upstash.example.io";
        process.env.UPSTASH_REDIS_REST_TOKEN = "u";
        assert.deepEqual(getRedisSettings(), {
          url: "https://upstash.example.io",
          token: "u",
        });
        process.env.KV_REST_API_URL = "https://kv.example.io/";
        process.env.KV_REST_API_TOKEN = "k";
        assert.deepEqual(getRedisSettings(), {
          url: "https://kv.example.io",
          token: "k",
        });
        // Plain HTTP is never used for the store.
        process.env.KV_REST_API_URL = "http://kv.example.io";
        assert.equal(getRedisSettings(), null);
        for (const variable of [
          "UPSTASH_REDIS_REST_URL",
          "UPSTASH_REDIS_REST_TOKEN",
          "KV_REST_API_URL",
          "KV_REST_API_TOKEN",
        ])
          delete process.env[variable];
      },
    );
    await t.test("missing configuration never reports success", async () => {
      calls = [];
      globalThis.fetch = fakeServices(calls);
      delete process.env.BREVO_API_KEY;
      const response = await handleContact(makeRequest(), "solutions");
      assert.equal(status(response), "configuration");
      assert.match(result(response).get("ref"), /^[A-Z0-9]{8}$/);
      process.env.BREVO_API_KEY = "test-key";
      delete process.env.TURNSTILE_SECRET_KEY;
      assert.equal(
        status(await handleContact(makeRequest(), "solutions")),
        "configuration",
      );
      assert.equal(calls.length, 0);
    });
  } finally {
    console.error = quiet;
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env))
      if (!(key in saved)) delete process.env[key];
    Object.assign(process.env, saved);
  }
});
