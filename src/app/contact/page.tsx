import { ContactPageContent } from "../../components/ui/index.ts";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
type Props = {
  searchParams: Promise<{ status?: string; fields?: string; topic?: string }>;
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
  const { status, fields, topic } = await searchParams;
  return (
    <ContactPageContent
      branch="solutions"
      status={status}
      fields={fields}
      topic={topic}
    />
  );
}
