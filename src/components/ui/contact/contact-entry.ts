import type { Branch } from "../../../lib/brand.ts";
import { getContactConfiguration } from "./contact-config.ts";
import { initialDraft, type ContactDraft } from "./contact-model.ts";

export type ContactEntry = { draft: ContactDraft; step: number };

// Only public service choices travel in links. Contact details never belong here.
export function contactEntryFromParams(
  params: URLSearchParams,
  branch: Branch,
  topic?: string,
): ContactEntry {
  const config = getContactConfiguration(branch);
  const draft = initialDraft(topic, branch);
  const selected = [...new Set(params.getAll("service"))].filter((service) =>
    config.services.includes(service),
  );
  if (selected.length) draft.services = selected;
  for (const service of draft.services) {
    const allowed = config.followUps[service] ?? [];
    const details = [...new Set(params.getAll(`detail.${service}`))].filter(
      (detail) => allowed.includes(detail),
    );
    if (details.length) draft.details[service] = details;
  }
  return {
    draft,
    step: params.get("continue") === "project" && selected.length ? 1 : 0,
  };
}

export function contactEntryHref(branch: Branch, draft: ContactDraft): string {
  const params = new URLSearchParams({ branch, continue: "project" });
  const { services, followUps } = getContactConfiguration(branch);
  for (const service of draft.services.filter((item) =>
    services.includes(item),
  )) {
    params.append("service", service);
    for (const detail of draft.details[service] ?? []) {
      if (followUps[service]?.includes(detail))
        params.append(`detail.${service}`, detail);
    }
  }
  return `/contact?${params}`;
}
