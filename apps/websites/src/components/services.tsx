import { Eyebrow, Section } from "@motchi/ui";
export function Services() {
  return (
    <Section id="services" className="bg-surface">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Eyebrow>Beyond the First Impression</Eyebrow>
          <h2 className="text-h2 font-medium tracking-tight">
            Make the
            <br />
            <span className="font-display italic text-primary">
              Next Step Easy.
            </span>
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-muted">
            A useful website connects what customers need with what your team
            can manage.
          </p>
        </div>
        <div className="lg:col-span-3">
          {[
            [
              "Design & Development",
              "A new site or a considered redesign. Clear structure, your own visual identity, and layouts that work across screens.",
            ],
            [
              "Booking & Connected Flows",
              "Help customers book, buy, or get in touch. Connect the website with the tools your business already uses.",
            ],
            [
              "Performance & Continued Support",
              "Build accessibility, performance, and SEO into the foundations. Stay supported through hosting, maintenance, and future changes.",
            ],
          ].map(([title, description], i) => (
            <article
              key={title}
              className="grid grid-cols-[2rem_1fr] gap-4 border-t border-border py-7"
            >
              <span className="pt-1 text-xs text-primary">0{i + 1}</span>
              <div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-muted">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
