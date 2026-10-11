import { Section, SectionHeading, Workflow } from "@motchi/ui";
export function Approach() {
  return (
    <Section id="how-we-work">
      <SectionHeading
        eyebrow="How We Work"
        title="The Handover Isn’t the Finish Line."
      >
        We help you make the decision, build what fits, and put it to use. Then
        we stay available as questions come up and your business changes.
      </SectionHeading>
      <Workflow
        steps={[
          {
            title: "Understand",
            description:
              "Listen to the people doing the work. Find the problem behind the request.",
          },
          {
            title: "Plan",
            description:
              "Agree on a practical approach, a clear scope, and what success should look like.",
          },
          {
            title: "Build",
            description:
              "Implement the solution and keep you involved in the decisions that matter.",
          },
          {
            title: "Support",
            description:
              "Help your team use it, keep it working, and improve it when the need changes.",
          },
        ]}
      />
    </Section>
  );
}
