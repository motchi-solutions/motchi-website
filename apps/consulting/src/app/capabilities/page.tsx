import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA, PageHero } from "@motchi/ui";
import { Capabilities } from "@/components/capabilities";
export const metadata = pageMetadata(
  "Consulting Services",
  "Practical support across AI, Databricks, data, digital systems, strategy, and adoption. Start with the problem; we will work through the options together.",
  "/capabilities",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Consulting Services"
        title="AI, Data, and Technology Consulting"
      >
        Need better reporting, connected systems, or help choosing where to use
        AI? We help you compare the options, build the solution, and support
        your team as they start using it.
      </PageHero>
      <Capabilities />
      <ContactCTA title="Tell Us What You Need Help With" />
    </>
  );
}
