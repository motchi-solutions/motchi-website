import { Section, SectionHeading } from "@motchi/ui";
import { capabilities } from "@/content/capabilities";
export function Capabilities() {
  return (
    <Section id="capabilities">
      <SectionHeading
        eyebrow="Where We Can Help"
        title="Start with the Work That Isn’t Working."
      >
        Sometimes the answer is a new system. Sometimes it’s a better use of
        what you already have. The business problem leads the conversation.
      </SectionHeading>
      <div>
        {capabilities.map((capability, i) => (
          <article
            key={capability.title}
            className="capability-row grid gap-5 border-t border-border px-5 py-8 sm:px-7 lg:grid-cols-12 lg:gap-10"
          >
            <div className="flex items-baseline gap-4 lg:col-span-4">
              <span className="text-xs text-primary">0{i + 1}</span>
              <h3 className="text-xl font-medium">{capability.title}</h3>
            </div>
            <div className="lg:col-span-8">
              <p className="text-2xl font-medium tracking-tight">
                {capability.problem}
              </p>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                {capability.description}
              </p>
              <details className="mt-5">
                <summary className="animated-link inline-flex min-h-11 cursor-pointer list-none items-center text-sm text-primary">
                  <span>Explore the Scope</span>
                  <span aria-hidden="true" className="ml-3">
                    +
                  </span>
                </summary>
                <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  {capability.areas.map((area) => (
                    <li key={area} className="flex items-baseline gap-3">
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 rounded-full bg-primary"
                      />
                      {area}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
