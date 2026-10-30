import { pageMetadata } from "@motchi/config/metadata";
import { ButtonLink, ContactCTA, PageHero } from "@motchi/ui";
import { Capabilities } from "@/components/capabilities";
export const metadata = pageMetadata(
  "Capabilities",
  "Practical support across AI, Databricks, data, digital systems, strategy, and adoption. Start with the problem; we will work through the options together.",
  "/capabilities",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Consulting Capabilities"
        title="Technology Consulting for Your Business"

        actions={<ButtonLink href="/contact">Start a Conversation</ButtonLink>}
      >
        Explore practical support with AI, data, platforms, automation, and
        business systems, from choosing an approach to putting it into practice.
      </PageHero>
      <Capabilities />
      <ContactCTA
        action="Start a Conversation"
        title="Let's Plan Your Next Step"
      />
    </>
  );
}
