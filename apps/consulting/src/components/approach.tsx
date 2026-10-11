import { Section, SectionHeading } from "@motchi/ui";
import { engagement } from "@/content/capabilities";
export function Approach() {
  return (
    <Section id="approach" className="border-y border-border bg-surface">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="The engagement"
            title="Recommendations are a starting point."
          >
            The value comes when your team has a working solution and the
            confidence to use it.
          </SectionHeading>
          <p className="max-w-md leading-relaxed text-muted">
            We can support the path from an early idea through implementation
            and adoption, with continued support and improvement. Scope and
            responsibilities are agreed for each engagement.
          </p>
        </div>
        <ol>
          {engagement.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[2rem_1fr] gap-4 border-t border-border py-6"
            >
              <span className="pt-1 text-xs text-primary">0{i + 1}</span>
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
