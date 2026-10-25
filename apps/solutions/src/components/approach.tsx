import { InteractiveSteps, Section, SectionHeading } from "@motchi/ui";
import { processSteps } from "@/content/process";
export function Approach() {
  return (
    <Section id="how-we-work">
      <SectionHeading eyebrow="How We Work" title="Your Project, Step by Step">
        We learn what your business needs, agree on a plan, build the solution,
        and support your team after launch.
      </SectionHeading>
      <InteractiveSteps
        id="solutions-process"
        steps={processSteps}
        singleSelection
      />
    </Section>
  );
}
