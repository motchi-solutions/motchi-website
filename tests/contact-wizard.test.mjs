import { branchHref } from "../src/lib/config/navigation.ts";
import assert from "node:assert/strict";
import test from "node:test";
import { contactContextLimit } from "../src/lib/config/validation.ts";
import { validateContact as validateSubmission } from "../src/lib/email/validation.ts";
import { getContactConfiguration } from "../src/components/ui/contact/contact-config.ts";
import {
  initialDraft,
  parseContactDraft,
  getContactDraftKey,
  validateContact,
  canVisitContactStep,
} from "../src/components/ui/contact/contact-model.ts";
import { contactSubmissionFields } from "../src/components/ui/contact/contact-submission.ts";

function completed(branch) {
  const config = getContactConfiguration(
    branch === "solutions" ? "consulting" : branch,
  );
  return {
    ...initialDraft(undefined, branch),
    enquiryType: branch === "solutions" ? "consulting" : branch,
    services: [...config.services],
    details: Object.fromEntries(
      Object.entries(config.followUps).map(([key, options]) => [
        key,
        [...options],
      ]),
    ),
    business: config.questions.business.options[0],
    stage: config.questions.stage.options[0],
    timeline: config.questions.timeline.options[0],
    budget: config.questions.budget.options[0],
    name: "Alex Morgan",
    email: "alex@example.com",
    organization: "Example Studio",
    website: "https://example.com",
    phone: "4165550123",
    phoneCountryCode: "1",
    context: "A".repeat(contactContextLimit),
  };
}
test("each site has targeted services and topics while sharing navigation rules", () => {
  assert.deepEqual(initialDraft("New website", "websites").services, [
    "New Website",
  ]);
  assert.deepEqual(initialDraft("AI", "consulting").services, ["AI Adoption"]);
  assert.deepEqual(initialDraft("Databricks", "consulting").services, [
    "Databricks",
  ]);
  for (const branch of ["solutions", "websites", "consulting"]) {
    const empty = initialDraft(undefined, branch);
    assert.equal(canVisitContactStep(empty, 0, 3), false);
    assert.equal(canVisitContactStep(completed(branch), 0, 3), true);
    for (const step of [0, 1, 2])
      assert.deepEqual(validateContact(completed(branch), step), {});
  }
});
test("drafts are branch-scoped and cannot restore another site's choices", () => {
  const now = Date.now();
  assert.equal(
    new Set(["solutions", "websites", "consulting"].map(getContactDraftKey))
      .size,
    3,
  );
  for (const branch of ["solutions", "websites", "consulting"]) {
    const raw = JSON.stringify({
      version: 1,
      branch,
      updatedAt: now,
      step: 3,
      draft: completed(branch),
    });
    assert.equal(parseContactDraft(raw, now, branch).step, 3);
    for (const other of ["solutions", "websites", "consulting"].filter(
      (value) => value !== branch,
    ))
      assert.equal(parseContactDraft(raw, now, other), null);
  }
});
test("saved drafts retain over-limit messages for editing", () => {
  const now = Date.now();
  const draft = completed("solutions");
  draft.context = "A".repeat(3500);
  const restored = parseContactDraft(
    JSON.stringify({ version: 1, updatedAt: now, step: 3, draft }),
    now,
  );
  assert.equal(restored.draft.context, draft.context);
  assert.equal(restored.step, 2);
  assert.equal(restored.draft.name, draft.name);
});
test("all selected wizard answers reach existing validated submission payloads", () => {
  for (const branch of ["websites", "consulting"]) {
    const draft = completed(branch);
    const params = contactSubmissionFields(draft, branch, "test-token", "");
    const form = new FormData();
    for (const [key, value] of params) form.append(key, value);
    const checked = validateSubmission(form, branch);
    assert.deepEqual(checked.errors, {});
    const message = params.get("message");
    for (const service of draft.services) assert.ok(message.includes(service));
    for (const values of Object.values(draft.details))
      for (const value of values) assert.ok(message.includes(value));
    assert.ok(message.includes(draft.context));
    assert.ok(message.length <= 5000, `${branch}: ${message.length}`);
    assert.equal(params.get("token"), "test-token");
    assert.equal(params.get("fax"), "");
    assert.equal(params.get("company"), draft.organization);
    if (branch === "consulting") assert.ok(message.includes(draft.website));
    assert.equal(
      contactSubmissionFields(draft, branch, "test-token", "bot").get("fax"),
      "bot",
    );
    const international = {
      ...draft,
      context: "\u754c".repeat(contactContextLimit),
      name: "\u674e".repeat(100),
      organization: "\u793e".repeat(150),
    };
    const encoded = contactSubmissionFields(
      international,
      branch,
      "test-token",
    ).toString();
    assert.ok(
      Buffer.byteLength(encoded) <= 24000,
      `${branch}: encoded message exceeds transport limit`,
    );
  }
});

test("service enquiry links initialize supported contact choices", () => {
  for (const [topic, service] of [
    ["Maintenance", "Website"],
    ["Website redesign", "Website"],
    ["Databricks", "Data & Analytics"],
    ["Technology Strategy", "Technology Advice"],
  ]) {
    assert.deepEqual(initialDraft(topic, "solutions").services, [service]);
  }
  for (const [branch, service] of [
    ["websites", "Website"],
    ["consulting", "Technology Advice"],
  ]) {
    const topic = new URL(
      branchHref(branch, "/contact"),
      "https://motchi.test",
    ).searchParams.get("topic");
    const draft = initialDraft(topic, "solutions");
    assert.ok(draft.services.includes(service));
  }
});

test("the main form requires an enquiry type and branch arrivals preselect it", () => {
  const draft = initialDraft();
  assert.equal(draft.enquiryType, "");
  draft.services = ["Not Sure Yet"];
  assert.equal(canVisitContactStep(draft, 0, 1), false);
  assert.ok(validateContact(draft, 0).enquiryType);
  for (const branch of ["websites", "consulting"]) {
    const arrival = initialDraft(undefined, branch);
    assert.equal(arrival.enquiryType, branch);
    assert.equal(validateContact(arrival, 0).enquiryType, undefined);
    assert.ok(validateContact(arrival, 0).services);
    arrival.services = ["Not Sure Yet"];
    assert.equal(canVisitContactStep(arrival, 0, 1), true);
  }
});

test("main-form drafts restore the chosen branch with its actual questions", () => {
  const now = Date.now();
  for (const choice of ["websites", "consulting"]) {
    const draft = completed(choice);
    const save = (value) =>
      JSON.stringify({
        version: 1,
        branch: "solutions",
        updatedAt: now,
        step: 3,
        draft: value,
      });
    const restored = parseContactDraft(save(draft), now, "solutions");
    assert.equal(restored.step, 3);
    assert.equal(restored.draft.enquiryType, choice);
    assert.deepEqual(restored.draft.services, draft.services);
    assert.deepEqual(restored.draft.details, draft.details);
    assert.equal(
      parseContactDraft(
        save({ ...draft, enquiryType: "unknown" }),
        now,
        "solutions",
      ),
      null,
    );
    assert.equal(
      parseContactDraft(
        save({
          ...draft,
          enquiryType: choice === "websites" ? "consulting" : "websites",
        }),
        now,
        "solutions",
      ),
      null,
    );
  }
});

test("older main-form drafts keep answers while asking for the new choice", () => {
  const now = Date.now();
  const draft = { ...initialDraft(), services: ["AI Adoption"], name: "Alex" };
  delete draft.enquiryType;
  const restored = parseContactDraft(
    JSON.stringify({ version: 1, updatedAt: now, step: 3, draft }),
    now,
  );
  assert.equal(restored.step, 0);
  assert.equal(restored.draft.enquiryType, "");
  assert.equal(restored.draft.name, "Alex");
  assert.deepEqual(restored.draft.services, ["AI Adoption"]);
});

test("product enquiries skip project questions and retain their topic through drafts and submission", async () => {
  const { contactStepIndices } =
    await import("../src/components/ui/contact/contact-model.ts");
  const { contactEntryFromParams } =
    await import("../src/components/ui/contact/contact-entry.ts");
  const { consolidatedContactSubmissionFields } =
    await import("../src/components/ui/contact/contact-submission.ts");
  const entry = contactEntryFromParams(
    new URLSearchParams(
      "enquiry=products&product=Pop+Tips&service=Report+a+bug",
    ),
    "solutions",
  );
  const draft = {
    ...entry.draft,
    name: "Alex Morgan",
    email: "alex@example.com",
    context: "The tip calculator does not update after changing the total.",
  };
  assert.deepEqual(contactStepIndices(draft), [0, 2, 3]);
  assert.equal(canVisitContactStep(draft, 0, 1), false);
  assert.equal(canVisitContactStep(draft, 0, 2), true);
  assert.equal(canVisitContactStep(draft, 2, 3), true);
  assert.deepEqual(validateContact(draft, 1), {});
  assert.ok(validateContact({ ...draft, context: "" }, 2).context);
  // Hidden website/phone answers from another enquiry must not block Products.
  assert.deepEqual(
    validateContact({ ...draft, website: "incomplete", phone: "1" }, 2),
    {},
  );
  const now = Date.now();
  const restored = parseContactDraft(
    JSON.stringify({
      version: 1,
      branch: "solutions",
      updatedAt: now,
      step: 3,
      draft,
    }),
    now,
    "solutions",
  );
  assert.equal(restored.step, 3);
  assert.equal(restored.draft.productName, "Pop Tips");
  const fields = consolidatedContactSubmissionFields(
    draft,
    "products",
    "test-token",
  );
  assert.equal(fields.get("interest"), "Products");
  assert.match(fields.get("message"), /Product: Pop Tips/);
  assert.match(fields.get("message"), /Report a bug/);
  assert.doesNotMatch(
    fields.get("message"),
    /Project stage:|Timeline:|Budget \(CAD\):/,
  );
});

test("pricing links prefill an allowlisted tier and keep it in the submission", async () => {
  const { contactEntryFromParams, contactEntryHref } =
    await import("../src/components/ui/contact/contact-entry.ts");
  for (const tier of ["Starter", "Business", "Advanced", "I'm not sure"]) {
    const entry = contactEntryFromParams(
      new URLSearchParams({ tier }),
      "websites",
    );
    assert.equal(entry.draft.websiteTier, tier);
    const now = Date.now();
    const restored = parseContactDraft(
      JSON.stringify({
        version: 1,
        branch: "websites",
        updatedAt: now,
        step: 0,
        draft: { ...entry.draft, services: ["New Website"] },
      }),
      now,
      "websites",
    );
    assert.equal(restored.draft.websiteTier, tier);
    const href = contactEntryHref("websites", entry.draft);
    assert.equal(
      new URL(href, "https://example.com").searchParams.get("tier"),
      tier,
    );
    assert.match(
      contactSubmissionFields(entry.draft, "websites", "test-token").get(
        "message",
      ),
      new RegExp(`Website tier: ${tier}`),
    );
  }
  assert.equal(
    contactEntryFromParams(new URLSearchParams("tier=unknown"), "websites")
      .draft.websiteTier,
    "",
  );
  // Earlier links and saved drafts used the combined tier name.
  const legacy = contactEntryFromParams(
    new URLSearchParams({ tier: "Advanced / Enterprise" }),
    "websites",
  );
  assert.equal(legacy.draft.websiteTier, "Advanced");
  const legacyDraft = parseContactDraft(
    JSON.stringify({
      version: 1,
      branch: "websites",
      updatedAt: Date.now(),
      step: 0,
      draft: {
        ...legacy.draft,
        services: ["New Website"],
        websiteTier: "Advanced / Enterprise",
      },
    }),
    Date.now(),
    "websites",
  );
  assert.equal(legacyDraft?.draft.websiteTier, "Advanced");
});

test("website tiers start unselected and explicit choices remain draft progress", async () => {
  const { hasContactProgress } =
    await import("../src/components/ui/contact/contact-model.ts");
  const { contactEntryHref } =
    await import("../src/components/ui/contact/contact-entry.ts");
  const draft = initialDraft(undefined, "websites");
  assert.equal(draft.websiteTier, "");
  assert.equal(hasContactProgress(draft), false);
  assert.equal(
    new URL(
      contactEntryHref("websites", draft),
      "https://example.com",
    ).searchParams.has("tier"),
    false,
  );
  for (const tier of ["Business", "I'm not sure"]) {
    assert.equal(hasContactProgress({ ...draft, websiteTier: tier }), true);
  }
});

test("simplified project choices restore older drafts without losing answers", () => {
  const now = Date.now();
  for (const branch of ["solutions", "websites", "consulting"]) {
    for (const business of [
      "Small business",
      "Growing business",
      "Established organization",
    ]) {
      for (const stage of ["Just exploring", "I have an idea"]) {
        const draft = { ...completed(branch), business, stage };
        const restored = parseContactDraft(
          JSON.stringify({
            version: 1,
            branch,
            updatedAt: now,
            step: 3,
            draft,
          }),
          now,
          branch,
        );
        assert.ok(restored);
        assert.equal(restored.draft.business, "Business");
        assert.equal(restored.draft.stage, "Exploring an idea");
        assert.equal(restored.draft.name, draft.name);
        assert.equal(restored.draft.context, draft.context);
        assert.equal(restored.draft.budget, draft.budget);
        assert.deepEqual(restored.draft.details, draft.details);
        assert.deepEqual(validateContact(restored.draft, 1), {});
        assert.equal(restored.step, 3);
      }
    }
  }
});
