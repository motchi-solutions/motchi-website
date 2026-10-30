import { websiteStarter } from "@motchi/config/sites";
import { pageMetadata } from "@motchi/config/metadata";
import {
  ButtonLink,
  ContactCTA,
  PageHero,
  Reveal,
  Section,
  SectionHeading,
} from "@motchi/ui";
import { Services } from "@/components/services";
export const metadata = pageMetadata(
  "Services",
  "From a new website to a better booking flow, we agree on the customer journey and the scope before choosing the tools.",
  "/services",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Website Services"
        title="Website Design and Ongoing Care"

        actions={<ButtonLink href="/contact">Start a Project</ButtonLink>}
      >
        From design and development to booking, integrations, and ongoing care.
        We shape the scope around your business and budget, with clear costs
        before we begin and maintenance options after launch.
      </PageHero>
      <Section className="border-b border-border">
        <SectionHeading
          eyebrow="A Practical Starting Point"
          title={`One-Page Websites From ${websiteStarter.price}`}
        >
          {websiteStarter.description}
        </SectionHeading>
        <div className="section-cards grid md:grid-cols-2">
          <p className="leading-relaxed text-muted">{websiteStarter.terms}</p>
          <div>
            <h3 className="text-h3 font-semibold">Maintenance After Launch</h3>
            <p className="mt-3 leading-relaxed text-muted">
              We can handle routine upkeep and agreed changes so you have
              someone to turn to. Your quote explains the care options, what
              they cover, and what they cost. You can discuss a budget without
              committing to a package.
            </p>
            <ButtonLink href="/contact" className="content-action">
              Start a Project
            </ButtonLink>
          </div>
        </div>
      </Section>
      <Services />
      <Section>
        <SectionHeading
          eyebrow="Agreeing the Scope"
          title="Decide What to Build First"
        >
          We work out what needs to launch now and what can wait. Hosting,
          maintenance, integrations, and ongoing changes are discussed
          explicitly.
        </SectionHeading>
        <div className="section-cards grid md:grid-cols-3">
          {[
            [
              "A New Website",
              "Define your pages, content, identity, and the main action customers should take.",
            ],
            [
              "A Better Existing Site",
              "Identify where visitors get stuck and decide what is worth keeping or changing.",
            ],
            [
              "Booking and Connected Tools",
              "Map booking, enquiries, or purchases into the tools and responsibilities behind them.",
            ],
          ].map(([title, text]) => (
            <Reveal key={title} className="service-card-reveal flex">
              <article className="w-full border-t border-border pt-6">
                <h3 className="text-h3 font-medium">{title}</h3>
                <p className="mt-4 leading-relaxed text-muted">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
      <ContactCTA action="Start a Project" title="Let's Plan Your Website" />
    </>
  );
}
