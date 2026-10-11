import { Section, SectionHeading, Workflow } from "@motchi/ui";
export function Process() {
  return (
    <Section id="process">
      <SectionHeading
        eyebrow="Working Together"
        title="Know What Happens Next."
      >
        A clear process, with room for your input before the decisions become
        difficult to change.
      </SectionHeading>
      <Workflow
        steps={[
          {
            title: "Discover",
            description:
              "Talk through your audience, your brand, and what the website needs to do.",
          },
          {
            title: "Design",
            description:
              "Agree on the structure and visual direction before development begins.",
          },
          {
            title: "Develop",
            description:
              "Build the experience, review it together, and check the customer flows.",
          },
          {
            title: "Launch & Support",
            description:
              "Prepare for launch and stay available for maintenance and changes.",
          },
        ]}
      />
    </Section>
  );
}
