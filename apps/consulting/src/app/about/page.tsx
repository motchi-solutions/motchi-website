import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA, PageHero, Reveal, Section } from "@motchi/ui";
export const metadata = pageMetadata(
  "About Motchi Consulting",
  "Recommendations should lead to execution. We work with you to understand the problem, agree on a proportionate approach, and put it into practice.",
  "/about",
);
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Motchi Consulting"
        title="About Motchi Consulting"
      >
        We help businesses make better technology decisions and put them into
        practice. Our work brings together advice, hands-on development, and
        support for the people using your systems.
      </PageHero>
      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          <Reveal className="service-card-reveal flex">
            <article className="w-full border-t border-border pt-6">
              <h2 className="text-h3 font-medium">
                Understand Before Recommending
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                We consider existing systems, constraints, responsibilities, and
                the outcome the business needs before selecting technology.
              </p>
            </article>
          </Reveal>
          <Reveal className="service-card-reveal flex">
            <article className="w-full border-t border-border pt-6">
              <h2 className="text-h3 font-medium">
                Put the Plan Into Practice
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Architecture and advice are useful when they become working
                systems. We help build, configure, and integrate the agreed
                solution.
              </p>
            </article>
          </Reveal>
          <Reveal className="service-card-reveal flex">
            <article className="w-full border-t border-border pt-6">
              <h2 className="text-h3 font-medium">Help Your Team Use It</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Documentation, handoff, and practical guidance help teams use
                what is delivered. Support and improvement are agreed as part of
                the engagement.
              </p>
            </article>
          </Reveal>
        </div>
      </Section>
      <ContactCTA />
    </>
  );
}
