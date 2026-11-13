import { ButtonLink, Container, HeroBrand, HeroTrust } from "../ui/index.ts";
import { UntangleDiagram } from "./untangle-diagram.tsx";

export function Hero() {
  return (
    <section
      id="overview"
      className="relative overflow-hidden bg-primary py-[clamp(3rem,6vw,6rem)] text-inverse"
    >
      <Container>
        <div className="grid items-center gap-x-[clamp(3rem,5vw,6rem)] gap-y-12 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-w-0" data-entry-reveal="">
            <HeroBrand
              branch="consulting"
              light
              className="mb-8 items-start text-start"
            />
            <h1 className="text-[clamp(2.75rem,4.6vw,5rem)] leading-[1.05] font-medium tracking-[-0.04em] wrap-break-word">
              Technology Advice.
              <br />
              Hands-On Support.
            </h1>
            <p className="mt-6 max-w-152 text-body-lg leading-relaxed text-inverse/85">
              We help you untangle AI, data, and business systems, then put the
              right solution to work with your team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#enquiry" light>
                Start a Conversation
              </ButtonLink>
              <ButtonLink href="#capabilities" light secondary>
                See How We Can Help
              </ButtonLink>
            </div>
            <HeroTrust light className="mt-6" />
          </div>
          <div className="min-w-0 xl:ps-[clamp(1rem,2vw,2.5rem)]">
            <UntangleDiagram />
          </div>
        </div>
      </Container>
    </section>
  );
}
