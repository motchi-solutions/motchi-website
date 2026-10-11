import assert from "node:assert/strict";
import test from "node:test";

test("development page and API module copies accept the same temporary form secret", async (t) => {
  const savedEnvironment = process.env.NODE_ENV;
  const savedSecret = process.env.CONTACT_FORM_SECRET;
  process.env.NODE_ENV = "development";
  delete process.env.CONTACT_FORM_SECRET;
  try {
    const pageModule = await import("../packages/email/src/index.ts?page-copy");
    const apiModule = await import("../packages/email/src/index.ts?api-copy");
    const now = Date.now();
    const clock = t.mock.method(Date, "now", () => now - 3000);
    const token = pageModule.createContactToken();
    clock.mock.restore();
    const body = new URLSearchParams({
      token,
      name: "Alex",
      email: "invalid",
      interest: "Websites",
      message: "A legitimate message with an invalid email.",
    });
    const response = await apiModule.handleContact(
      new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      }),
      "solutions",
    );
    const result = new URL(response.headers.get("location"));
    assert.equal(result.searchParams.get("status"), "invalid");
    assert.equal(result.searchParams.get("fields"), "email");
  } finally {
    if (savedEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = savedEnvironment;
    if (savedSecret === undefined) delete process.env.CONTACT_FORM_SECRET;
    else process.env.CONTACT_FORM_SECRET = savedSecret;
  }
});
