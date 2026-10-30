import { pageMetadata } from "@motchi/config/metadata";
import { ButtonLink, ContactCTA, PageHero } from "@motchi/ui";
import { Work } from "@/components/work";
export const metadata = pageMetadata(
  "Our Work",
  "Selected website work across food, beauty, projects, and professional services. Each business deserves its own voice.",
  "/work",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Website Projects for Real Businesses"
        actions={<ButtonLink href="/contact">Start a Project</ButtonLink>}
      >
        See how each website fits its business, brand, and customers. Explore
        the designs on desktop and mobile.
      </PageHero>
      <Work />
      <ContactCTA action="Start a Project" title="Let's Plan Your Website" />
    </>
  );
}
