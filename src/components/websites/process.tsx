import { InteractiveSteps, Section, SectionHeading } from "../ui/index.ts";
import { processSteps } from "../../content/websites/process.ts";
export function Process() {
  return (
    <Section id="process">
      <SectionHeading title="How We Build Your Website">
        From planning your pages to launch and ongoing support. Select a step to
        see what we do and where your input helps.
      </SectionHeading>
      <InteractiveSteps id="websites-process" steps={processSteps} />
    </Section>
  );
}
