import { InteractiveSteps, Section, SectionHeading } from "@motchi/ui";
import { processSteps } from "@/content/process";
export function Process() {
  return (
    <Section id="process">
      <SectionHeading eyebrow="Our Process" title="Your Website, Step by Step">
        From planning your pages to launch and ongoing support. Select a step to
        see what we do and where your input helps.
      </SectionHeading>
      <InteractiveSteps id="websites-process" steps={processSteps} />
    </Section>
  );
}
