import Image from "next/image";
import { LuArrowLeft, LuCheck } from "react-icons/lu";
import { ButtonLink, Container, Reveal } from "../ui/index.ts";
import { SiteLink } from "../ui/site-link.tsx";
import type { Project } from "../../content/websites/projects.ts";
import { ProjectPreview } from "./project-preview.tsx";
import styles from "./portfolio.module.css";

const number = (index: number) => String(index + 1).padStart(2, "0");

/* Portfolio: a short header with a project index, then one showcase per
   project. The work carries the page; copy stays to a line or two. */
export function Portfolio({ projects }: { projects: Project[] }) {
  return (
    <>
      <section className={styles.header} aria-labelledby="portfolio-title">
        <Container>
          <SiteLink
            href="/websites"
            className={`animated-link ${styles.back}`}
            data-underline="hover"
          >
            <LuArrowLeft
              aria-hidden="true"
              focusable="false"
              data-direction="left"
              className="interaction-arrow h-4 w-4 shrink-0"
            />
            <span>Back to Websites</span>
          </SiteLink>
          <div className={styles.intro}>
            <div>
              <h1 id="portfolio-title">Our Portfolio</h1>
              <p>
                Websites we've designed and built for real businesses, each with
                its own voice.
              </p>
            </div>
            <nav aria-label="Projects" className={styles.index}>
              <ol>
                {projects.map((project, index) => (
                  <li key={project.id}>
                    <a href={`#project-${project.id}`}>
                      <span className="numeral" aria-hidden="true">
                        {number(index)}
                      </span>
                      {project.media.logo && (
                        <Image
                          src={project.media.logo.src}
                          alt=""
                          width={project.media.logo.width}
                          height={project.media.logo.height}
                          sizes="32px"
                          className={styles.indexLogo}
                        />
                      )}
                      {project.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </Container>
      </section>
      <div className={styles.projects}>
        {projects.map((project, index) => (
          <section
            key={project.id}
            id={`project-${project.id}`}
            className={styles.project}
            aria-labelledby={`project-${project.id}-title`}
            data-flip={index % 2 === 1}
          >
            <Container>
              <Reveal>
                <div className={styles.showcase}>
                  <div className={styles.stage}>
                    <ProjectPreview project={project} aboveFold={index === 0} />
                  </div>
                  <div className={styles.copy}>
                    <p
                      className={`${styles.number} numeral`}
                      aria-hidden="true"
                    >
                      {number(index)}
                    </p>
                    <div className={styles.identity}>
                      {project.media.logo && (
                        <Image
                          src={project.media.logo.src}
                          alt=""
                          width={project.media.logo.width}
                          height={project.media.logo.height}
                          sizes="48px"
                          loading={index === 0 ? "eager" : "lazy"}
                          className={styles.logo}
                        />
                      )}
                      <div>
                        <h2 id={`project-${project.id}-title`}>
                          {project.title}
                        </h2>
                        <p className={styles.industry}>{project.industry}</p>
                      </div>
                    </div>
                    <p className={styles.description}>{project.description}</p>
                    <h3 className={styles.highlightsTitle}>Highlights</h3>
                    <ul className={styles.highlights}>
                      {project.services.map((item) => (
                        <li key={item}>
                          <LuCheck aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {project.url && (
                      <div className={styles.actions}>
                        <ButtonLink href={project.url} target="_blank">
                          Visit Site
                          <span className="sr-only">
                            , {project.title} (opens in a new tab)
                          </span>
                        </ButtonLink>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </Container>
          </section>
        ))}
      </div>
    </>
  );
}
