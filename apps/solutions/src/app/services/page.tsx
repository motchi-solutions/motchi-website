import { ServicesExplorer } from "@/components/services-explorer";
import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA } from "@motchi/ui";
import { Businesses } from "@/components/businesses";
export const metadata = pageMetadata(
  "Services",
  "Websites, technology advice, and implementation. Find the support your business needs, from the first conversation to ongoing care.",
  "/services",
);
export default function Page() {
  return (
    <>
      <ServicesExplorer />
      <Businesses textured title="Websites and Technology Consulting" />
      <ContactCTA title="Let's Plan Your Next Step" />
    </>
  );
}
