import { Section } from "../ui/index.ts";
export function ConsultingAbout() {
  return (
    <Section id="about">
      <div className="section-layout grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-h2 font-medium tracking-tight">
            From a business question to working systems
          </h2>
          <p className="mt-5 max-w-lg text-body-lg leading-relaxed text-muted">
            Good technical work starts with understanding your business. We
            bring practical advice, hands-on implementation, and support for
            your team together. Recommendations are most useful when they lead
            to something your team can put into practice.
          </p>
        </div>
        <ol className="divide-y divide-border border-t border-border">
          <li className="py-6">
            <h3 className="text-h3 font-medium">Understand the context</h3>
            <p className="mt-3 max-w-lg leading-relaxed text-muted">
              We consider existing systems, constraints, responsibilities, and
              the outcome the business needs before selecting technology.
            </p>
          </li>
          <li className="py-6">
            <h3 className="text-h3 font-medium">Recommend and implement</h3>
            <p className="mt-3 max-w-lg leading-relaxed text-muted">
              We agree on an approach, then help build, configure, and integrate
              the solution.
            </p>
          </li>
          <li className="py-6">
            <h3 className="text-h3 font-medium">Support adoption</h3>
            <p className="mt-3 max-w-lg leading-relaxed text-muted">
              Documentation, handoff, and practical guidance help teams use what
              is delivered. Support and improvement are agreed as part of the
              engagement.
            </p>
          </li>
        </ol>
      </div>
      <p className="section-action border-t border-border pt-6 text-muted">
        Part of the Motchi family. Based in Toronto. Working with businesses
        globally.
      </p>
    </Section>
  );
}
