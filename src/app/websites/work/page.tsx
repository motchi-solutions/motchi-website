import { branchHref } from "../../../lib/config/navigation.ts";
import {
  breadcrumbSchema,
  pageMetadata,
} from "../../../lib/config/metadata.ts";
import { JsonLd } from "../../../components/ui/json-ld.tsx";
import { ContactCTA } from "../../../components/ui/index.ts";
import { getProjects } from "../../../content/websites/projects.ts";
import { Portfolio } from "../../../components/websites/portfolio.tsx";

export const metadata = pageMetadata(
  "Our Portfolio",
  "Websites we've designed and built for real businesses across beauty, food, event catering, and professional services.",
  branchHref("websites", "/work"),
);
export default async function Page() {
  const projects = await getProjects();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Motchi Websites", path: "/websites" },
          { name: "Our Portfolio", path: "/websites/work" },
        ])}
      />
      <Portfolio projects={projects} />
      <ContactCTA
        href="/contact?branch=websites"
        action="Start a Project"
        title="Let's Plan Your Website"
      />
    </>
  );
}
