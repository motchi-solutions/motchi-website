import { ButtonLink, Container, HeroBrand } from "@motchi/ui";
export function Hero() {
  return (
    <section className="family-hero relative overflow-hidden bg-primary py-hero text-inverse">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="family-hero-intro relative lg:col-span-8">
            <HeroBrand branch="consulting" light />
            <h1 className="text-display font-medium tracking-tight">
              Technology Advice. <br className="hidden lg:block" />
              <span className="font-display italic text-accent">
                Hands-On Support.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-inverse/80">
              Practical technology consulting and hands-on implementation for
              AI, data, and business systems. We start with what your team
              needs, then help put the right solution to work.
            </p>
            <div className="family-hero-actions mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/contact" light>
                Discuss Your Project
              </ButtonLink>
              <ButtonLink href="/capabilities" light secondary>
                Explore Our Services
              </ButtonLink>
            </div>
          </div>
          <aside className="family-hero-secondary border-l border-accent/40 pl-6 lg:col-span-4">
            <p className="text-xs tracking-widest uppercase text-accent">
              The question comes first
            </p>
            <p className="mt-5 text-2xl leading-snug sm:text-3xl">
              What is getting
              <br className="hidden lg:block" /> in the way of{" "}
              <br className="hidden lg:block" />
              <span className="font-display italic">doing the work?</span>
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-inverse/75">
              A slow process. An unclear platform decision. Data you can't
              depend on. Let's start there.
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
