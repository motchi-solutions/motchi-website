import { getProjects } from "../../content/websites/projects.ts";
import {
  AnimatedLink,
  ButtonLink,
  Container,
  ProjectMedia,
} from "../ui/index.ts";
import styles from "./landing.module.css";

export async function FeaturedWork() {
  const allProjects = await getProjects();
  const projects = allProjects
    .filter((project) => project.featured)
    .slice(0, 2);
  return (
    <section id="work" className={styles.work}>
      <Container>
        <header className={styles.workHeading}>
          <div className="min-w-0">
            <h2>Our Highlights</h2>
            <p className="mt-4 max-w-xl text-body leading-relaxed text-muted">
              Different businesses. Websites built around the way they work.
            </p>
          </div>
          <ButtonLink href="/websites/work">View All Projects</ButtonLink>
        </header>
        <div className={styles.projects}>
          {projects.map((project) => (
            <article
              key={project.id}
              id={`project-${project.id}`}
              className={styles.project}
            >
              <div className={styles.projectImage}>
                {project.media.desktop && (
                  <div className={styles.desktopPreview}>
                    <ProjectMedia
                      asset={project.media.desktop}
                      sizes="(max-width: 767px) 100vw, (max-width: 1536px) 45vw, 680px"
                    />
                  </div>
                )}
                {project.media.mobile && (
                  <div className={styles.mobilePreview} aria-hidden="true">
                    <ProjectMedia
                      asset={{ ...project.media.mobile, alt: "" }}
                      sizes="(max-width: 767px) 1px, 160px"
                    />
                  </div>
                )}
              </div>
              <div className={styles.projectCopy}>
                <div className={styles.projectIdentity}>
                  <div className="min-w-0">
                    <h3>{project.title}</h3>
                    <p className={styles.projectIndustry}>{project.industry}</p>
                  </div>
                  {project.url ? (
                    <ButtonLink
                      href={project.url}
                      target="_blank"
                      secondary
                      className={styles.visitSite}
                    >
                      Visit Site
                      <span className="sr-only">
                        , {project.title} (opens in a new tab)
                      </span>
                    </ButtonLink>
                  ) : (
                    <AnimatedLink
                      href={`/websites/work#project-${project.id}`}
                      arrow
                      className={styles.textLink}
                    >
                      Explore the Project
                    </AnimatedLink>
                  )}
                </div>
                <p className={styles.projectDescription}>
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
