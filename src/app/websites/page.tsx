import { pageMetadata } from "../../lib/config/metadata.ts";
import { websiteStarter } from "../../lib/config/sites.ts";
import { websiteSections } from "../../lib/config/navigation.ts";
import { ServiceEnquiry } from "../../components/ui/contact/service-enquiry.tsx";
import { SectionNavigation } from "../../components/ui/section-navigation.tsx";
import { Hero } from "../../components/websites/hero.tsx";
import { FeaturedWork } from "../../components/websites/featured-work.tsx";
import { Services } from "../../components/websites/services.tsx";
import { WebsiteOffer } from "../../components/websites/offer.tsx";
import { Process } from "../../components/websites/process.tsx";
import { WebsiteFaq } from "../../components/websites/faq.tsx";

export const metadata = pageMetadata(
  "Website Design and Development in Toronto - Motchi Websites",
  `Websites shaped around your business and customers, from ${websiteStarter.price}. Booking, tool integrations, and maintenance after launch.`,
  "/websites",
  { absolute: true },
);
export default function Websites() {
  return (
    <>
      <Hero />
      <SectionNavigation items={websiteSections} />
      <FeaturedWork />
      <Services />
      <WebsiteOffer />
      <Process />
      <WebsiteFaq />
      <ServiceEnquiry branch="websites" />
    </>
  );
}
