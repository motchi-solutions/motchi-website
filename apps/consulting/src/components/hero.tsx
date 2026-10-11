import { ButtonLink, Container, Eyebrow } from "@motchi/ui";
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary py-hero text-inverse">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="relative lg:col-span-8">
            <Eyebrow light>Motchi Consulting</Eyebrow>
            <h1 className="text-display font-medium tracking-tight">
              Technology Should
              <br />
              Solve the Problem.
              <br />
              <span className="font-display italic text-accent">
                Not Become One.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-inverse/80">
              We work through the business problem with you, choose an
              appropriate approach, and help build it into something your team
              can use.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/contact" light>
                Start a Conversation
              </ButtonLink>
              <ButtonLink href="/capabilities" light secondary>
                Where We Can Help
              </ButtonLink>
            </div>
          </div>
          <aside className="border-l border-accent/40 pl-6 lg:col-span-4">
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
              A slow process. An unclear platform decision. Data you can’t
              depend on. Let’s start there.
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
