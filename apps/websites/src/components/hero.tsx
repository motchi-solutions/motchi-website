import { AnimatedLink, ButtonLink, Container, Eyebrow } from "@motchi/ui";
import { projects } from "@/content/projects";
export function Hero() {
  return (
    <section className="py-hero">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow>Motchi Websites</Eyebrow>
            <h1 className="text-display font-medium tracking-tight">
              A Website That
              <br />
              Feels Like
              <br />
              <span className="font-display italic text-primary">
                Your Business.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              Your website should sound like you, make sense to your customers,
              and help them take the next step. We design and build around that.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/work">Explore Our Work</ButtonLink>
              <ButtonLink href="/contact" secondary>
                Discuss Your Website
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-4">
            <p className="mb-5 text-xs tracking-widest uppercase text-muted">
              Different businesses. Different directions.
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
