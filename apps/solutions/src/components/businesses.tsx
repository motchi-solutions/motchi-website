import { getSites } from "@motchi/config/env";

import { ButtonLink, Section, SectionHeading } from "@motchi/ui";
export function Businesses() {
  const family = getSites();
  return (
    <Section id="businesses">
      <SectionHeading
        eyebrow="Motchi Businesses"
        title="Start with What Your Business Needs."
      >
        A website people can use. Systems your team can rely on. Two focused
        branches, with the same commitment to making technology manageable.
      </SectionHeading>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="branch-link flex flex-col border border-border bg-surface p-7 sm:p-10">
          <p className="text-xs tracking-widest uppercase text-primary">
            01 / Be understood online
          </p>
          <h3 className="mt-8 text-3xl font-medium">Motchi Websites</h3>
          <p className="mt-5 mb-8 max-w-md leading-relaxed text-muted">
            A website should reflect your business and help customers do what
            they came to do. We design around your brand, your audience, and the
            next step.
          </p>
          <p className="mb-8 text-sm text-primary">
            Business websites · Booking · Integrations
          </p>
          <div className="mt-auto">
            <ButtonLink href={family.websites.url}>
              Explore Motchi Websites
            </ButtonLink>
          </div>
        </article>
        <article className="branch-link flex flex-col border border-secondary bg-secondary p-7 text-inverse sm:p-10">
          <p className="text-xs tracking-widest uppercase text-accent">
            02 / Put technology to work
          </p>
          <h3 className="mt-8 text-3xl font-medium">Motchi Consulting</h3>
          <p className="mt-5 mb-8 max-w-md leading-relaxed text-inverse/80">
            When a workflow, platform, or technology decision is holding you
            back, we help work through it and carry the plan into
            implementation.
          </p>
          <p className="mb-8 text-sm text-accent">
            AI · Data · Digital systems · Adoption
          </p>
          <div className="mt-auto">
            <ButtonLink href={family.consulting.url} light>
              Explore Motchi Consulting
            </ButtonLink>
          </div>
        </article>
      </div>
    </Section>
  );
}
