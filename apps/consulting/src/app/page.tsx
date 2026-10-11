import { capabilities } from "@/content/capabilities";
import { engagement } from "@/content/process";
import { AnimatedLink, ContactCTA, Eyebrow, Section } from "@motchi/ui";
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
              Start with What
              <br />
              <span className="font-display italic text-primary">
                Is Getting in the Way.
              </span>
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
              See Our Capabilities
            </AnimatedLink>
          </div>
          <ol className="divide-y divide-border border-t border-border">
            {[
              [
                "An Unclear Decision",
                "Compare AI, platforms, and technology options against your real requirements.",
              ],
              [
                "Work That Takes Too Long",
                "Connect data, simplify workflows, and help existing systems work better together.",
              ],
              [
                "A Plan That Needs Delivery",
                "Turn an agreed approach into working software, adoption, and continued support.",
              ],
            ].map(([title, text], i) => (
              <li key={title} className="flex gap-5 py-7">
                <span className="pt-1 text-small text-primary">0{i + 1}</span>
                <div>
                  <h3 className="text-h3 font-medium">{title}</h3>
                  <p className="mt-3 max-w-lg leading-relaxed text-muted">
                    {text}
                  </p>
                </div>
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
              A Plan Is Only
              <br />
              <span className="font-display italic text-primary">
                The Beginning.
              </span>
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
              Explore Our Approach
            </AnimatedLink>
          </div>
        </div>
      </Section>
      <Section id="about">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>About Motchi Consulting</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              Practical Work.
              <br />
              <span className="font-display italic text-primary">
                An Honest Conversation.
              </span>
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-muted">
              Motchi Consulting is an emerging branch of Motchi Solutions, based
              in Toronto and available to businesses globally. We’ll talk openly
              about your needs, the scope, and whether we’re the right fit.
            </p>
            <div className="mt-8 border-l border-border pl-6">
              <h3 className="text-lg font-semibold">
                Case Studies Will Follow the Work.
              </h3>
              <p className="mt-3 leading-relaxed text-muted">
                We’ll share selected engagements when they’re completed and
                approved for publication. For now, the capabilities and approach
                explain how we can help.
              </p>
            </div>
          </div>
        </div>
      </Section>
      <ContactCTA title="Bring Us the Business Problem" />
    </>
  );
}
