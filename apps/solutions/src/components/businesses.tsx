import styles from "./businesses.module.css";
import Image from "next/image";
import { logos } from "@motchi/brand";
import { getSites } from "@motchi/config/env";

import { ButtonLink, Reveal, Section, SectionHeading } from "@motchi/ui";
export function Businesses({
  textured = false,
  title = "Websites and Technology Consulting",
}: {
  textured?: boolean;
  title?: string;
}) {
  const family = getSites();
  return (
    <Section id="businesses" className={textured ? styles.textured : ""}>
      <SectionHeading eyebrow="Our Services" title={title}>
        Reach your customers with a better website. Help your team with better
        systems. Our two branches bring focused expertise and practical support.
      </SectionHeading>
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal className="service-card-reveal flex">
          <article className="branch-link w-full flex flex-col border border-border bg-surface p-7 sm:p-10">
            <p className="text-xs tracking-widest uppercase text-primary">
              01 / Be understood online
            </p>
            <div className="mt-8 flex items-center gap-5">
              {logos.websites && (
                <Image
                  src={logos.websites.src}
                  width={logos.websites.width}
                  height={logos.websites.height}
                  alt=""
                  loading="eager"
                  className="h-16 w-16 shrink-0 object-contain"
                />
              )}
              <h3 className="text-3xl font-medium">Motchi Websites</h3>
            </div>
            <p className="mt-5 mb-8 max-w-md leading-relaxed text-muted">
              An affordable website shaped around your business, customers, and
              budget. We agree on what matters now, with maintenance options to
              keep supporting you after launch.
            </p>
            <p className="mb-8 text-sm text-primary">
              Business websites · Booking · Integrations
            </p>
            <div className="mt-auto">
              <ButtonLink href={family.websites.url}>
                Explore Motchi Websites
              </ButtonLink>
            </div>
          </article>
        </Reveal>
        <Reveal className="service-card-reveal flex">
          <article className="branch-link w-full flex flex-col border border-secondary bg-secondary p-7 text-inverse sm:p-10">
            <p className="text-xs tracking-widest uppercase text-accent">
              02 / Put technology to work
            </p>
            <div className="mt-8 flex items-center gap-5">
              {logos.consulting && (
                <Image
                  src={logos.consulting.src}
                  width={logos.consulting.width}
                  height={logos.consulting.height}
                  alt=""
                  loading="eager"
                  className="h-16 w-16 shrink-0 object-contain"
                />
              )}
              <h3 className="text-3xl font-medium">Motchi Consulting</h3>
            </div>
            <p className="mt-5 mb-8 max-w-md leading-relaxed text-inverse/80">
              When a process, platform, or technology decision is holding you
              back, we help you understand the options and put a practical plan
              to work.
            </p>
            <p className="mb-8 text-sm text-accent">
              AI · Data · Digital systems · Adoption
            </p>
            <div className="mt-auto">
              <ButtonLink href={family.consulting.url} light>
                Explore Motchi Consulting
              </ButtonLink>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
