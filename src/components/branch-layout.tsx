import { logos } from "../lib/brand.ts";
import type { ReactNode } from "react";
import { organizationSchema, serviceCatalog } from "../lib/config/metadata.ts";
import { getSites } from "../lib/config/env.ts";
import { capabilities } from "../content/consulting/capabilities.ts";
import { tiers } from "../content/websites/pricing.ts";
import { JsonLd } from "./ui/json-ld.tsx";

// The offers each branch's page describes, for its structured data.
const offers = {
  websites: tiers.map((tier) => ({
    name: tier.name,
    description: tier.description,
  })),
  consulting: capabilities.map((item) => ({
    name: item.title,
    description: item.description,
  })),
};

export function BranchLayout({
  branch,
  children,
}: {
  branch: "websites" | "consulting";
  children: ReactNode;
}) {
  const url = new URL(`/${branch}`, getSites().solutions.url).href;
  const schema = {
    ...organizationSchema(branch),
    "@id": `${url}/#organization`,
    url,
    ...(logos[branch]
      ? { logo: new URL(logos[branch].src, getSites().solutions.url).href }
      : {}),
    hasOfferCatalog: serviceCatalog(branch, offers[branch]),
  };
  return (
    <div
      data-branch={branch}
      data-analytics-context={branch === "websites" ? "MW" : "MC"}
      className="bg-background"
    >
      {children}
      <JsonLd data={schema} />
    </div>
  );
}
