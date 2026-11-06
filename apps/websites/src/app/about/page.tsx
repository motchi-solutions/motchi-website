import { pageMetadata } from "@motchi/config/metadata";
import { ButtonLink, ContactCTA, PageHero, Section } from "@motchi/ui";
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
        <div className="section-layout grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-h2 font-medium tracking-tight">
              Your identity, shaped for the people you serve
            </h2>
            <p className="mt-5 max-w-lg text-body-lg leading-relaxed text-muted">
              Your brand, customers, and goals guide the design. We plan a
              responsive website that feels like your business on every screen.
            </p>
          </div>
          <dl className="divide-y divide-border border-t border-border">
            <div className="py-6">
              <dt className="text-h3 font-medium">Make it easy to use</dt>
              <dd className="mt-3 max-w-lg leading-relaxed text-muted">
                Appearance matters, and so does finding information, booking,
                enquiring, or buying. We consider both from the beginning.
              </dd>
            </div>
            <div className="py-6">
              <dt className="text-h3 font-medium">
                Plan for care after launch
              </dt>
              <dd className="mt-3 max-w-lg leading-relaxed text-muted">
                We explain who looks after your website, how maintenance works,
                and how to request changes after launch.
              </dd>
            </div>
          </dl>
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
