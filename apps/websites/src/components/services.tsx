import { Section, SectionHeading } from "@motchi/ui";
export function Services() {
  return (
    <Section id="services" className="border-y border-border bg-surface">
      <SectionHeading
        eyebrow="What we can help with"
        title="A website is part of how your business works."
      >
        We consider the whole experience: what customers need, what your team
        manages, and what happens after launch.
      </SectionHeading>
      <div className="grid gap-8 lg:grid-cols-3">
        {[
          [
            "Design & development",
            "Business websites and redesigns that reflect your brand, with responsive layouts and clear customer journeys.",
            "Brand direction · Responsive development",
          ],
          [
            "Flows & integrations",
            "Booking, e-commerce support, and connected tools that make the next step easier for your customers and your team.",
            "Booking · E-commerce · Integrations",
          ],
          [
            "Foundations & support",
            "Performance, accessibility, and SEO foundations, with hosting, deployment, and ongoing maintenance support.",
            "Performance · SEO · Maintenance",
          ],
        ].map(([title, description, note], index) => (
          <article key={title} className="border-t border-border pt-6">
            <p className="text-sm text-primary">0{index + 1}</p>
            <h3 className="mt-6 text-xl font-semibold">{title}</h3>
            <p className="mt-4 leading-relaxed text-muted">{description}</p>
            <p className="mt-7 text-xs text-primary">{note}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
