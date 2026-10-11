import { InteractiveSteps, Section, SectionHeading } from "@motchi/ui";
import { processSteps } from "@/content/process";
export function Process() {
  return (
    <Section id="process">
      <SectionHeading eyebrow="Working Together" title="Know What Happens Next">
        A clear journey from the first conversation to continued support.
        Explore a stage for the details.
      </SectionHeading>
      <InteractiveSteps id="websites-process" steps={processSteps} />
    </Section>
  );
}
