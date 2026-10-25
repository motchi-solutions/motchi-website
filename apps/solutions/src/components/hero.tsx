import { ButtonLink, Container, HeroBrand, SystemGraphic } from "@motchi/ui";
export function Hero() {
  return (
    <section className="solutions-hero relative overflow-hidden border-b border-border py-hero">
      <Container className="relative">
        <div className="solutions-hero-layout grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="solutions-hero-intro">
            <HeroBrand branch="solutions" />
            <h1 className="text-display font-medium tracking-tight">
              Technology <br className="hidden lg:block" />
              Without the <br className="hidden lg:block" />
              <span className="font-display italic text-primary">
                Complexity.
              </span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted">
              We help you choose and build the technology your business needs.
              Websites, data, AI, and everyday tools, with support from the
              first conversation onward.
            </p>
            <div className="solutions-hero-actions mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/services">Explore Our Services</ButtonLink>
              <ButtonLink href="/contact" secondary>
                Contact Us
              </ButtonLink>
            </div>
          </div>
          <SystemGraphic />
        </div>
      </Container>
    </section>
  );
}
