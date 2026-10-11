import { InteractiveSteps, Section, SectionHeading } from "@motchi/ui";
import { engagement } from "@/content/process";
export function Approach() {
  return (
    <Section id="approach" className="bg-surface">
      <SectionHeading
        eyebrow="From Idea to Everyday Use"
        title="Carry the Plan Through"
      >
        We work alongside your team through implementation, adoption, and
        continued support. Every engagement has an agreed scope and clear
        responsibilities.
      </SectionHeading>
      <InteractiveSteps id="consulting-process" steps={engagement} />
    </Section>
  );
}
