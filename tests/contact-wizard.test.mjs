import assert from "node:assert/strict";
import test from "node:test";
import { contactContextLimit } from "../packages/config/src/validation.ts";
import { validateContact as validateSubmission } from "../packages/email/src/validation.ts";
import { getContactConfiguration } from "../packages/ui/src/contact/contact-config.ts";
import {
  initialDraft,
  parseContactDraft,
  getContactDraftKey,
  validateContact,
  canVisitContactStep,
} from "../packages/ui/src/contact/contact-model.ts";
import { contactSubmissionFields } from "../packages/ui/src/contact/contact-submission.ts";

function completed(branch) {
  const config = getContactConfiguration(branch);
  return {
    ...initialDraft(undefined, branch),
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
