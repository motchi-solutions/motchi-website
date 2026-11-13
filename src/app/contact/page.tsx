import { ContactPageContent } from "../../components/ui/index.ts";
import { contactEntryFromParams } from "../../components/ui/contact/contact-entry.ts";
import { pageMetadata } from "../../lib/config/metadata.ts";
export const dynamic = "force-dynamic";
type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
// Prefilled links (?branch=, ?service=) all share the one canonical page.
export const metadata = pageMetadata(
  "Contact",
  "Tell us about your website or technology project. Your first 30-minute call is free, and we usually reply within 2-3 business days.",
  "/contact",
);
export default async function Contact({ searchParams }: Props) {
  const values = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    for (const item of Array.isArray(value) ? value : value ? [value] : [])
      params.append(key, item);
  }
  const branch = ["websites", "consulting"].includes(params.get("branch") ?? "")
    ? (params.get("branch") as "websites" | "consulting")
    : "solutions";
  const status = params.get("status") ?? undefined;
  const fields = params.get("fields") ?? undefined;
  const topic = params.get("topic") ?? undefined;
  const entry = contactEntryFromParams(params, branch, topic);
  return (
    <ContactPageContent
      branch={branch}
      entry={entry}
      status={status}
      fields={fields}
      topic={topic}
    />
  );
}
