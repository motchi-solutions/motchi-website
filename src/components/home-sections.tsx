import Image from "next/image";
import { LuBadgeCheck, LuLifeBuoy, LuMessagesSquare } from "react-icons/lu";
import { getProjects } from "@/content/websites/projects";
import {
  AnimatedLink,
  ButtonLink,
  Container,
  ProjectMedia,
} from "./ui/index.ts";
import styles from "./home-sections.module.css";

/* Homepage proof: real projects, shown simply, with one path to the full portfolio. */
export async function RecentWork() {
  const projects = (await getProjects())
    .filter((project) => project.featured)
    .slice(0, 2);
  return (
    <section id="work" className={styles.work} aria-labelledby="work-title">
      <Container>
        <header className={styles.heading}>
          <div>
            <h2 id="work-title">Recent Work</h2>
            <p>Real websites for real businesses.</p>
          </div>
          <ButtonLink href="/websites/work">View Our Portfolio</ButtonLink>
        </header>
        <div className={styles.projects}>
          {projects.map((project) => (
            <article key={project.id} className={styles.project}>
              {project.media.desktop && (
                <div className={styles.stage}>
                  <div className={styles.screen}>
                    <ProjectMedia
                      asset={project.media.desktop}
                      sizes="(max-width: 767px) 100vw, (max-width: 1536px) 45vw, 680px"
                    />
                  </div>
                </div>
              )}
              <div className={styles.identity}>
                {project.media.logo && (
                  <Image
                    src={project.media.logo.src}
                    alt=""
                    width={project.media.logo.width}
                    height={project.media.logo.height}
                    sizes="40px"
                    className={styles.logo}
                  />
                )}
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.industry}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

const promises = [
  {
    icon: LuBadgeCheck,
    title: "Clear pricing",
    text: "Know what's included and what it costs before work starts.",
  },
  {
    icon: LuMessagesSquare,
    title: "Plain language",
    text: "No technical brief needed. We explain your options simply.",
  },
  {
    icon: LuLifeBuoy,
    title: "Support after launch",
    text: "Updates, questions, and improvements as your business grows.",
  },
] as const;

/* Why Motchi: three promises in place of a generic process; each branch page
   keeps its own detailed process. */
export function WhyMotchi() {
  return (
    <section id="about" className={styles.why} aria-labelledby="why-title">
      <Container>
        <div className={styles.whyLayout}>
          <div className={styles.whyIntro}>
            <h2 id="why-title">Why Work With Motchi</h2>
            <p>
              We build technology around people, with clear pricing and support
              after launch.
            </p>
            <div className={styles.links}>
              <AnimatedLink href="/websites#process" arrow>
                How we build websites
              </AnimatedLink>
              <AnimatedLink href="/consulting#approach" arrow>
                How consulting projects work
              </AnimatedLink>
              <AnimatedLink href="/about" arrow>
                More about Motchi
              </AnimatedLink>
            </div>
          </div>
          <ul className={styles.promises}>
            {promises.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <span className={styles.icon} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
