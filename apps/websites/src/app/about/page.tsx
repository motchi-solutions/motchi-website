import { pageMetadata } from "@motchi/config/metadata";
import { ButtonLink, ContactCTA, PageHero, Reveal, Section } from "@motchi/ui";
export const metadata = pageMetadata(
  "About",
  "Website design, development, and support shaped around your business and the people who use your site.",
  "/about",
);
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Motchi Websites"
        title="Our Approach to Your Website"
        actions={
          <ButtonLink href="/services">Explore Website Services</ButtonLink>
        }
      >
        Your website should fit your business and be easy for customers to use.
        We keep the design, costs, and next steps clear, with support options
        after launch.
      </PageHero>
      <Section>
        <div className="section-cards grid md:grid-cols-3">
          <Reveal className="service-card-reveal flex">
            <article className="w-full border-t border-border pt-6">
              <h2 className="text-h3 font-medium">
                Design That Reflects Your Business
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Your brand, customers, and goals guide the design. We plan a
                responsive website that feels like your business on every
                screen.
              </p>
            </article>
          </Reveal>
          <Reveal className="service-card-reveal flex">
            <article className="w-full border-t border-border pt-6">
              <h2 className="text-h3 font-medium">
                Help Customers Find What They Need
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Appearance matters, and so does finding information, booking,
                enquiring, or buying. We consider both from the beginning.
              </p>
            </article>
          </Reveal>
          <Reveal className="service-card-reveal flex">
            <article className="w-full border-t border-border pt-6">
              <h2 className="text-h3 font-medium">
                Agree on Care After Launch
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                We explain who looks after your website, how maintenance works,
                and how to request changes after launch.
              </p>
            </article>
          </Reveal>
        </div>
        <p className="section-action border-t border-border pt-6 text-muted">
          Part of the Motchi family. Based in Toronto. Working with businesses
          globally.
        </p>
      </Section>

      <ContactCTA action="Start a Project" title="Let's Plan Your Website" />
    </>
  );
}
