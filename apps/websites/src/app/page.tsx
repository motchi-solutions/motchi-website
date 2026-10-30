import { services } from "@/content/services";
import { processSteps } from "@/content/process";
import { AnimatedLink, ContactCTA, Eyebrow, Reveal, Section } from "@motchi/ui";
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
        <div className="section-layout grid lg:grid-cols-2">
          <div className="section-introduction">
            <Eyebrow>Built Around Your Business</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              Design, Integrations, and Ongoing Care
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-body-lg leading-relaxed text-muted">
              A restaurant and a consultancy should not look like the same
              company. Your brand guides the design; your customers' needs guide
              the structure.
            </p>
            <ul className="mt-7 divide-y divide-border">
              {services.map((service) => (
                <li key={service.id} className="py-5">
                  <Reveal>
                    <h3 className="text-h3 font-medium">{service.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">
                      {service.summary}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
            <AnimatedLink
              href="/services"
              arrow
              className="content-action min-h-12 text-primary"
            >
              Explore Our Services
            </AnimatedLink>
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-h3 font-medium">
                From Planning to Website Care
              </h3>
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
      <Section
        id="about"
        className="about-summary-section border-t border-border"
      >
        <div className="about-summary section-layout grid lg:grid-cols-2">
          <div className="about-summary-heading section-introduction">
            <Eyebrow>About Motchi Websites</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              Design That Reflects Your Business
            </h2>
          </div>
          <div className="about-summary-content">
            <p className="max-w-lg text-body-lg leading-relaxed text-muted">
              Your business deserves its own identity, a website people can use,
              and support beyond launch.
            </p>
            <AnimatedLink
              href="/about"
              arrow
              className="content-action min-h-12 text-primary"
            >
              Learn More About Motchi Websites
            </AnimatedLink>
          </div>
        </div>
      </Section>
      <ContactCTA action="Start a Project" title="Let's Plan Your Website" />
    </>
  );
}
