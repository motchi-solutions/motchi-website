import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA, PageHero, Section, SectionHeading } from "@motchi/ui";
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
        title="Clear Decisions, from Brief to Launch"
      >
        You know what happens next, where your input matters, and what is
        included. We agree on milestones around the work your website actually
        needs.
      </PageHero>
      <Process />
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Before We Begin"
          title="A Shared Definition of Ready"
        >
          A clear brief keeps the work proportionate. These are the decisions we
          make together.
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
      <ContactCTA title="Let’s Discuss Your Website" />
    </>
  );
}
