import assert from "node:assert/strict";
import test from "node:test";
import {
  answered,
  draftForBranch,
  errorsFromServer,
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

test("every consulting service on the page preselects a consulting enquiry option", async () => {
  const { capabilities } =
    await import("../src/content/consulting/capabilities.ts");
  for (const capability of capabilities)
    assert.deepEqual(
      initialDraft(capability.service, "consulting").services,
      [capability.service],
      capability.id,
    );
});
test("each step validates only its required answers", () => {
  const draft = initialDraft();
  assert.deepEqual(Object.keys(validateContact(draft, 0)), ["enquiryType"]);
  draft.enquiryType = "consulting";
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
  draft.enquiryType = "consulting";
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
  assert.equal(parse(saved).step, 0);
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
  for (const phone of ["1".repeat(13), "abc", "416 555 0123"]) {
    draft.phone = phone;
    assert.ok(validateContact(draft, 2).phone);
  }
  // A country code on its own (such as the +1 default) is not an answer.
  draft.phone = "";
  assert.equal(validateContact(draft, 2).phone, undefined);
  // A number without a code is accepted and sent as +1.
  draft.phone = "4165550123";
  draft.phoneCountryCode = "";
  assert.equal(validateContact(draft, 2).phoneCountryCode, undefined);
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
  assert.equal(formatPhone("1", "4165550123"), "(416) 555-0123");
  assert.equal(formatPhone("", "4165550123"), "(416) 555-0123");
  assert.equal(formatPhone("44", "2079460018"), "20 7946 0018");
});

test("typed and autofilled phones split their country code", async () => {
  const { readPhoneEntry, formatInternationalPhone } =
    await import("../src/components/ui/contact/contact-phone.ts");
  const empty = { countryCode: "", number: "" };
  // Autofill of a full international number into the number box.
  assert.deepEqual(readPhoneEntry("+14112223333", empty, "number"), {
    countryCode: "1",
    number: "4112223333",
  });
  assert.deepEqual(readPhoneEntry("+44 20 7946 0018", empty, "number"), {
    countryCode: "44",
    number: "2079460018",
  });
  // A national number defaults to +1 once typing starts.
  assert.deepEqual(readPhoneEntry("4", empty, "number"), {
    countryCode: "1",
    number: "4",
  });
  // An existing country code is kept while typing.
  assert.deepEqual(
    readPhoneEntry("2079", { countryCode: "44", number: "207" }, "number"),
    { countryCode: "44", number: "2079" },
  );
  // Autofill into the country code box: "+1" or a full number.
  assert.deepEqual(
    readPhoneEntry(
      "+1",
      { countryCode: "", number: "4165550123" },
      "countryCode",
    ),
    { countryCode: "1", number: "4165550123" },
  );
  assert.deepEqual(readPhoneEntry("+14165550123", empty, "countryCode"), {
    countryCode: "1",
    number: "4165550123",
  });
  // A fourth typed digit in the country code box is ignored.
  assert.deepEqual(
    readPhoneEntry("4412", { countryCode: "44", number: "" }, "countryCode"),
    { countryCode: "441", number: "" },
  );
  assert.equal(
    formatInternationalPhone("1", "4112223333"),
    "+1 (411) 222-3333",
  );
  assert.equal(formatInternationalPhone("", "4165550123"), "+1 (416) 555-0123");
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

test("only entered answers count, so blur never flags an untouched field", () => {
  assert.equal(answered(""), false);
  assert.equal(answered("   "), false);
  assert.equal(answered([]), false);
  assert.equal(answered({ AI: [] }), false);
  assert.equal(answered("Mo"), true);
  assert.equal(answered(["AI Adoption"]), true);
  assert.equal(answered({ AI: ["Workflow Automation"] }), true);
});

test("an empty name asks for it; a malformed one asks for a valid one", () => {
  const draft = initialDraft(undefined, "websites");
  assert.equal(validateContact(draft, 2).name, "Please enter your name.");
  assert.equal(
    validateContact({ ...draft, name: "<>" }, 2).name,
    "Please enter a valid name.",
  );
  assert.equal(validateContact({ ...draft, name: "Mo" }, 2).name, undefined);
});

test("switching branch keeps compatible answers and restores a revisited branch", () => {
  const general = {
    ...initialDraft("Data", "solutions"),
    stage: "Have a plan",
  };
  const consulting = draftForBranch(general, "solutions", "consulting");
  assert.equal(consulting.enquiryType, "consulting");
  assert.deepEqual(consulting.services, ["Data & Analytics"]);
  // Answers that are not options in the new branch are dropped.
  const websites = draftForBranch(consulting, "consulting", "websites");
  assert.deepEqual(websites.services, []);
  // Going back restores what was chosen there before.
  const back = draftForBranch(websites, "websites", "consulting", consulting);
  assert.deepEqual(back.services, consulting.services);
  assert.equal(back.name, websites.name);
});

test("server field errors map back to form fields", () => {
  const found = errorsFromServer(["company", "message", "unknown"]);
  assert.deepEqual(Object.keys(found).sort(), ["context", "organization"]);
  assert.match(found.organization, /characters/);
  assert.deepEqual(errorsFromServer([]), {});
});
