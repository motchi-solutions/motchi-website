import type { Branch } from "../../../lib/brand.ts";
import { contactMessage } from "../../../lib/email/feedback.ts";
import { getContactConfiguration } from "./contact-config.ts";
import { initialDraft } from "./contact-model.ts";
import { formatPhone } from "./contact-phone.ts";
import type { ContactDraft } from "./contact-model.ts";

// Existing endpoints accept one routing category; the message retains every choice.
export function contactSubmissionFields(
  draft: ContactDraft,
  branch: Branch,
  token: string,
  fax = "",
) {
  const config = getContactConfiguration(branch);
  const lines = [
    `Selected services: ${draft.services.join(", ")}`,
    ...draft.services
      .filter((service) => draft.details[service]?.length)
      .map((service) => `${service}: ${draft.details[service].join(", ")}`),
    `Project / organization: ${draft.business}`,
    `Project stage: ${draft.stage}`,
    `Timeline: ${draft.timeline}`,
    `Budget (CAD): ${draft.budget || "Not provided"}`,
    ...(draft.website && branch !== "websites"
      ? [`Website: ${draft.website}`]
      : []),
    ...(draft.phone
      ? [
          `Phone: +${draft.phoneCountryCode} ${formatPhone(draft.phoneCountryCode, draft.phone)}`,
        ]
      : []),
    ...(draft.source ? [`How you found us: ${draft.source}`] : []),
    ...(draft.context ? ["Additional details:", draft.context] : []),
  ];
  return new URLSearchParams({
    token,
    fax,
    name: draft.name,
    email: draft.email,
    company: draft.organization,
    website: branch === "websites" ? draft.website : "",
    interest: config.submissionInterests[draft.services[0]],
    budget: branch === "websites" ? draft.budget : "",
    message: lines.join("\n"),
  });
}
// All branches submit through the consolidated Solutions endpoint. Keep detailed
// branch choices in the message while routing through its supported categories.
export function consolidatedContactSubmissionFields(
  draft: ContactDraft,
  branch: Branch,
  token: string,
  fax = "",
) {
  const fields = contactSubmissionFields(draft, branch, token, fax);
  if (branch !== "solutions") {
    const service = initialDraft(draft.services[0], "solutions").services[0];
    fields.set(
      "interest",
      getContactConfiguration("solutions").submissionInterests[service],
    );
    if (branch === "websites" && draft.website)
      fields.set(
        "message",
        `${fields.get("message")}\nWebsite: ${draft.website}`,
      );
  }
  return fields;
}
export async function sendContactEnquiry(
  draft: ContactDraft,
  branch: Branch,
  token: string,
  fax = "",
) {
  const response = await fetch("/api/contact", {
    method: "POST",
    body: consolidatedContactSubmissionFields(draft, branch, token, fax),
    credentials: "same-origin",
    cache: "no-store",
  });
  const result = new URL(response.url);
  const status = result.searchParams.get("status") ?? "";
  if (
    result.origin !== location.origin ||
    result.pathname !== "/contact" ||
    !contactMessage(status)
  )
    throw new Error("Unconfirmed contact response");
  const html = new DOMParser().parseFromString(
    await response.text(),
    "text/html",
  );
  const nextToken = html.querySelector<HTMLInputElement>(
    'input[name="token"]',
  )?.value;
  return {
    status,
    fields: (result.searchParams.get("fields") ?? "")
      .split(",")
      .filter(Boolean),
    nextToken,
  };
}
