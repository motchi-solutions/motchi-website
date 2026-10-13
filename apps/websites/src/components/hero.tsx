import { AnimatedLink, ButtonLink, Container, Eyebrow } from "@motchi/ui";
import { projects } from "@/content/projects";
export function Hero() {
  return (
    <section className="family-hero py-hero">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="family-hero-intro lg:col-span-8">
            <Eyebrow>MOTCHI WEBSITES</Eyebrow>
            <h1 className="text-display font-medium tracking-tight">
              A Website That <br className="hidden lg:block" />
              Feels Like <br className="hidden lg:block" />
              <span className="font-display italic text-primary">
                Your Business.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              Give customers a clear picture of your business and an easy way to
              enquire, book, or buy. We design and build a website that reflects
              your identity and supports those goals.
            </p>
            <div className="family-hero-actions mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/work">Explore Our Work</ButtonLink>
              <ButtonLink href="/contact" secondary>
                Discuss Your Website
              </ButtonLink>
            </div>
          </div>
          <div className="family-hero-secondary lg:col-span-4">
            <p className="mb-5 text-xs tracking-widest uppercase text-muted">
              Explore Our Website Projects
            </p>
            <ul className="grid grid-cols-2 gap-x-5 lg:block">
              {projects.map((project) => (
                <li key={project.id} className="border-t border-border">
                  <AnimatedLink
                    href={`/work#project-${project.id}`}
                    arrow
                    className="flex min-h-16 w-full justify-between text-lg"
                  >
                    {project.title}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
