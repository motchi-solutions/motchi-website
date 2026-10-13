import { services } from "@/content/services";
import { Eyebrow, Reveal, Section } from "@motchi/ui";
export function Services() {
  return (
    <Section id="services" className="bg-surface">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Eyebrow>Website Services</Eyebrow>
          <h2 className="text-h2 font-medium tracking-tight">
            How We Can Help With Your Website
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-muted">
            A useful website connects what customers need with what your team
            can manage.
          </p>
        </div>
        <div className="lg:col-span-3">
          {services.map((service, i) => (
            <Reveal key={service.id} className="service-row-reveal">
              <article
                id={service.id}
                className="grid grid-cols-[2rem_1fr] gap-4 border-t border-border py-7"
              >
                <span className="pt-1 text-xs text-primary">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="mt-3 max-w-lg leading-relaxed text-muted">
                    {service.summary}
                  </p>
                  <details className="mt-4">
                    <summary className="inline-flex min-h-11 cursor-pointer items-center text-small text-primary">
                      What This Includes
                    </summary>
                    <ul className="mt-3 space-y-3 text-small leading-relaxed text-muted">
                      {service.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
