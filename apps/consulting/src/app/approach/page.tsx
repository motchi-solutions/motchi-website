import { pageMetadata } from "@motchi/config/metadata";
import {
  ContactCTA,
  PageHero,
  Reveal,
  Section,
  SectionHeading,
} from "@motchi/ui";
import { Approach } from "@/components/approach";
export const metadata = pageMetadata(
  "Our Approach",
  "An implementation-focused relationship, with clear responsibilities and support through the stages your business needs.",
  "/approach",
);
export default function Page() {
  return (
    <>
      <PageHero eyebrow="Our Approach" title="How We Work With Your Team">
        See how we review your needs, agree on a plan, and put it into practice.
        We make responsibilities clear and help your team use what we build.
      </PageHero>
      <Approach />
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="A Practical Engagement"
          title="What We Agree Before Starting"
        >
          We clarify the problem, decision-makers, constraints, and
          responsibilities together. Scope and support are agreed for each
          engagement.
        </SectionHeading>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            [
              "A Clear Starting Point",
              "The current process, what is getting in the way, and what a useful improvement would look like.",
            ],
            [
              "Shared Responsibilities",
              "The people, access, and approvals needed to move from a recommendation to implementation.",
            ],
            [
              "Support That Fits",
              "An agreed handover and support arrangement, with room to review what needs improving.",
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
      <ContactCTA title="Tell Us What You Need Help With" />
    </>
  );
}
