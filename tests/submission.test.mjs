import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { signToken } from "../packages/email/src/abuse.ts";
import { handleContact } from "../packages/email/src/index.ts";

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
    ...overrides,
  });
  return new Request("https://motchi.ca/api/contact", {
    method: "POST",
    headers: {
      origin: "https://motchi.ca",
      "content-type": "application/x-www-form-urlencoded",
      ...headers,
    },
    body: params.toString(),
  });
}
function status(response) {
  return new URL(response.headers.get("location")).searchParams.get("status");
}

test("native contact submission handles validation, delivery, partial failure, and replay", async (t) => {
  const saved = { ...process.env };
  const originalFetch = globalThis.fetch;
  process.env.NODE_ENV = "production";
  process.env.CONTACT_FORM_SECRET = "a".repeat(64);
  process.env.BREVO_API_KEY = "test-key";
  process.env.CONTACT_FROM_EMAIL = "sender@example.com";
  process.env.CONTACT_TO_EMAIL = "inbox@example.com";
  try {
    let calls = [];
    globalThis.fetch = async (_url, options) => {
      calls.push(JSON.parse(options.body));
      return new Response('{"messageId":"test"}', { status: 201 });
    };
    await t.test(
      "cross-origin and invalid fields never send mail",
      async () => {
        assert.equal(
          status(
            await handleContact(
              makeRequest({}, { origin: "https://other.example" }),
              "solutions",
            ),
          ),
          "invalid",
        );
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
      "acknowledgement failure reports that enquiry was sent and avoids a resend",
      async () => {
        calls = [];
        globalThis.fetch = async (_url, options) => {
          calls.push(JSON.parse(options.body));
          return new Response("", { status: calls.length === 1 ? 201 : 503 });
        };
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
      "provider rejection and missing configuration never report success",
      async () => {
        calls = [];
        globalThis.fetch = async () => {
          calls.push({});
          return new Response("", { status: 503 });
        };
        assert.equal(
          status(await handleContact(makeRequest(), "solutions")),
          "unavailable",
        );
        assert.equal(calls.length, 1);
        delete process.env.BREVO_API_KEY;
        assert.equal(
          status(await handleContact(makeRequest(), "solutions")),
          "unavailable",
        );
        assert.equal(calls.length, 1);
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of Object.keys(process.env))
      if (!(key in saved)) delete process.env[key];
    Object.assign(process.env, saved);
  }
});
