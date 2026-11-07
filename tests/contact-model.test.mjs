import assert from "node:assert/strict";
import test from "node:test";
import {
  initialDraft,
  validateContact,
} from "../src/components/ui/contact/contact-model.ts";

test("capability links resolve to known services and ignore unknown query values", () => {
  for (const [topic, service] of [
    ["Websites", "Website"],
    ["Data", "Data & Analytics"],
    ["Cloud", "Cloud / Infrastructure"],
    ["Products", "Product / Software Idea"],
    ["Something else", "Not Sure Yet"],
    ["AI", "AI Adoption"],
  ]) {
    assert.deepEqual(initialDraft(topic).services, [service]);
  }
  assert.deepEqual(initialDraft("unknown").services, []);
});
test("each step validates only its required answers", () => {
  const draft = initialDraft();
  assert.deepEqual(Object.keys(validateContact(draft, 0)), ["services"]);
  assert.deepEqual(Object.keys(validateContact(draft, 1)), [
    "business",
    "stage",
    "timeline",
  ]);
  assert.deepEqual(Object.keys(validateContact(draft, 2)), ["name", "email"]);
  draft.name = "Alex";
  draft.email = "alex@example.com";
  assert.deepEqual(validateContact(draft, 2), {});
  draft.name = "   ";
  draft.email = "alex@";
  assert.ok(validateContact(draft, 2).name);
  assert.ok(validateContact(draft, 2).email);
});
test("optional website accepts HTTP addresses and rejects other protocols", () => {
  const draft = { ...initialDraft(), name: "Alex", email: "alex@example.com" };
  for (const website of [
    "",
    "https://example.com",
    "http://example.com/path",
  ]) {
    assert.equal(validateContact({ ...draft, website }, 2).website, undefined);
  }
  for (const website of [
    "example.com",
    "javascript:alert(1)",
    "ftp://example.com",
  ]) {
    assert.ok(validateContact({ ...draft, website }, 2).website);
  }
});

test("forward navigation validates all preceding steps while back remains available", async () => {
  const { canVisitContactStep } =
    await import("../src/components/ui/contact/contact-model.ts");
  const draft = initialDraft();
  assert.equal(canVisitContactStep(draft, 0, 1), false);
  assert.equal(canVisitContactStep(draft, 2, 0), true);
  draft.services = ["AI"];
  assert.equal(canVisitContactStep(draft, 0, 1), true);
  assert.equal(canVisitContactStep(draft, 0, 2), false);
  draft.business = "Small business";
  draft.stage = "I have an idea";
  draft.timeline = "Within a month";
  assert.equal(canVisitContactStep(draft, 0, 2), true);
  assert.equal(canVisitContactStep(draft, 2, 3), false);
  draft.name = "Alex";
  draft.email = "alex@example.com";
  assert.equal(canVisitContactStep(draft, 0, 3), true);
});

test("saved drafts reject corrupt, expired, unknown, or excessive data and clamp incomplete steps", async () => {
  const { parseContactDraft, contactDraftLifetime } =
    await import("../src/components/ui/contact/contact-model.ts");
  const now = Date.now();
  const saved = {
    version: 1,
    updatedAt: now,
    step: 3,
    draft: { ...initialDraft(), services: ["AI"] },
  };
  const parse = (value) => parseContactDraft(JSON.stringify(value), now);
  assert.equal(parse(saved).step, 1);
  assert.equal(parse({ ...saved, version: 2 }), null);
  assert.equal(
    parse({ ...saved, updatedAt: now - contactDraftLifetime }),
    null,
  );
  assert.equal(parse({ ...saved, updatedAt: now + 1 }), null);
  assert.equal(parse({ ...saved, step: 99 }), null);
  assert.equal(parseContactDraft("broken json", now), null);
  for (const draft of [
    initialDraft(),
    { ...saved.draft, name: "a".repeat(151) },
    { ...saved.draft, services: ["unknown"] },
    { ...saved.draft, details: { AI: ["unknown"] } },
    { ...saved.draft, business: "unknown" },
    { ...saved.draft, email: null },
  ]) {
    assert.equal(parse({ ...saved, draft }), null);
  }
  const draft = {
    ...saved.draft,
    details: { AI: ["Add an AI assistant"] },
    name: "Alex",
    context: "<script>untrusted</script>",
  };
  assert.deepEqual(parse({ ...saved, draft }).draft, {
    ...draft,
    services: ["AI Adoption"],
    details: { "AI Adoption": ["Add an AI assistant"] },
  });
});

test("draft retention is exactly three days", async () => {
  const { contactDraftLifetime } =
    await import("../src/components/ui/contact/contact-model.ts");
  assert.equal(contactDraftLifetime, 3 * 24 * 60 * 60 * 1000);
});

test("new budget brackets restore and older broad-budget drafts keep their other answers", async () => {
  const { parseContactDraft, questions } =
    await import("../src/components/ui/contact/contact-model.ts");
  assert.ok(questions.budget.options.includes("$100-$500"));
  assert.ok(questions.budget.options.includes("$500-$1,000"));
  const now = Date.now();
  for (const budget of ["$100-$500", "$500-$1,000", "Under $1,000"]) {
    const saved = {
      version: 1,
      updatedAt: now,
      step: 1,
      draft: { ...initialDraft(), services: ["AI"], name: "Alex", budget },
    };
    const restored = parseContactDraft(JSON.stringify(saved), now);
    assert.equal(restored.draft.name, "Alex");
    assert.equal(
      restored.draft.budget,
      budget === "Under $1,000" ? "" : budget,
    );
  }
});

test("previous data choices restore into distinct goals without losing the draft", async () => {
  const { parseContactDraft } =
    await import("../src/components/ui/contact/contact-model.ts");
  const now = Date.now();
  const saved = {
    version: 1,
    updatedAt: now,
    step: 1,
    draft: {
      ...initialDraft(),
      services: ["Data & Analytics", "Cloud / Infrastructure"],
      name: "Alex",
      details: {
        "Data & Analytics": [
          "Build reports or dashboards",
          "Bring data together",
          "Keep data up to date",
          "Understand my data",
        ],
        "Cloud / Infrastructure": ["Get ongoing support"],
      },
    },
  };
  const restored = parseContactDraft(JSON.stringify(saved), now);
  assert.equal(restored.draft.name, "Alex");
  assert.deepEqual(restored.draft.details["Data & Analytics"], [
    "Build reports or dashboards",
    "Connect data from different tools",
    "Automate data updates",
    "Find trends or answer specific questions",
  ]);
  assert.deepEqual(restored.draft.details["Cloud / Infrastructure"], [
    "Get ongoing support",
  ]);
});

test("split phone validates both parts without making the field required", () => {
  const draft = initialDraft();
  assert.equal(validateContact(draft, 2).phone, undefined);
  assert.equal(validateContact(draft, 2).phoneCountryCode, undefined);
  draft.phoneCountryCode = "1";
  draft.phone = "4165550123";
  assert.equal(validateContact(draft, 2).phone, undefined);
  assert.equal(validateContact(draft, 2).phoneCountryCode, undefined);
  for (const phone of ["1".repeat(13), "abc", "416 555 0123", ""]) {
    draft.phone = phone;
    assert.ok(validateContact(draft, 2).phone);
  }
  draft.phone = "4165550123";
  draft.phoneCountryCode = "999";
  assert.ok(validateContact(draft, 2).phoneCountryCode);
});

test("international phone pastes split actual calling codes", async () => {
  const { splitInternationalPhone, formatPhone } =
    await import("../src/components/ui/contact/contact-phone.ts");
  for (const value of ["+1 (416) 555-0123", "0014165550123"])
    assert.deepEqual(splitInternationalPhone(value), {
      countryCode: "1",
      number: "4165550123",
    });
  assert.deepEqual(splitInternationalPhone("+1234567890"), {
    countryCode: "1",
    number: "234567890",
  });
  assert.deepEqual(splitInternationalPhone("+44 20 7946 0018"), {
    countryCode: "44",
    number: "2079460018",
  });
  assert.deepEqual(splitInternationalPhone("+358 40 1234567"), {
    countryCode: "358",
    number: "401234567",
  });
  assert.equal(splitInternationalPhone("+999123456"), null);
  assert.equal(formatPhone("1", "4165550123"), "416 555 0123");
});

test("legacy combined phones migrate without losing the saved draft", async () => {
  const { parseContactDraft } =
    await import("../src/components/ui/contact/contact-model.ts");
  const now = Date.now();
  const legacy = { ...initialDraft("AI"), phone: "14165550123" };
  delete legacy.phoneCountryCode;
  const restored = parseContactDraft(
    JSON.stringify({ version: 1, updatedAt: now, step: 2, draft: legacy }),
    now,
  );
  assert.equal(restored.draft.phoneCountryCode, "1");
  assert.equal(restored.draft.phone, "4165550123");
});

test("service enquiry links round-trip branch services and optional details into step two", async () => {
  const { contactEntryHref, contactEntryFromParams } =
    await import("../src/components/ui/contact/contact-entry.ts");
  for (const [branch, services, details] of [
    [
      "websites",
      ["New Website", "Booking & Integrations"],
      {
        "New Website": ["Showcase my work"],
        "Booking & Integrations": ["Add online booking"],
      },
    ],
    [
      "consulting",
      ["AI Adoption", "Databricks"],
      { Databricks: ["Set up governance"] },
    ],
  ]) {
    const draft = { ...initialDraft(undefined, branch), services, details };
    const url = new URL(
      contactEntryHref(branch, draft),
      "https://motchi.invalid",
    );
    const entry = contactEntryFromParams(url.searchParams, branch);
    assert.equal(entry.step, 1);
    assert.deepEqual(entry.draft.services, services);
    assert.deepEqual(entry.draft.details, details);
    assert.deepEqual(validateContact(entry.draft, 0), {});
    assert.equal(entry.draft.name, "");
    assert.equal(entry.draft.email, "");
  }
});

test("enquiry handoff ignores unknown services and details and cannot skip required selections", async () => {
  const { contactEntryFromParams } =
    await import("../src/components/ui/contact/contact-entry.ts");
  const invalid = contactEntryFromParams(
    new URLSearchParams("continue=project&service=unknown"),
    "websites",
  );
  assert.equal(invalid.step, 0);
  assert.deepEqual(invalid.draft.services, []);
  const params = new URLSearchParams({
    continue: "project",
    service: "AI Adoption",
    "detail.AI Adoption": "invalid",
    "detail.Databricks": "Set up governance",
  });
  params.append("service", "AI Adoption");
  const entry = contactEntryFromParams(params, "consulting");
  assert.deepEqual(entry.draft.services, ["AI Adoption"]);
  assert.deepEqual(entry.draft.details, {});
  assert.equal(
    contactEntryFromParams(new URLSearchParams(), "solutions", "Website").step,
    0,
  );
});

test("branch enquiries remain valid for the consolidated contact endpoint", async () => {
  const { consolidatedContactSubmissionFields } =
    await import("../src/components/ui/contact/contact-submission.ts");
  const { getContactConfiguration } =
    await import("../src/components/ui/contact/contact-config.ts");
  const { validateContact: validateSubmission } =
    await import("../src/lib/email/validation.ts");
  for (const branch of ["websites", "consulting"]) {
    for (const service of getContactConfiguration(branch).services) {
      const draft = {
        ...initialDraft(service, branch),
        name: "Alex Morgan",
        email: "alex@example.com",
        website: "https://example.com",
        budget: "$500-$1,000",
      };
      const fields = consolidatedContactSubmissionFields(
        draft,
        branch,
        "test-token",
      );
      const form = new FormData();
      for (const [key, value] of fields) form.append(key, value);
      assert.deepEqual(
        validateSubmission(form, "solutions").errors,
        {},
        `${branch}: ${service}`,
      );
      assert.ok(fields.get("message").includes(service));
      assert.ok(fields.get("message").includes("https://example.com"));
    }
  }
});
