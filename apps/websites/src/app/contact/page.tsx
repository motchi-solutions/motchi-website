import { ContactPageContent } from "@motchi/ui";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
type Props = { searchParams: Promise<{ status?: string; fields?: string }> };
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { status } = await searchParams;
  return {
    title: "Contact",
    alternates: { canonical: "/contact" },
    robots: status ? { index: false, follow: true } : undefined,
  };
}
export default async function Contact({ searchParams }: Props) {
  const { status, fields } = await searchParams;
  return (
    <ContactPageContent branch="websites" status={status} fields={fields} />
  );
}
