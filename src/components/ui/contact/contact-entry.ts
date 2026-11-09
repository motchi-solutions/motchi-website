import type { Branch } from "../../../lib/brand.ts";
import {
  websiteTiers,
  normalizeWebsiteTier,
  productNames,
  getContactConfiguration,
} from "./contact-config.ts";
import { initialDraft, type ContactDraft } from "./contact-model.ts";

export type ContactEntry = { draft: ContactDraft; step: number };

// Only public service choices travel in links. Contact details never belong here.
export function contactEntryFromParams(
  params: URLSearchParams,
  branch: Branch,
  topic?: string,
): ContactEntry {
  const productEnquiry =
    params.get("enquiry") === "products" || topic === "Products";
  const config = getContactConfiguration(productEnquiry ? "products" : branch);
  const draft = initialDraft(topic, branch);
  if (productEnquiry) {
    draft.enquiryType = "products";
    draft.services = [];
  }
  const requestedTier = params.get("tier");
  const tier = requestedTier && normalizeWebsiteTier(requestedTier);
  if (branch === "websites" && tier && websiteTiers.includes(tier))
    draft.websiteTier = tier;
  const product = params.get("product");
  if (productEnquiry && product && productNames.includes(product))
    draft.productName = product;
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
    step:
      !productEnquiry && params.get("continue") === "project" && selected.length
        ? 1
        : 0,
  };
}

export function contactEntryHref(branch: Branch, draft: ContactDraft): string {
  const params = new URLSearchParams({ branch, continue: "project" });
  if (branch === "websites" && draft.websiteTier)
    params.set("tier", draft.websiteTier);
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
