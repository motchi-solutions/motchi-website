import { branchHref } from "../../../lib/config/navigation.ts";
import { pageMetadata } from "../../../lib/config/metadata.ts";
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
      <Portfolio projects={projects} />
      <ContactCTA
        href="/websites#enquiry"
        action="Start a Project"
        title="Let's Plan Your Website"
      />
    </>
  );
}
