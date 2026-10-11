import { Section, SectionHeading, Workflow } from "@motchi/ui";
export function Approach() {
  return (
    <Section id="how-we-work">
      <SectionHeading
        eyebrow="How we work"
        title="From a first idea to everyday use."
      >
        We stay involved through the decisions, the implementation, and the
        questions that come after launch.
      </SectionHeading>
      <Workflow
        steps={[
          {
            title: "Understand",
            description:
              "Start with your business, your people, and the problem worth solving.",
          },
          {
            title: "Plan",
            description:
              "Choose a practical direction, with clear scope and next steps.",
          },
          {
            title: "Build",
            description:
              "Turn the plan into working technology, with communication along the way.",
          },
          {
            title: "Support",
            description:
              "Help your team adopt it, maintain it, and improve it over time.",
          },
        ]}
      />
    </Section>
  );
}
