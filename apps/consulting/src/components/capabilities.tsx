import { Section, SectionHeading } from "@motchi/ui";
import { capabilities } from "@/content/capabilities";
export function Capabilities() {
  return (
    <Section id="capabilities">
      <SectionHeading
        eyebrow="Capabilities"
        title="Start with the problem. Choose the right tools."
      >
        Focused technology support across strategy, data, digital systems, and
        delivery. The engagement follows your needs.
      </SectionHeading>
      <div className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability, i) => (
          <article
            key={capability.title}
            className="border-t border-border pt-6"
          >
            <p className="text-sm text-primary">0{i + 1}</p>
            <h3 className="mt-6 text-2xl font-medium">{capability.title}</h3>
            <p className="mt-4 leading-relaxed text-muted">
              {capability.description}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {capability.areas.map((area) => (
                <li key={area} className="flex gap-3">
                  <span aria-hidden="true" className="text-primary">
                    —
                  </span>
                  {area}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
