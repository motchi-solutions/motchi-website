import { pageMetadata } from "@motchi/config/metadata";
import {
  ButtonLink,
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
      <PageHero
        eyebrow="Our Approach"
        title="How We Plan and Deliver Your Project"
        actions={<ButtonLink href="/contact">Discuss Your Project</ButtonLink>}
      >
        Understand the problem. Build the solution. Help your team use it. We
        work with you through implementation, adoption, and agreed ongoing
        support.
      </PageHero>
      <Approach />
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Before We Begin"
          title="Your Scope, Responsibilities, and Support"
        >
          We clarify the problem, decision-makers, constraints, and
          responsibilities together. Scope and support are agreed for each
          engagement.
        </SectionHeading>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            [
              "Your Goals and Constraints",
              "The current process, what is getting in the way, and what a useful improvement would look like.",
            ],
            [
              "Access, Approvals, and Ownership",
              "The people, access, and approvals needed to move from a recommendation to implementation.",
            ],
            [
              "Handover and Ongoing Support",
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
      <ContactCTA title="Let's Plan Your Next Step" />
    </>
  );
}
