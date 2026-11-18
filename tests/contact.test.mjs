import assert from "node:assert/strict";
import test from "node:test";
import { signToken, verifyToken } from "../src/lib/email/abuse.ts";
import {
  acknowledgement,
  escapeHtml,
  notification,
} from "../src/lib/email/templates.ts";
import { isEmail, validateContact } from "../src/lib/email/validation.ts";
import { filterContactCharacters } from "../src/lib/config/validation.ts";

test("character filtering preserves meaningful content and incomplete typing", () => {
  assert.equal(
    filterContactCharacters("name", "Anne-Marie O'Neill 123"),
    "Anne-Marie O'Neill ",
  );
  assert.equal(
    filterContactCharacters("name", "Jose\u0301 \u674e\u660e"),
    "Jose\u0301 \u674e\u660e",
  );
  assert.equal(
    filterContactCharacters("email", " alex+team_2 @example.com "),
    "alex+team_2@example.com",
  );
  assert.equal(filterContactCharacters("email", "alex@"), "alex@");
  assert.equal(
    filterContactCharacters("phone", "+1 (416) 555-0123"),
    "14165550123",
  );
  assert.equal(
    filterContactCharacters("website", "https://example.com /page"),
    "https://example.com/page",
  );
  const message = "Please connect 3 tools: CRM + billing.\nBudget: $2,000.";
  assert.equal(filterContactCharacters("context", message), message);
  assert.equal(
    filterContactCharacters("company", "Studio 123 & Co."),
    "Studio 123 & Co.",
  );
  assert.equal(
    filterContactCharacters("message", "Hello\u0000 world"),
    "Hello world",
  );
});

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
test("contact names enforce length and letters while preserving international names", () => {
  for (const name of [
    "Jo",
    "Anne-Marie",
    "O'Neill",
    "Jose\u0301",
    "\u674e\u660e",
    "A".repeat(100),
  ]) {
    assert.equal(
      validateContact(form({ name }), "websites").errors.name,
      undefined,
      name,
    );
  }
  for (const name of [
    "A",
    "12",
    "Alex2",
    "A".repeat(101),
    "--",
    "Alex\nSmith",
  ]) {
    assert.ok(validateContact(form({ name }), "websites").errors.name, name);
  }
});
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
      "2-3 business days",
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

test("emails are structured, plain-text safe, and never relay the message", () => {
  const message = [
    "Enquiry type: Motchi Consulting",
    "Selected services: AI Adoption",
    "Website: https://evil.example",
    "Phone: +1 (416) 555-0123",
    "Additional details:",
    "<b>Hello</b>\nSecond line",
  ].join("\n");
  const input = validateContact(
    form({ message, website: "", interest: "AI Adoption" }),
    "consulting",
  ).input;
  const mail = notification(input, "Motchi Consulting");
  // Plain text has every answer and none of the template's markup; the
  // visitor's own text stays exactly as typed.
  assert.ok(
    !/<(table|p|a|h1|h2|div|br)\b|href=/i.test(
      mail.textContent.replace("<b>Hello</b>", ""),
    ),
  );
  assert.match(mail.textContent, /Selected services: AI Adoption/);
  assert.match(mail.textContent, /<b>Hello<\/b>\nSecond line/);
  // HTML escapes the message and links only validated values.
  assert.ok(!mail.htmlContent.includes("<b>Hello"));
  assert.ok(mail.htmlContent.includes('href="tel:+14165550123"'));
  assert.ok(!mail.htmlContent.includes('href="https://evil.example"'));
  assert.ok(mail.htmlContent.includes('href="mailto:alex@example.com'));
  // The acknowledgement goes to the typed address, so it never repeats input
  // other than the validated name.
  const ack = acknowledgement("Alex", "Motchi Consulting");
  for (const part of [ack.textContent, ack.htmlContent]) {
    assert.ok(!part.includes("Hello</b>"));
    assert.match(part, /2-3 business days/);
  }
  for (const part of [
    mail.textContent,
    mail.htmlContent,
    ack.textContent,
    ack.htmlContent,
  ])
    assert.ok(/^[\t\n\r -~]*$/.test(part), "Email copy stays ASCII.");
});

test("the acknowledgement shows its brand banner, with a clean fallback", () => {
  for (const [branch, slug] of [
    ["Motchi Solutions", "solutions"],
    ["Motchi Websites", "websites"],
    ["Motchi Consulting", "consulting"],
  ]) {
    const { htmlContent } = acknowledgement(
      "Alex",
      branch,
      "https://www.motchi.ca",
    );
    assert.ok(
      htmlContent.includes(
        `src="https://www.motchi.ca/email/ack-${slug}.png" width="600" height="180" alt="${branch}"`,
      ),
      branch,
    );
    // A burgundy cell behind the image, so a blocked image leaves a brand band.
    assert.match(htmlContent, /bgcolor="#5B0202"[^>]*><img /i);
  }
  const { textContent } = acknowledgement("Alex", "Motchi Websites");
  assert.match(
    textContent,
    /3\. If we both find it useful, we'll set up a free 30-minute intro call, with no commitment\./,
  );
});

test("every banner the acknowledgement links to exists", async () => {
  const { existsSync } = await import("node:fs");
  for (const slug of ["solutions", "websites", "consulting"])
    assert.ok(existsSync(`public/email/ack-${slug}.png`), slug);
});

test("an address with mailto-significant characters cannot add fields to the reply links", () => {
  // Valid per RFC 5322; unencoded it would become mailto:x?bcc=...&body=...
  const email = "x?bcc=attacker%40evil.test&body=hi@example.com";
  const { input, errors } = validateContact(form({ email }), "consulting");
  assert.equal(errors.email, undefined);
  const html = notification(input, "Motchi Consulting").htmlContent;
  assert.ok(
    html.includes(
      'href="mailto:x%3Fbcc%3Dattacker%2540evil.test%26body%3Dhi@example.com"',
    ),
  );
  assert.ok(
    html.includes(
      'href="mailto:x%3Fbcc%3Dattacker%2540evil.test%26body%3Dhi@example.com?subject=Re%3A',
    ),
  );
  assert.ok(!/href="mailto:x\?/.test(html));
});

test("text fields reject characters that can disguise or reorder the notification", () => {
  for (const hidden of ["‮", "⁦", " ", "\u0085"]) {
    assert.ok(
      validateContact(form({ company: `Acme${hidden}Ltd` }), "websites").errors
        .company,
      `company accepts U+${hidden.charCodeAt(0).toString(16)}`,
    );
    assert.ok(
      validateContact(
        form({ message: `Hello there${hidden} friend` }),
        "websites",
      ).errors.message,
    );
    assert.equal(filterContactCharacters("message", `a${hidden}b`), "ab");
  }
  // Emoji joiners and ordinary non-Latin text are untouched.
  assert.equal(
    filterContactCharacters("message", "Hi \u{1F469}‍\u{1F4BB} שלום"),
    "Hi \u{1F469}‍\u{1F4BB} שלום",
  );
});

test("only answers the wizard sends become notification rows; other lines stay in the message", () => {
  const message = [
    "Enquiry type: Motchi Solutions",
    "Selected services: Website",
    "Website: Build a new website",
    "Website address: https://client.example",
    "Budget (CAD): Under $5,000",
    "Referred by: Your existing client",
    "Budget (CAD): $40,000+ approved",
    "Additional details:",
    "Looking forward to it.",
  ].join("\n");
  const { input } = validateContact(
    form({ message, interest: "Websites" }),
    "solutions",
  );
  const mail = notification(input, "Motchi Solutions");
  const row = (label, value) =>
    new RegExp(`${label}</td><td[^>]*>${value}</td>`).test(mail.htmlContent);
  // The service follow-up and the address are separate rows.
  assert.ok(row("Website", "Build a new website"));
  assert.ok(mail.textContent.includes("Website: https://client.example"));
  assert.ok(row("Budget \\(CAD\\)", "Under \\$5,000"));
  // An unknown label and a repeated answer read as the visitor's own words.
  assert.ok(!row("Referred by", "Your existing client"));
  assert.ok(!row("Budget \\(CAD\\)", "\\$40,000\\+ approved"));
  assert.match(
    mail.textContent,
    /MESSAGE\nReferred by: Your existing client\nBudget \(CAD\): \$40,000\+ approved\nLooking forward to it\./,
  );
});
