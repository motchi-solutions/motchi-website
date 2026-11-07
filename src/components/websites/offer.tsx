import { ButtonLink, Reveal, Section, SectionHeading } from "../ui/index.ts";
import { branchHref } from "../../lib/config/navigation.ts";
import { websiteStarter } from "../../lib/config/sites.ts";
export function WebsiteOffer() {
  return (
    <>
      <Section id="pricing" className="border-b border-border">
        <SectionHeading
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
            <ButtonLink
              href={branchHref("websites", "/contact")}
              className="content-action"
            >
              Start a Project
            </ButtonLink>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeading title="Decide What to Build First">
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
    </>
  );
}
