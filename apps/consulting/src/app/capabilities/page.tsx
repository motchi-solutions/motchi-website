import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA, PageHero } from "@motchi/ui";
import { Capabilities } from "@/components/capabilities";
export const metadata = pageMetadata(
  "Our Capabilities",
  "Practical support across AI, Databricks, data, digital systems, strategy, and adoption. Start with the problem; we will work through the options together.",
  "/capabilities",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Our Capabilities"
        title="Choose Technology Around the Work"
      >
        Practical support across AI, Databricks, data, digital systems,
        strategy, and adoption. Start with the problem; we will work through the
        options together.
      </PageHero>
      <Capabilities />
      <ContactCTA title="Start with Your Business" />
    </>
  );
}
