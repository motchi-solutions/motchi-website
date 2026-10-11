import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA, PageHero } from "@motchi/ui";
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
        title="Different Businesses. Different Directions."
      >
        Selected website work across food, beauty, projects, and professional
        services. Each business deserves its own voice.
      </PageHero>
      <Work />
      <ContactCTA title="Let’s Discuss Your Website" />
    </>
  );
}
