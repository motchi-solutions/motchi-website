import { Section, SectionHeading } from "../ui/index.ts";
export function WebsiteResponsibilities() {
  return (
    <Section className="border-t border-border">
      <SectionHeading title="Your Scope, Responsibilities, and Support">
        We agree on what your website needs, who does what, and what support
        comes after launch.
      </SectionHeading>
      <dl className="section-cards grid md:grid-cols-3">
        {[
          [
            "Content & Ownership",
            "Who supplies and approves copy, photographs, logos, and project information.",
          ],
          [
            "Scope & Review",
            "Which pages and customer flows are included, how feedback is collected, and how changes are agreed.",
          ],
          [
            "Launch & Support",
            "Who manages the domain, hosting, and connected tools, and what support is included after launch.",
          ],
        ].map(([title, text]) => (
          <div key={title} className="border-t border-border pt-6">
            <dt className="text-h3 font-medium">{title}</dt>
            <dd className="mt-4 leading-relaxed text-muted">{text}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
