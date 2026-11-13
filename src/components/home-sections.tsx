import Image from "next/image";
import { LuBadgeCheck, LuLifeBuoy, LuMessagesSquare } from "react-icons/lu";
import { getProjects } from "@/content/websites/projects";
import {
  AnimatedLink,
  ButtonLink,
  Container,
  ProjectMedia,
} from "./ui/index.ts";
import { SiteLink } from "./ui/site-link.tsx";
import styles from "./home-sections.module.css";

/* "Trusted by" banner under the hero: every portfolio client's real logo and
   name. Only list businesses we have actually built for. Static rather than a
   scrolling marquee: four logos fit at every width, and nothing moves. */
export async function ClientLogos() {
  const projects = (await getProjects()).filter(
    (project) => project.media.logo,
  );
  if (!projects.length) return null;

  return (
    <section
      aria-labelledby="clients-title"
      className="border-y border-border bg-surface py-[clamp(2rem,4vw,3rem)]"
    >
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2
          id="clients-title"
          className="text-eyebrow font-semibold tracking-widest text-muted uppercase"
        >
          Trusted by growing businesses
        </h2>
        <ul className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] justify-items-start gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-12 lg:gap-x-16">
          {projects.map((project) => {
            const logo = project.media.logo;
            return (
              logo && (
                <li key={project.id}>
                  {/* Each logo opens its project in the portfolio, so the
                      proof is one step away. */}
                  <SiteLink
                    href={`/websites/work#project-${project.id}`}
                    className="group flex min-h-16 cursor-pointer items-center gap-3 rounded-full pe-3"
                  >
                    {/* Padding keeps square and wordmark logos inside the
                      circle, with safe space on every side. */}
                    <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-white p-3 transition-colors duration-(--motion-hover) ease-(--ease-hover) group-hover:border-(--active) group-active:border-(--active) group-active:duration-100 motion-reduce:transition-none">
                      <Image
                        src={logo.src}
                        alt=""
                        width={logo.width}
                        height={logo.height}
                        sizes="40px"
                        className="size-full object-contain"
                      />
                    </span>
                    <span className="text-left text-small font-semibold leading-tight text-foreground transition-colors duration-(--motion-hover) ease-(--ease-hover) group-hover:text-(--active) group-active:text-(--active) motion-reduce:transition-none">
                      {project.title}
                      <span className="sr-only">, see the project</span>
                    </span>
                  </SiteLink>
                </li>
              )
            );
          })}
        </ul>
        <AnimatedLink
          href="/websites/work"
          arrow
          className="min-h-11 text-small font-semibold text-primary"
        >
          See our work
        </AnimatedLink>
      </Container>
    </section>
  );
}

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
