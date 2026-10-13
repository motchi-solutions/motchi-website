import {
  AnimatedLink,
  ButtonLink,
  Eyebrow,
  Reveal,
  Section,
  SectionHeading,
} from "@motchi/ui";
import { projects } from "@/content/projects";
import { ProjectPreview } from "./project-preview";
export function Work({ featuredOnly = false }: { featuredOnly?: boolean }) {
  return (
    <Section id="work">
      <SectionHeading
        eyebrow="Selected Website Work"
        title="Websites for Different Businesses"
      >
        Food, beauty, project work, and professional services. Each needs its
        own voice and its own customer journey.
      </SectionHeading>
      <div className="space-y-16 lg:space-y-24">
        {(featuredOnly
          ? projects.filter((project) => project.featured)
          : projects
        ).map((project, index) => (
          <Reveal key={project.id}>
            <article
              id={`project-${project.id}`}
              className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <div
                className={`min-w-0 lg:col-span-7 ${index % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <ProjectPreview project={project} />
              </div>
              <div
                className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-1" : ""}`}
              >
                <Eyebrow>
                  {String(index + 1).padStart(2, "0")} / {project.industry}
                </Eyebrow>
                <h3 className="text-3xl font-medium tracking-tight sm:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-5 max-w-md leading-relaxed text-muted">
                  {project.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-primary">
                  {project.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
                {!featuredOnly && project.technologies && (
                  <p className="mt-3 text-xs text-muted">
                    {project.technologies.join(" · ")}
                  </p>
                )}
                {!featuredOnly && !!project.details?.length && (
                  <details className="mt-5">
                    <summary className="inline-flex min-h-11 cursor-pointer items-center text-small text-primary">
                      Project Details
                    </summary>
                    <dl className="mt-4 space-y-4">
                      {project.details.map((detail) => (
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
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  {project.url && (
                    <ButtonLink href={project.url} secondary>
                      Visit {project.title}
                    </ButtonLink>
                  )}
                  {project.caseStudyUrl && (
                    <AnimatedLink
                      href={project.caseStudyUrl}
                      className="min-h-12 text-sm"
                    >
                      Read the Case Study
                    </AnimatedLink>
                  )}
                  {!project.url && (
                    <p className="text-xs text-muted">
                      Approved screenshots and project link to follow.
                    </p>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      {featuredOnly && (
        <AnimatedLink
          href="/work"
          arrow
          className="mt-10 min-h-12 text-primary"
        >
          View All Projects
        </AnimatedLink>
      )}
    </Section>
  );
}
