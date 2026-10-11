import {
  ButtonLink,
  ContactCTA,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
  Workflow,
} from "@motchi/ui";
import type { Metadata } from "next";
import { Services } from "@/components/services";
import { Work } from "@/components/work";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5 lg:items-end">
            <div className="lg:col-span-3">
              <Eyebrow>Thoughtful design. Practical development.</Eyebrow>
              <h1 className="text-hero font-medium tracking-tight">
                Your business.
                <br />
                Your character.
                <br />
                <span className="font-display italic text-primary">
                  Your website.
                </span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
                More than a good first impression. A website that helps people
                understand your business and take the next step.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="#work">Explore our work</ButtonLink>
                <ButtonLink href="/contact" secondary>
                  Discuss your website
                </ButtonLink>
              </div>
            </div>
            <div className="border-t border-primary pt-7 lg:col-span-2">
              <p className="text-sm text-primary">
                One approach should not define every client.
              </p>
              <p className="mt-6 text-2xl leading-snug">
                A restaurant should feel like a restaurant. A consultancy should
                feel like a consultancy.
              </p>
              <p className="mt-6 leading-relaxed text-muted">
                Your brand and goals lead the design. Our role is to make that
                direction work, clearly and reliably.
              </p>
              <div
                aria-hidden="true"
                className="mt-10 grid h-24 grid-cols-3 gap-3"
              >
                <div className="bg-primary" />
                <div className="rounded-t-full border border-border bg-accent" />
                <div className="border border-border bg-surface" />
              </div>
            </div>
          </div>
        </Container>
      </section>
      <Work />
      <Services />
      <Section id="process">
        <SectionHeading
          eyebrow="Our process"
          title="Clear steps. A considered result."
        />
        <Workflow
          steps={[
            {
              title: "Discover",
              description:
                "Understand your business, audience, and what the website needs to do.",
            },
            {
              title: "Design",
              description:
                "Agree on structure and a visual direction that belongs to your brand.",
            },
            {
              title: "Develop",
              description:
                "Build and review the experience across screens and customer flows.",
            },
            {
              title: "Launch & support",
              description:
                "Prepare for launch, help you manage the site, and support it over time.",
            },
          ]}
        />
      </Section>
      <Section id="about" className="bg-surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Part of Motchi Solutions</Eyebrow>
            <h2 className="text-section font-medium tracking-tight">
              A practical partner
              <br />
              for your presence online.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted">
            <p>
              Motchi Websites combines design and development with the wider
              Motchi philosophy: make technology accessible, communicate
              clearly, and stay available after delivery.
            </p>
            <p>
              We’re proudly Canadian and work with businesses globally. Every
              project starts with the people and business behind the website.
            </p>
          </div>
        </div>
      </Section>
      <ContactCTA title="What should your website do for you?" />
    </>
  );
}
