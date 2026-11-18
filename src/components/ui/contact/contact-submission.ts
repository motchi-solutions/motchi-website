import type { Branch } from "../../../lib/brand.ts";
import { contactMessage, isReference } from "../../../lib/email/feedback.ts";
import { answerLabels, getContactConfiguration } from "./contact-config.ts";
import { initialDraft } from "./contact-model.ts";
import { formatInternationalPhone } from "./contact-phone.ts";
import type { ContactDraft } from "./contact-model.ts";

// Existing endpoints accept one routing category; the message retains every choice.
export function contactSubmissionFields(
  draft: ContactDraft,
  branch: Branch | "products",
  token: string,
  fax = "",
  // The Websites endpoint takes the address as its own field; elsewhere it
  // travels as an answer line.
  websiteInMessage = branch !== "websites",
) {
  const config = getContactConfiguration(branch);
  const lines = [
    ...(draft.enquiryType
      ? [
          `${answerLabels.enquiryType}: Motchi ${draft.enquiryType === "websites" ? "Websites" : draft.enquiryType === "products" ? "Products" : "Consulting"}`,
        ]
      : []),
    ...(draft.enquiryType === "websites" && draft.websiteTier
      ? [`${answerLabels.websiteTier}: ${draft.websiteTier}`]
      : []),
    ...(draft.enquiryType === "products" && draft.productName
      ? [`${answerLabels.product}: ${draft.productName}`]
      : []),
    `${answerLabels.services}: ${draft.services.join(", ")}`,
    ...draft.services
      .filter((service) => draft.details[service]?.length)
      .map((service) => `${service}: ${draft.details[service].join(", ")}`),
    ...(draft.enquiryType === "products"
      ? []
      : [
          `${answerLabels.business}: ${draft.business}`,
          `${answerLabels.stage}: ${draft.stage}`,
          `${answerLabels.timeline}: ${draft.timeline}`,
          `${answerLabels.budget}: ${draft.budget || "Not provided"}`,
        ]),
    ...(draft.website && websiteInMessage
      ? [`${answerLabels.website}: ${draft.website}`]
      : []),
    ...(draft.phone && branch !== "products"
      ? [
          `${answerLabels.phone}: ${formatInternationalPhone(draft.phoneCountryCode, draft.phone)}`,
        ]
      : []),
    ...(draft.source && branch !== "products"
      ? [`${answerLabels.source}: ${draft.source}`]
      : []),
    ...(draft.context ? [`${answerLabels.details}:`, draft.context] : []),
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
  branch: Branch | "products",
  token: string,
  fax = "",
) {
  // The consolidated endpoint does not keep a separate website field, so the
  // address always travels as an answer line.
  const fields = contactSubmissionFields(draft, branch, token, fax, true);
  if (branch === "products") fields.set("interest", "Products");
  else if (branch !== "solutions") {
    const service = initialDraft(draft.services[0], "solutions").services[0];
    fields.set(
      "interest",
      getContactConfiguration("solutions").submissionInterests[service],
    );
  }
  return fields;
}
export async function sendContactEnquiry(
  draft: ContactDraft,
  branch: Branch | "products",
  token: string,
  fax = "",
  turnstileToken = "",
) {
  const body = consolidatedContactSubmissionFields(draft, branch, token, fax);
  body.set("cf-turnstile-response", turnstileToken);
  const response = await fetch("/api/contact", {
    method: "POST",
    body,
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
    retryMinutes: Number(result.searchParams.get("retry")) || undefined,
    reference: isReference(result.searchParams.get("ref"))
      ? (result.searchParams.get("ref") ?? undefined)
      : undefined,
  };
}
