import { ButtonLink, Container, Eyebrow, SystemGraphic } from "@motchi/ui";
export function Hero() {
  return (
    <section className="py-section">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Practical technology. Lasting support.</Eyebrow>
            <h1 className="text-hero font-medium tracking-tight">
              Technology
              <br />
              without the{" "}
              <span className="font-display italic text-primary">
                complexity.
              </span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
              Your business has enough to think about. We help you understand,
              build, and adopt the technology you need, then stay involved as it
              grows.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="#businesses">Explore Motchi</ButtonLink>
              <ButtonLink href="/contact" secondary>
                Talk to us
              </ButtonLink>
            </div>
            <p className="mt-10 text-xs tracking-wide text-muted">
              Websites · Digital systems · AI & data · Custom solutions
            </p>
          </div>
          <SystemGraphic />
        </div>
      </Container>
    </section>
  );
}
