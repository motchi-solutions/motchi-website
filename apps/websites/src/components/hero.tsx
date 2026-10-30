import { AnimatedLink, ButtonLink, Container, HeroBrand } from "@motchi/ui";
import { projects } from "@/content/projects";
export function Hero() {
  return (
    <section className="family-hero py-hero">
      <Container>
        <div className="section-layout grid lg:grid-cols-12 lg:items-end">
          <div className="family-hero-intro lg:col-span-8">
            <HeroBrand branch="websites" />
            <h1 className="text-display font-medium tracking-tight">
              Websites Built <br className="hidden lg:block" />
              Around <br className="hidden lg:block" />
              <span className="font-display italic text-primary">
                Your Business.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              Your business has its own identity. Your website should too. We
              design and build around your customers and budget, with
              maintenance options for support after launch.
            </p>
            <div className="family-hero-actions mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/work">Explore Our Work</ButtonLink>
              <ButtonLink href="/contact" secondary>
                Start a Project
              </ButtonLink>
            </div>
          </div>
          <div className="family-hero-secondary lg:col-span-4">
            <p className="mb-5 text-xs tracking-widest uppercase text-muted">
              A few businesses we've built for
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
