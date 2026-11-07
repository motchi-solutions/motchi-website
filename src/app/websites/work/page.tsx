import { branchHref } from "../../../lib/config/navigation.ts";
import { pageMetadata } from "../../../lib/config/metadata.ts";
import {
  AnimatedLink,
  ButtonLink,
  ContactCTA,
  Container,
} from "../../../components/ui/index.ts";
import { getProjects } from "../../../content/websites/projects.ts";
import { ProjectPreview } from "../../../components/websites/project-preview.tsx";
import { Work } from "../../../components/websites/work.tsx";
export const metadata = pageMetadata(
  "Our Work",
  "Selected website work across food, beauty, projects, and professional services. Each business deserves its own voice.",
  branchHref("websites", "/work"),
);
export default async function Page() {
  const projects = await getProjects();
  return (
    <>
      <section className="border-b border-border py-hero">
        <Container>
          <div className="section-layout grid items-center lg:grid-cols-2">
            <div className="section-introduction">
              <h1 className="text-h1 font-medium tracking-tight">
                Website Projects for Real Businesses
              </h1>
              <p className="mt-6 max-w-reading text-body-lg leading-relaxed text-muted">
                See how each website fits its business, brand, and customers.
                Explore the designs on desktop and mobile.
              </p>
              <div className="mt-7">
                <ButtonLink href="/websites#enquiry">
                  Start a Project
                </ButtonLink>
              </div>
            </div>
            <article id={`project-${projects[0].id}`} className="min-w-0">
              <ProjectPreview project={projects[0]} aboveFold />
              <p className="mt-4 text-small text-muted">
                {projects[0].industry}
              </p>
              <h2 className="mt-2 text-h3 font-medium">{projects[0].title}</h2>
              <p className="mt-2 max-w-lg leading-relaxed text-muted">
                {projects[0].description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-small text-primary">
                {projects[0].services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
              {projects[0].technologies && (
                <p className="mt-3 text-xs text-muted">
                  {projects[0].technologies.join(" / ")}
                </p>
              )}
              {!!projects[0].details?.length && (
                <details className="mt-5">
                  <summary className="inline-flex min-h-11 cursor-pointer items-center text-small text-primary">
                    Project Details
                  </summary>
                  <dl className="mt-4 space-y-4">
                    {projects[0].details.map((detail) => (
                      <div key={detail.heading}>
                        <dt className="font-medium">{detail.heading}</dt>
                        <dd className="mt-2 text-small leading-relaxed text-muted">
                          {detail.description}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </details>
              )}
              <div className="content-action flex flex-wrap items-center gap-4 empty:hidden">
                {projects[0].url && (
                  <ButtonLink href={projects[0].url} secondary>
                    Visit {projects[0].title}
                  </ButtonLink>
                )}
                {projects[0].caseStudyUrl && (
                  <AnimatedLink
                    href={projects[0].caseStudyUrl}
                    className="min-h-12 text-sm"
                  >
                    Read the Case Study
                  </AnimatedLink>
                )}
              </div>
            </article>
          </div>
        </Container>
      </section>
      <Work skipFirst />
      <ContactCTA
        href="/websites#enquiry"
        action="Start a Project"
        title="Let's Plan Your Website"
      />
    </>
  );
}
