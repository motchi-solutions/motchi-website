import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA, PageHero } from "@motchi/ui";
import { Businesses } from "@/components/businesses";
export const metadata = pageMetadata(
  "Motchi Services",
  "Websites, technology advice, and implementation. Find the support your business needs, from the first conversation to ongoing care.",
  "/services",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Motchi Services"
        title="Websites and Technology Support"
      >
        Need a new website, clearer data, or less manual work? We help you
        choose the right approach and put it into practice, with support as your
        business grows.
      </PageHero>
      <Businesses />
      <ContactCTA />
    </>
  );
}
