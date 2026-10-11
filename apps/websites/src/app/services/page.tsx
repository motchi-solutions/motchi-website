import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA, PageHero, Section, SectionHeading } from "@motchi/ui";
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
        title="A Website That Works Beyond the Homepage"
      >
        From a new website to a better booking flow, we agree on the customer
        journey and the scope before choosing the tools.
      </PageHero>
      <Services />
      <Section>
        <SectionHeading
          eyebrow="Agreeing the Scope"
          title="Start with the Essentials"
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
              "Connected Customer Flows",
              "Map booking, enquiries, or purchases into the tools and responsibilities behind them.",
            ],
          ].map(([title, text]) => (
            <article key={title} className="border-t border-border pt-6">
              <h3 className="text-h3 font-medium">{title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </div>
      </Section>
      <ContactCTA title="Let’s Discuss Your Website" />
    </>
  );
}
