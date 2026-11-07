import { InteractiveSteps, Section, SectionHeading } from "../ui/index.ts";
import { engagement } from "../../content/consulting/process.ts";
export function Approach() {
  return (
    <Section id="approach" className="bg-surface">
      <SectionHeading title="How We Work on Consulting Projects">
        We work alongside your team through implementation, adoption, and
        continued support. Every engagement has an agreed scope and clear
        responsibilities.
      </SectionHeading>
      <InteractiveSteps id="consulting-process" steps={engagement} />
    </Section>
  );
}
