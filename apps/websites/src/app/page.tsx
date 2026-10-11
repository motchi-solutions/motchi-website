import { services } from "@/content/services";
import { processSteps } from "@/content/process";
import { AnimatedLink, ContactCTA, Eyebrow, Section } from "@motchi/ui";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <Hero />
      <Work featuredOnly />
      <Section className="border-y border-border">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Built Around Your Business</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              Your Identity.
              <br />
              <span className="font-display italic text-primary">
                A Clear Next Step.
              </span>
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-body-lg leading-relaxed text-muted">
              A restaurant and a consultancy should not look like the same
              company. Your brand guides the design; your customers’ needs guide
              the structure.
            </p>
            <ul className="mt-7 divide-y divide-border">
              {services.map((service) => (
                <li key={service.id} className="py-5">
                  <h3 className="text-h3 font-medium">{service.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">
                    {service.summary}
                  </p>
                </li>
              ))}
            </ul>
            <AnimatedLink
              href="/services"
              arrow
              className="mt-5 min-h-12 text-primary"
            >
              Explore Our Services
            </AnimatedLink>
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-h3 font-medium">From Brief to Support</h3>
              <p className="mt-3 text-small leading-relaxed text-muted">
                {processSteps.map((step) => step.title).join(" → ")}
              </p>
              <AnimatedLink
                href="/process"
                arrow
                className="mt-3 min-h-12 text-primary"
              >
                See How We Work
              </AnimatedLink>
            </div>
          </div>
        </div>
      </Section>
      <Section id="about" className="bg-secondary text-inverse">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow light>About Motchi Websites</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              A Website Is a Beginning.
              <br />
              <span className="font-display italic text-accent">
                We Stay Available.
              </span>
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-inverse/80">
            <p>
              Motchi Websites brings design and development together with
              practical support. You get a website built around your business
              and a partner to help with what comes after launch.
            </p>
            <p>
              Based in Toronto and serving businesses globally, we keep the
              conversation straightforward and the technology manageable.
            </p>
          </div>
        </div>
      </Section>
      <ContactCTA title="What Should Your Website Do for You?" />
    </>
  );
}
