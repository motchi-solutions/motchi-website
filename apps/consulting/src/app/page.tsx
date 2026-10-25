import { capabilities } from "@/content/capabilities";
import { engagement } from "@/content/process";
import { AnimatedLink, ContactCTA, Eyebrow, Reveal, Section } from "@motchi/ui";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <Hero />
      <Section id="capabilities">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Where We Can Help</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              AI, Data, and Business Systems Support
            </h2>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-small text-primary">
              {capabilities.map((capability) => (
                <li key={capability.id}>{capability.title}</li>
              ))}
            </ul>
            <AnimatedLink
              href="/capabilities"
              arrow
              className="mt-7 min-h-12 text-primary"
            >
              Explore Our Services
            </AnimatedLink>
          </div>
          <ol className="divide-y divide-border border-t border-border">
            {[
              [
                "Choose the Right Technology",
                "Compare AI, platforms, and technology options against your real requirements.",
              ],
              [
                "Reduce Repetitive Work",
                "Connect data, simplify workflows, and help existing systems work better together.",
              ],
              [
                "Put Your Plan Into Practice",
                "Turn an agreed approach into working software, adoption, and continued support.",
              ],
            ].map(([title, text], i) => (
              <li key={title} className="py-7">
                <Reveal className="flex gap-5">
                  <span className="pt-1 text-small text-primary">0{i + 1}</span>
                  <div>
                    <h3 className="text-h3 font-medium">{title}</h3>
                    <p className="mt-3 max-w-lg leading-relaxed text-muted">
                      {text}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Section
        id="approach"
        className="brand-grid border-y border-border bg-surface"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>Advice Through Adoption</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              How We Work With Your Team
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-body-lg leading-relaxed text-muted">
              {engagement.map((step) => step.title).join(" → ")}. We agree on
              the scope and stay involved through the stages your team needs.
            </p>
            <AnimatedLink
              href="/approach"
              arrow
              className="mt-7 min-h-12 text-primary"
            >
              See How We Work
            </AnimatedLink>
          </div>
        </div>
      </Section>
      <Section
        id="about"
        className="about-summary-section border-t border-border"
      >
        <div className="about-summary grid gap-8 lg:grid-cols-2">
          <div className="about-summary-heading">
            <Eyebrow>About Motchi Consulting</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              Advice That Leads to Action
            </h2>
          </div>
          <div className="about-summary-content">
            <p className="max-w-lg text-body-lg leading-relaxed text-muted">
              We start with business context and stay involved through
              implementation and adoption. Technology should fit the work.
            </p>
            <AnimatedLink
              href="/about"
              arrow
              className="mt-6 min-h-12 text-primary"
            >
              Learn More About Motchi Consulting
            </AnimatedLink>
          </div>
        </div>
      </Section>
      <ContactCTA title="Let's Plan Your Next Step" />
    </>
  );
}
