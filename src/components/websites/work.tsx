import { branchHref } from "../../lib/config/navigation.ts";
import Image from "next/image";
import {
  AnimatedLink,
  ButtonLink,
  Eyebrow,
  Reveal,
  Section,
  SectionHeading,
} from "../ui/index.ts";
import { getProjects } from "../../content/websites/projects.ts";
import { ProjectPreview } from "./project-preview.tsx";
export async function Work({
  featuredOnly = false,
  skipFirst = false,
}: {
  featuredOnly?: boolean;
  skipFirst?: boolean;
}) {
  const projects = await getProjects();
  return (
    <Section id="work">
      <SectionHeading
        title={
          featuredOnly ? "Recent Website Projects" : "More Website Projects"
        }
      >
        Food, beauty, event catering, and professional services. Each needs its
        own voice and its own customer journey.
      </SectionHeading>
      <div className="project-list">
        {(featuredOnly
          ? projects.filter((project) => project.featured).slice(0, 2)
          : skipFirst
            ? projects.slice(1)
            : projects
        ).map((project, index) => (
          <Reveal key={project.id}>
            <article
              id={`project-${project.id}`}
              className="section-layout grid items-center lg:grid-cols-12"
            >
              <div
                className={`min-w-0 lg:col-span-8 ${index % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <ProjectPreview project={project} />
              </div>
              <div
                className={`project-description lg:col-span-4 ${index % 2 === 1 ? "lg:order-1" : ""}`}
              >
                <Eyebrow>{project.industry}</Eyebrow>
                {project.media.logo && (
                  <Image
                    loading="lazy"
                    src={project.media.logo.src}
                    alt=""
                    width={project.media.logo.width}
                    height={project.media.logo.height}
                    sizes="48px"
                    className="mb-4 h-12 w-12 object-contain"
                  />
                )}
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
                <div className="content-action flex flex-wrap items-center gap-4 empty:hidden">
                  {project.url && (
                    <ButtonLink
                      href={project.url}
                      secondary
                      target="_blank"
                      aria-label={`Visit ${project.title} (opens in a new tab)`}
                    >
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
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      {featuredOnly && (
        <AnimatedLink
          href={branchHref("websites", "/work")}
          arrow
          className="section-action min-h-12 text-primary"
        >
          View All Projects
        </AnimatedLink>
      )}
    </Section>
  );
}
