import { ContactPageContent } from "../../components/ui/index.ts";
import { contactEntryFromParams } from "../../components/ui/contact/contact-entry.ts";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  await searchParams;
  return {
    title: "Contact",
    description:
      "Explore how Motchi can support your goals, from websites and software to everyday technology support.",
    alternates: { canonical: "/contact" },
    robots: { index: false, follow: false },
  };
}
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
