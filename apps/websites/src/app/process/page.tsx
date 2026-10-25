import { pageMetadata } from "@motchi/config/metadata";
import {
  ButtonLink,
  ContactCTA,
  PageHero,
  Section,
  SectionHeading,
} from "@motchi/ui";
import { Process } from "@/components/process";
export const metadata = pageMetadata(
  "Our Process",
  "You know what happens next, where your input matters, and what is included. We agree on milestones around the work your website actually needs.",
  "/process",
);
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Our Process"
        title="How We Build Your Website"
        actions={<ButtonLink href="/contact">Discuss Your Website</ButtonLink>}
      >
        A clear, collaborative process for planning, building, and launching
        your website, with agreed support after it goes live.
      </PageHero>
      <Process />
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Before We Begin"
          title="Your Scope, Responsibilities, and Support"
        >
          We agree on what your website needs, who does what, and what support
          comes after launch.
        </SectionHeading>
        <dl className="grid gap-8 md:grid-cols-3">
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
      <ContactCTA title="Let's Plan Your Website" />
    </>
  );
}
