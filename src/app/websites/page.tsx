import { pageMetadata } from "../../lib/config/metadata.ts";
import { websiteSections } from "../../lib/config/navigation.ts";
import { ServiceEnquiry } from "../../components/ui/contact/service-enquiry.tsx";
import { SectionNavigation } from "../../components/ui/section-navigation.tsx";
import { Hero } from "../../components/websites/hero.tsx";
import { FeaturedWork } from "../../components/websites/featured-work.tsx";
import { Services } from "../../components/websites/services.tsx";
import { WebsiteOffer } from "../../components/websites/offer.tsx";
import { Process } from "../../components/websites/process.tsx";
import styles from "../../components/websites/landing.module.css";

export const metadata = pageMetadata(
  "Motchi Websites",
  "Website design, development, booking integrations, pricing, and ongoing maintenance shaped around your business.",
  "/websites",
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
      <ServiceEnquiry branch="websites" className={styles.enquirySection} />
    </>
  );
}
