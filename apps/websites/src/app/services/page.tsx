import { pageMetadata } from "@motchi/config/metadata";
import {
  ContactCTA,
  PageHero,
  Reveal,
  Section,
  SectionHeading,
} from "@motchi/ui";
import { Services } from "@/components/services";
export const metadata = pageMetadata(
  "Website Services",
  "From a new website to a better booking flow, we agree on the customer journey and the scope before choosing the tools.",
  "/services",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Website Services"
        title="Website Design, Booking, and Support"
      >
        Build a new website, improve an existing one, or make booking easier. We
        agree on the pages, features, and support you need before work begins.
      </PageHero>
      <Services />
      <Section>
        <SectionHeading
          eyebrow="Agreeing the Scope"
          title="What Does Your Website Need?"
        >
          We work out what needs to launch now and what can wait. Hosting,
          maintenance, integrations, and ongoing changes are discussed
          explicitly.
        </SectionHeading>
        <div className="grid gap-8 md:grid-cols-3">
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
      <ContactCTA title="Let's Discuss Your Website" />
    </>
  );
}
