import { Section } from "../ui/index.ts";
export function WebsiteAbout() {
  return (
    <Section id="about">
      <div className="section-layout grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-h2 font-medium tracking-tight">
            Your identity, shaped for the people you serve
          </h2>
          <p className="mt-5 max-w-lg text-body-lg leading-relaxed text-muted">
            Your brand, customers, and goals guide the design. We plan a
            responsive website that feels like your business on every screen.
          </p>
        </div>
        <dl className="divide-y divide-border border-t border-border">
          <div className="py-6">
            <dt className="text-h3 font-medium">Make it easy to use</dt>
            <dd className="mt-3 max-w-lg leading-relaxed text-muted">
              Appearance matters, and so does finding information, booking,
              enquiring, or buying. We consider both from the beginning.
            </dd>
          </div>
          <div className="py-6">
            <dt className="text-h3 font-medium">Plan for care after launch</dt>
            <dd className="mt-3 max-w-lg leading-relaxed text-muted">
              We explain who looks after your website, how maintenance works,
              and how to request changes after launch.
            </dd>
          </div>
        </dl>
      </div>
      <p className="section-action border-t border-border pt-6 text-muted">
        Part of the Motchi family. Based in Toronto. Working with businesses
        globally.
      </p>
    </Section>
  );
}
