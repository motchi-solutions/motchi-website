import { family } from "@motchi/brand";
import { ButtonLink, Section, SectionHeading } from "@motchi/ui";
export function Businesses() {
  return (
    <Section id="businesses">
      <SectionHeading
        eyebrow="The Motchi family"
        title="Two ways to move your business forward."
      >
        Focused businesses, connected by a shared approach: understand what
        matters, make it work, and keep it working.
      </SectionHeading>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="flex flex-col border border-border bg-surface p-7 sm:p-10">
          <p className="text-xs tracking-widest uppercase text-primary">
            01 / Your presence online
          </p>
          <h3 className="mt-8 text-3xl font-medium">Motchi Websites</h3>
          <p className="mt-5 mb-10 max-w-md leading-relaxed text-muted">
            Websites shaped around your brand and the way your customers
            interact with your business. From the first impression to the next
            booking.
          </p>
          <div className="mt-auto">
            <ButtonLink href={family.websites.domain}>
              Explore Motchi Websites
            </ButtonLink>
          </div>
        </article>
        <article className="flex flex-col bg-secondary p-7 text-inverse sm:p-10">
          <p className="text-xs tracking-widest uppercase text-accent">
            02 / Your technology in practice
          </p>
          <h3 className="mt-8 text-3xl font-medium">Motchi Consulting</h3>
          <p className="mt-5 mb-10 max-w-md leading-relaxed text-inverse/80">
            A practical partner for AI, data, digital systems, and technology
            strategy. From a business question to implementation and adoption.
          </p>
          <div className="mt-auto">
            <ButtonLink href={family.consulting.domain} light>
              Explore Motchi Consulting
            </ButtonLink>
          </div>
        </article>
      </div>
    </Section>
  );
}
