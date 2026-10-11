import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import {
  ConfigurationError,
  resolveSites,
} from "../packages/config/src/resolve-sites.ts";
import { getFormSecret, getServerEnv } from "../packages/config/src/env.ts";
import { acknowledgement } from "../packages/email/src/templates.ts";
import { validateContact } from "../packages/email/src/validation.ts";

test("site origins use local development defaults and canonical production defaults", () => {
  assert.equal(
    resolveSites("development").websites.url,
    "http://localhost:3001",
  );
  assert.equal(resolveSites("production").solutions.url, "https://motchi.ca");
  const sites = resolveSites("production", {
    WEBSITES_URL: "https://websites.staging.example/",
  });
  assert.equal(sites.websites.url, "https://websites.staging.example");
  assert.equal(sites.consulting.url, "https://consulting.motchi.ca");
});

test("unsafe origins fail with variable names, without exposing their values", () => {
  for (const value of [
    "http://localhost:3000",
    "https://localhost.",
    "https://127.0.0.1",
    "https://[::1]",
    "javascript:secret",
    "https://user:secret@example.com",
    "https://example.com/path",
    "https://example.com/?secret=value",
    "not-a-url",
  ]) {
    assert.throws(
      () => resolveSites("production", { SOLUTIONS_URL: value }),
      (error) => {
        assert.ok(error instanceof ConfigurationError);
        assert.deepEqual(error.variables, ["SOLUTIONS_URL"]);
        assert.ok(!error.message.includes(value));
        return true;
      },
    );
  }
  assert.equal(
    resolveSites("development", { SOLUTIONS_URL: "http://localhost:3100" })
      .solutions.url,
    "http://localhost:3100",
  );
});

test("server environment validation is lazy, rejects missing delivery config and short production secrets", () => {
  const keys = [
    "NODE_ENV",
    "CONTACT_FORM_SECRET",
    "CONTACT_FROM_EMAIL",
    "CONTACT_TO_EMAIL",
    "BREVO_API_KEY",
  ];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    process.env.NODE_ENV = "production";
    for (const key of keys.slice(1)) delete process.env[key];
    assert.throws(getFormSecret, ConfigurationError);
    assert.throws(getServerEnv, (error) => {
      assert.deepEqual(error.variables, [
        "CONTACT_FROM_EMAIL",
        "CONTACT_TO_EMAIL",
        "BREVO_API_KEY",
      ]);
      return true;
    });
    process.env.CONTACT_FORM_SECRET = "too-short";
    assert.throws(getFormSecret, ConfigurationError);
    process.env.CONTACT_FORM_SECRET = "s".repeat(64);
    process.env.CONTACT_FROM_EMAIL = "sender@example.com";
    process.env.CONTACT_TO_EMAIL = "inbox@example.com";
    process.env.BREVO_API_KEY = "fixture-key";
    assert.equal(getServerEnv().contact.toEmail, "inbox@example.com");
  } finally {
    for (const key of keys) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
});

test("secret configuration refuses imports outside the server condition", () => {
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", "import('@motchi/config/env')"],
    { encoding: "utf8" },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /cannot be imported from a Client Component/);
});

test("email confirmation uses the supplied deployment origin in HTML and text", () => {
  const result = acknowledgement(
    "Alex",
    "Motchi Websites",
    "https://staging.example",
  );
  assert.match(result.textContent, /https:\/\/staging.example/);
  assert.match(result.htmlContent, /href="https:\/\/staging.example"/);
  assert.ok(!result.htmlContent.includes("localhost"));
});

test("contact input normalizes text and rejects ambiguous duplicate fields", () => {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: "  Jose\u0301  ",
    email: " alex@example.com ",
    interest: "Websites",
    message: "Hello\r\nThis is a valid message.",
  }))
    form.set(key, value);
  let result = validateContact(form, "solutions");
  assert.deepEqual(result.errors, {});
  assert.equal(result.input.name, "José");
  assert.equal(result.input.message, "Hello\nThis is a valid message.");
  form.append("email", "other@example.com");
  result = validateContact(form, "solutions");
  assert.ok(result.errors.email);
});
