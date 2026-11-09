import { pageMetadata } from "../../lib/config/metadata.ts";
import { consultingSections } from "../../lib/config/navigation.ts";
import { ServiceEnquiry } from "../../components/ui/contact/service-enquiry.tsx";
import { SectionNavigation } from "../../components/ui/section-navigation.tsx";
import { Hero } from "../../components/consulting/hero.tsx";
import { Capabilities } from "../../components/consulting/capabilities.tsx";
import { Approach } from "../../components/consulting/approach.tsx";
import { Commitments } from "../../components/consulting/commitments.tsx";
import { ConsultingFaq } from "../../components/consulting/faq.tsx";

export const metadata = pageMetadata(
  "Motchi Consulting",
  "AI, data, platforms, automation, and business systems consulting, with practical implementation and adoption support.",
  "/consulting",
);
export default function Consulting() {
  return (
    <>
      <Hero />
      <SectionNavigation items={consultingSections} />
      <Capabilities />
      <Approach />
      <Commitments />
      <ConsultingFaq />
      <ServiceEnquiry branch="consulting" />
    </>
  );
}
