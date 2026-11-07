import { logos } from "../lib/brand.ts";
import type { ReactNode } from "react";
import { organizationSchema } from "../lib/config/metadata.ts";
import { getSites } from "../lib/config/env.ts";

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
  };
  return (
    <div
      data-branch={branch}
      data-analytics-context={branch === "websites" ? "MW" : "MC"}
      className="bg-background"
    >
      {children}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted schema is serialized and less-than characters are escaped.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
