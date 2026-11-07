import { isContactName, isEmail } from "../../../lib/config/validation.ts";
import {
  isPhoneCallingCode,
  splitInternationalPhone,
} from "./contact-phone.ts";
import type { Branch } from "../../../lib/brand.ts";
import { contactContextLimit } from "../../../lib/config/validation.ts";
import { getContactConfiguration } from "./contact-config.ts";
export {
  services,
  serviceDescriptions,
  followUps,
  questions,
} from "./contact-config.ts";
export type ContactDraft = {
  services: string[];
  details: Record<string, string[]>;
  business: string;
  stage: string;
  budget: string;
  timeline: string;
  source: string;
  name: string;
  email: string;
  organization: string;
  website: string;
  phone: string;
  phoneCountryCode: string;
  context: string;
};
export type ContactErrors = Partial<Record<keyof ContactDraft, string>>;
export function initialDraft(
  topic?: string,
  branch: Branch = "solutions",
): ContactDraft {
  const { services, topicAliases: aliases } = getContactConfiguration(branch);
  const service = topic ? (aliases[topic] ?? topic) : "";
  return {
    services: services.includes(service) ? [service] : [],
    details: {},
    business: "",
    stage: "",
    budget: "",
    timeline: "",
    source: "",
    name: "",
    email: "",
    organization: "",
    website: "",
    phone: "",
    phoneCountryCode: "",
    context: "",
  };
}
export function validateContact(
  draft: ContactDraft,
  step: number,
): ContactErrors {
  const errors: ContactErrors = {};
  if (step === 0 && !draft.services.length)
    errors.services = "Please select a service, or choose Not Sure Yet.";
  if (step === 1) {
    if (!draft.business)
      errors.business =
        "Please choose what best describes your project or organization.";
    if (!draft.stage)
      errors.stage = "Please choose your project's current stage.";
    if (!draft.timeline)
      errors.timeline =
        "Please choose a starting time, or choose Flexible / just exploring.";
  }
  if (step === 2) {
    if (draft.context.length > contactContextLimit)
      errors.context = "Please use 2,000 characters or fewer.";
    if (!isContactName(draft.name)) errors.name = "Please enter a valid name.";
    if (!isEmail(draft.email.trim()))
      errors.email = draft.email.trim()
        ? "Please enter a valid email address."
        : "Please enter your email address.";
    if (draft.phone || draft.phoneCountryCode) {
      if (!isPhoneCallingCode(draft.phoneCountryCode))
        errors.phoneCountryCode = "Please enter a valid country code.";
      if (!/^[0-9]{1,12}$/.test(draft.phone))
        errors.phone = "Please enter a valid phone number.";
    }
    if (draft.website.trim()) {
      try {
        const url = new URL(draft.website);
        if (
          !["http:", "https:"].includes(url.protocol) ||
          url.username ||
          url.password
        )
          throw new Error();
      } catch {
        errors.website =
          "Please enter a full website address, such as https://example.com.";
      }
    }
  }
  return errors;
}

export function getContactDraftKey(branch: Branch = "solutions") {
  return `motchi:${branch}:contact-draft:v1`;
}
export const contactDraftKey = getContactDraftKey();
export const contactDraftLifetime = 3 * 24 * 60 * 60 * 1000;
export type SavedContactDraft = {
  version: 1;
  branch?: Branch;
  updatedAt: number;
  step: number;
  draft: ContactDraft;
};
export function hasContactProgress(draft: ContactDraft) {
  return (
    draft.services.length > 0 ||
    Object.entries(draft).some(
      ([key, value]) =>
        key !== "services" &&
        key !== "details" &&
        typeof value === "string" &&
        value.length > 0,
    )
  );
}
export function canVisitContactStep(
  draft: ContactDraft,
  current: number,
  target: number,
) {
  return (
    target <= current ||
    Array.from({ length: target }, (_, index) =>
      validateContact(draft, index),
    ).every((errors) => Object.keys(errors).length === 0)
  );
}
// Storage is untrusted: restore only this schema and known choices.
export function parseContactDraft(
  raw: string | null,
  now = Date.now(),
  branch: Branch = "solutions",
): SavedContactDraft | null {
  const { services, followUps, questions } = getContactConfiguration(branch);
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    if (
      saved?.version !== 1 ||
      (saved.branch !== undefined && saved.branch !== branch) ||
      (saved.branch === undefined && branch !== "solutions") ||
      !Number.isFinite(saved.updatedAt) ||
      saved.updatedAt > now ||
      now - saved.updatedAt >= contactDraftLifetime ||
      !Number.isInteger(saved.step) ||
      saved.step < 0 ||
      saved.step > 3
    )
      return null;
    const source = saved.draft;
    if (
      !source ||
      typeof source !== "object" ||
      !Array.isArray(source.services) ||
      !source.services.every(
        (value: unknown) =>
          typeof value === "string" &&
          services.includes(value === "AI" ? "AI Adoption" : value),
      ) ||
      source.services.length > services.length
    )
      return null;
    const draft = initialDraft(undefined, branch);
    draft.services = [
      ...new Set<string>(
        source.services.map((service: string) =>
          service === "AI" ? "AI Adoption" : service,
        ),
      ),
    ];
    for (const key of [
      "business",
      "stage",
      "budget",
      "timeline",
      "source",
      "name",
      "email",
      "organization",
      "website",
      "phone",
      "context",
    ] as const) {
      const limit = key === "email" || key === "website" ? 254 : 150;
      if (
        typeof source[key] !== "string" ||
        (key !== "context" && source[key].length > limit)
      )
        return null;
      if (key === "stage") {
        const previousStages: Record<string, string> = {
          "I know what I need": "I know where to start",
          "I know what needs to be done": "I know where to start",
          "I already have something that needs improvement":
            "I want to improve an existing process",
        };
        if (previousStages[source[key]]) {
          draft.stage = previousStages[source[key]];
          continue;
        }
      }
      // Keep older drafts; ask for a new budget choice rather than guessing a bracket.
      if (key === "budget" && source[key] === "Under $1,000") continue;
      if (
        key in questions &&
        source[key] &&
        !questions[key as keyof typeof questions].options.includes(source[key])
      )
        return null;
      draft[key] = source[key];
    }
    if (
      !source.details ||
      typeof source.details !== "object" ||
      Array.isArray(source.details)
    )
      return null;
    const previousDataChoices: Record<string, string> = {
      "Bring data together": "Connect data from different tools",
      "Keep data up to date": "Automate data updates",
      "Understand my data": "Find trends or answer specific questions",
    };
    for (const service of services) {
      const storedValues =
        source.details[service] ??
        (service === "AI Adoption" ? source.details.AI : undefined);
      const values =
        service === "Data & Analytics" && Array.isArray(storedValues)
          ? storedValues.map((value: unknown) =>
              typeof value === "string"
                ? (previousDataChoices[value] ?? value)
                : value,
            )
          : storedValues;
      if (values === undefined) continue;
      if (
        !Array.isArray(values) ||
        !followUps[service] ||
        values.length > followUps[service].length ||
        !values.every(
          (value: unknown) =>
            typeof value === "string" && followUps[service].includes(value),
        )
      )
        return null;
      draft.details[service] = [...new Set<string>(values)];
    }
    if (source.phoneCountryCode !== undefined) {
      if (
        typeof source.phoneCountryCode !== "string" ||
        source.phoneCountryCode.length > 3 ||
        !/^[0-9]*$/.test(source.phoneCountryCode)
      )
        return null;
      draft.phoneCountryCode = source.phoneCountryCode;
    } else if (draft.phone) {
      const previous = splitInternationalPhone(`+${draft.phone}`);
      if (previous) {
        draft.phoneCountryCode = previous.countryCode;
        draft.phone = previous.number;
      }
    }
    if (!hasContactProgress(draft)) return null;
    const firstIncomplete =
      [0, 1, 2].find(
        (index) => Object.keys(validateContact(draft, index)).length > 0,
      ) ?? 3;
    return {
      version: 1,
      branch,
      updatedAt: saved.updatedAt,
      step: Math.min(saved.step, firstIncomplete),
      draft,
    };
  } catch {
    return null;
  }
}
