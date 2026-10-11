import {
  AnimatedLink,
  ButtonLink,
  Container,
  Eyebrow,
  SystemGraphic,
} from "@motchi/ui";
export function Hero() {
  return (
    <section className="py-hero">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Your Business Comes First</Eyebrow>
            <h1 className="text-display font-medium tracking-tight">
              Technology
              <br />
              Without The
              <br />
              <span className="font-display italic text-primary">
                Complexity.
              </span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted">
              We help businesses choose and build the technology they actually
              need. Websites, data, AI, and everyday tools, with support from
              the first conversation onward.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="#businesses">
                Find Your Starting Point
              </ButtonLink>
              <ButtonLink href="/contact" secondary>
                Talk to Us
              </ButtonLink>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
              <AnimatedLink href="#businesses" className="min-h-11">
                Websites & Consulting
              </AnimatedLink>
              <AnimatedLink href="#products" className="min-h-11">
                Products in Progress
              </AnimatedLink>
            </div>
          </div>
          <SystemGraphic />
        </div>
      </Container>
    </section>
  );
}
