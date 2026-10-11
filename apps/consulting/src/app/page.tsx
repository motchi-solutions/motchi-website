import {
  ButtonLink,
  ContactCTA,
  Container,
  Eyebrow,
  Section,
} from "@motchi/ui";
import type { Metadata } from "next";
import { Approach } from "@/components/approach";
import { Capabilities } from "@/components/capabilities";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="bg-primary py-section text-inverse">
        <Container>
          <div className="grid gap-14 lg:grid-cols-5 lg:items-end">
            <div className="lg:col-span-3">
              <Eyebrow light>Business context. Technical depth.</Eyebrow>
              <h1 className="text-hero font-medium tracking-tight">
                Technology should
                <br />
                solve the problem.
                <br />
                <span className="font-display italic text-accent">
                  Not become one.
                </span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-inverse/80">
                A practical, implementation-focused partner for the technology
                decisions that matter to your business.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/contact" light>
                  Start a conversation
                </ButtonLink>
                <ButtonLink href="#capabilities" light>
                  Our capabilities
                </ButtonLink>
              </div>
            </div>
            <div className="border-t border-accent/50 pt-8 lg:col-span-2">
              <p className="text-xs tracking-widest uppercase text-accent">
                Our starting point
              </p>
              <p className="mt-6 text-3xl leading-snug">
                What does your
                <br />
                business need
                <br />
                <span className="font-display italic">to work better?</span>
              </p>
              <p className="mt-8 text-sm leading-relaxed text-inverse/80">
                Understand the problem.
                <br />
                Implement the solution.
                <br />
                Support the people using it.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <Capabilities />
      <Approach />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>Building the practice</Eyebrow>
            <h2 className="text-section font-medium tracking-tight">
              Working substance.
              <br />
              Clear communication.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-muted">
              Motchi Consulting is an emerging branch of Motchi Solutions. Our
              approach is grounded in understanding your business, choosing
              appropriate technology, and staying involved through
              implementation.
            </p>
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-lg font-semibold">
                Selected consulting work, in time.
              </h3>
              <p className="mt-3 leading-relaxed text-muted">
                Case studies will be shared as engagements are completed and
                approved for publication. In the meantime, let’s discuss your
                needs and whether we’re the right fit.
              </p>
            </div>
          </div>
        </div>
      </Section>
      <ContactCTA title="Bring us the business problem." />
    </>
  );
}
