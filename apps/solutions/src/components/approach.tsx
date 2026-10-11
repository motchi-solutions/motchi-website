import { InteractiveSteps, Section, SectionHeading } from "@motchi/ui";
import { processSteps } from "@/content/process";
export function Approach() {
  return (
    <Section id="how-we-work">
      <SectionHeading
        eyebrow="How We Work"
        title="The Handover Isn’t the Finish Line"
      >
        Understand the business, build what fits, and help people use it. Then
        stay available as questions arise and needs change.
      </SectionHeading>
      <InteractiveSteps id="solutions-process" steps={processSteps} />
    </Section>
  );
}
