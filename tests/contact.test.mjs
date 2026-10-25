import assert from "node:assert/strict";
import test from "node:test";
import {
  createLimiter,
  signToken,
  verifyToken,
} from "../packages/email/src/abuse.ts";
import {
  acknowledgement,
  escapeHtml,
  notification,
} from "../packages/email/src/templates.ts";
import { isEmail, validateContact } from "../packages/email/src/validation.ts";

function form(overrides = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    name: "Alex",
    email: "alex@example.com",
    company: "Example",
    interest: "New website",
    message: "We need a new website for our business.",
    website: "https://example.com",
    ...overrides,
  }))
    data.set(key, value);
  return data;
}
test("valid enquiry is accepted; unsafe website protocols and email headers are rejected", () => {
  assert.deepEqual(validateContact(form(), "websites").errors, {});
  assert.ok(
    validateContact(
      form({ email: "alex@example.com\r\nBcc: other@example.com" }),
      "websites",
    ).errors.email,
  );
  assert.ok(
    validateContact(form({ website: "javascript:alert(1)" }), "websites").errors
      .website,
  );
  assert.ok(
    validateContact(
      form({ website: "https://user:pass@example.com" }),
      "websites",
    ).errors.website,
  );
});
test("branch interests, length limits, and multiline messages are validated", () => {
  assert.ok(validateContact(form(), "consulting").errors.interest);
  assert.ok(
    validateContact(
      form({ name: "a".repeat(101), message: "short" }),
      "websites",
    ).errors.name,
  );
  assert.ok(
    validateContact(form({ message: "a".repeat(5001) }), "websites").errors
      .message,
  );
  assert.deepEqual(
    validateContact(form({ message: "First line\nSecond line" }), "websites")
      .errors,
    {},
  );
});
test("HTML escapes contact content and includes plain-text alternatives", () => {
  const input = validateContact(
    form({ name: '<script>"&</script>' }),
    "websites",
  ).input;
  const mail = notification(input, "Motchi Websites");
  assert.ok(!mail.htmlContent.includes("<script>"));
  assert.ok(mail.textContent.includes(input.name));
  assert.equal(escapeHtml(`<>&"'`), "&lt;&gt;&amp;&quot;&#39;");
  assert.ok(
    acknowledgement("Alex", "Motchi Websites").textContent.includes(
      "2–3 business days",
    ),
  );
});
test("signed tokens reject tampering, fast submissions, and expiration", () => {
  const time = 1_800_000_000_000;
  const secret = "test-secret";
  const token = signToken(secret, time, "a".repeat(32));
  assert.equal(verifyToken(secret, token, time + 2500), true);
  assert.equal(verifyToken(secret, token, time + 500), false);
  assert.equal(verifyToken(secret, token, time + 3_600_001), false);
  assert.equal(verifyToken("other", token, time + 2500), false);
});
test("rate limiter expires records and bounds memory", () => {
  const allow = createLimiter(2, 1000, 1);
  assert.equal(allow("one", 0), true);
  assert.equal(allow("one", 10), true);
  assert.equal(allow("one", 20), false);
  assert.equal(allow("two", 20), false);
  assert.equal(allow("two", 1001), true);
});

test("email validation rejects malformed addresses and permits common plus addressing", () => {
  assert.equal(isEmail("alex+project@example.ca"), true);
  for (const email of [
    ".alex@example.com",
    "alex..smith@example.com",
    "alex@example..com",
    "alex@-example.com",
    `${"a".repeat(65)}@example.com`,
    'alex"@example.com',
  ]) {
    assert.equal(isEmail(email), false, email);
  }
});

test("optional website budgets are bounded, scoped, and delivered safely", () => {
  const website = validateContact(form({ budget: "CAD 149–500" }), "websites");
  assert.deepEqual(website.errors, {});
  assert.equal(website.input.budget, "CAD 149–500");
  assert.ok(
    notification(website.input, "Motchi Websites").textContent.includes(
      "CAD 149–500",
    ),
  );
  assert.equal(validateContact(form(), "websites").input.budget, "");
  assert.equal(
    validateContact(
      form({ interest: "Websites", budget: "Not sure yet" }),
      "solutions",
    ).input.budget,
    "Not sure yet",
  );
  assert.equal(
    validateContact(form({ interest: "AI", budget: "500" }), "solutions").input
      .budget,
    "",
  );
  assert.ok(
    validateContact(form({ budget: "a".repeat(101) }), "websites").errors
      .budget,
  );
  assert.ok(
    validateContact(form({ budget: "100\n200" }), "websites").errors.budget,
  );
  const repeated = form({ budget: "500" });
  repeated.append("budget", "1000");
  assert.ok(validateContact(repeated, "websites").errors.budget);
  const unsafe = validateContact(form({ budget: "<script>" }), "websites");
  assert.ok(
    !notification(unsafe.input, "Motchi Websites").htmlContent.includes(
      "<script>",
    ),
  );
});
