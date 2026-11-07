import Image from "next/image";
import { ButtonLink, Container, HeroBrand } from "../ui/index.ts";
import { getProjects } from "../../content/websites/projects.ts";
import styles from "./hero.module.css";

export async function Hero() {
  const projects = await getProjects();
  return (
    <section id="overview" className={styles.hero}>
      <Container>
        <div className={styles.composition}>
          <div className={styles.introduction}>
            <HeroBrand branch="websites" className={styles.brand} />
            <h1>
              Websites Built Around{" "}
              <span className={styles.accent}>Your Business.</span>
            </h1>
            <p className={styles.copy}>
              Your business has its own identity. Your website should too. We
              design and build around your customers and budget, with
              maintenance options for support after launch.
            </p>
            <div className={styles.actions}>
              <ButtonLink href="#work">Explore Our Work</ButtonLink>
              <ButtonLink href="#enquiry" secondary>
                Start a Project
              </ButtonLink>
            </div>
          </div>
          <figure className={styles.collage}>
            <figcaption className="sr-only">
              Selected Motchi website projects
            </figcaption>
            {projects.map((project, index) => {
              const asset =
                index === 1 ? project.media.mobile : project.media.desktop;
              return (
                asset && (
                  <a
                    key={project.id}
                    href={`/websites/work#project-${project.id}`}
                    className={styles.project}
                    aria-label={`Explore ${project.title}`}
                  >
                    <Image
                      src={asset.src}
                      alt={asset.alt}
                      width={asset.width}
                      height={asset.height}
                      sizes="(max-width: 767px) 60vw, (max-width: 1023px) 45vw, 34vw"
                      loading="eager"
                    />
                    <span>{project.title}</span>
                  </a>
                )
              );
            })}
          </figure>
        </div>
      </Container>
    </section>
  );
}
