import { pageMetadata } from "@motchi/config/metadata";
import { ButtonLink, ContactCTA, PageHero, Reveal, Section } from "@motchi/ui";
export const metadata = pageMetadata(
  "About",
  "Recommendations should lead to execution. We work with you to understand the problem, agree on a proportionate approach, and put it into practice.",
  "/about",
);
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Motchi Consulting"
        title="Practical Advice and Hands-On Support"

        actions={
          <ButtonLink href="/capabilities">
            Explore Consulting Services
          </ButtonLink>
        }
      >
        Good technical work starts with understanding your business. We bring
        practical advice, hands-on implementation, and support for your team
        together.
      </PageHero>
      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          <Reveal className="service-card-reveal flex">
            <article className="w-full border-t border-border pt-6">
              <h2 className="text-h3 font-medium">
                Understand Your Business First
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
                Build and Connect Your Systems
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
              <h2 className="text-h3 font-medium">
                Support Your Team Through Adoption
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Documentation, handoff, and practical guidance help teams use
                what is delivered. Support and improvement are agreed as part of
                the engagement.
              </p>
            </article>
          </Reveal>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-muted">
          Part of the Motchi family. Based in Toronto. Working with businesses
          globally.
        </p>
      </Section>

      <ContactCTA />
    </>
  );
}
