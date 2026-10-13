import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA, PageHero, Reveal, Section } from "@motchi/ui";
export const metadata = pageMetadata(
  "About Motchi Websites",
  "Your website should reflect it. We bring design, development, and support together around the people who use your site.",
  "/about",
);
export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Motchi Websites" title="About Motchi Websites">
        We design and build websites around your business and your customers.
        From the first plan to support after launch, we help make your website
        clear, useful, and easy to manage.
      </PageHero>
      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          <Reveal className="service-card-reveal flex">
            <article className="w-full border-t border-border pt-6">
              <h2 className="text-h3 font-medium">
                Design Around the Business
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                We do not force every client into the same template. Your
                identity, customers, and goals guide the structure and design.
              </p>
            </article>
          </Reveal>
          <Reveal className="service-card-reveal flex">
            <article className="w-full border-t border-border pt-6">
              <h2 className="text-h3 font-medium">Make It Easy to Use</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Appearance matters, and so does finding information, booking,
                enquiring, or buying. We consider both from the beginning.
              </p>
            </article>
          </Reveal>
          <Reveal className="service-card-reveal flex">
            <article className="w-full border-t border-border pt-6">
              <h2 className="text-h3 font-medium">
                Stay Available After Launch
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Handoff, maintenance, and ongoing changes are discussed clearly.
                A website needs care as the business grows.
              </p>
            </article>
          </Reveal>
        </div>
      </Section>
      <ContactCTA />
    </>
  );
}
