import { pageMetadata } from "../../lib/config/metadata.ts";
import { websiteSections } from "../../lib/config/navigation.ts";
import { ContactCTA } from "../../components/ui/index.ts";
import { SectionNavigation } from "../../components/ui/section-navigation.tsx";
import { Hero } from "../../components/websites/hero.tsx";
import { Work } from "../../components/websites/work.tsx";
import { Services } from "../../components/websites/services.tsx";
import { WebsiteOffer } from "../../components/websites/offer.tsx";
import { Process } from "../../components/websites/process.tsx";
import { WebsiteResponsibilities } from "../../components/websites/responsibilities.tsx";
import { WebsiteAbout } from "../../components/websites/about.tsx";

export const metadata = pageMetadata(
  "Motchi Websites",
  "Website design, development, booking integrations, pricing, and ongoing care shaped around your business.",
  "/websites",
);
export default function Websites() {
  return (
    <>
      <Hero />
      <SectionNavigation items={websiteSections} />
      <Work featuredOnly />
      <Services />
      <WebsiteOffer />
      <Process />
      <WebsiteResponsibilities />
      <WebsiteAbout />
      <div id="enquiry">
        <ContactCTA
          href="/contact?topic=Website"
          action="Start a Project"
          title="Let's Plan Your Website"
        />
      </div>
    </>
  );
}
