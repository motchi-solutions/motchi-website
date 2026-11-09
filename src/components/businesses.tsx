import Image from "next/image";
import { logos } from "../lib/brand.ts";

import { ButtonLink, Reveal, Section, SectionHeading } from "./ui/index.ts";
export function Businesses() {
  return (
    <Section id="businesses">
      <SectionHeading title="Websites and Technology Consulting">
        Reach your customers with a better website. Help your team with better
        systems. Our two branches bring focused expertise and practical support.
      </SectionHeading>
      <div className="section-cards grid md:grid-cols-2">
        <Reveal className="service-card-reveal flex">
          <article className="branch-link w-full flex flex-col ms-surface-feature border border-border bg-surface p-(--space-inset)">
            <p className="text-sm tracking-widest uppercase text-primary">
              Be understood online
            </p>
            <div className="mt-(--space-eyebrow) flex items-center gap-4">
              {logos.websites && (
                <Image
                  src={logos.websites.src}
                  width={logos.websites.width}
                  height={logos.websites.height}
                  alt=""
                  loading="lazy"
                  className="h-16 w-16 shrink-0 object-contain"
                />
              )}
              <h3 className="text-3xl font-medium">Motchi Websites</h3>
            </div>
            <p className="mt-(--space-copy) mb-(--space-related) max-w-2xl leading-relaxed text-muted">
              An affordable website shaped around your business, customers, and
              budget. We agree on what matters now, with maintenance options to
              keep supporting you after launch.
            </p>
            <p className="mb-(--space-action) text-sm text-primary">
              Business websites, booking, and integrations
            </p>
            <div className="mt-auto">
              <ButtonLink href={"/websites"}>
                Explore Motchi Websites
              </ButtonLink>
            </div>
          </article>
        </Reveal>
        <Reveal className="service-card-reveal flex">
          <article className="ms-surface-dark branch-link w-full flex flex-col ms-surface-feature border border-border p-(--space-inset)">
            <p className="text-sm tracking-widest uppercase text-accent">
              Put technology to work
            </p>
            <div className="mt-(--space-eyebrow) flex items-center gap-4">
              {logos.consulting && (
                <Image
                  src={logos.consulting.src}
                  width={logos.consulting.width}
                  height={logos.consulting.height}
                  alt=""
                  loading="lazy"
                  className="h-16 w-16 shrink-0 object-contain"
                />
              )}
              <h3 className="text-3xl font-medium">Motchi Consulting</h3>
            </div>
            <p className="mt-(--space-copy) mb-(--space-related) max-w-2xl leading-relaxed text-muted">
              When a process, platform, or technology decision is holding you
              back, we help you understand the options and put a practical plan
              to work.
            </p>
            <p className="mb-(--space-action) text-sm text-accent">
              AI, data, digital systems, and adoption
            </p>
            <div className="mt-auto">
              <ButtonLink href={"/consulting"} light>
                Explore Motchi Consulting
              </ButtonLink>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
