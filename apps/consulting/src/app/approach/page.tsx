import { pageMetadata } from "@motchi/config/metadata";
import { ButtonLink, ContactCTA, PageHero, Section } from "@motchi/ui";
import { Approach } from "@/components/approach";
export const metadata = pageMetadata(
  "Our Approach",
  "An implementation-focused relationship, with clear responsibilities and support through the stages your business needs.",
  "/approach",
);
export default function Page() {
  return (
    <>
      <PageHero
        title="How We Plan and Deliver Your Project"
        actions={<ButtonLink href="/contact">Start a Conversation</ButtonLink>}
      >
        Understand the problem. Build the solution. Help your team use it. We
        work with you through implementation, adoption, and agreed ongoing
        support.
      </PageHero>
      <Approach />
      <Section className="border-t border-border">
        <div className="section-layout grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-h2 font-medium tracking-tight">
              Decisions and responsibilities
            </h2>
            <p className="mt-5 max-w-lg text-body-lg leading-relaxed text-muted">
              We clarify decision-makers, constraints, and responsibilities
              together. Scope and support are agreed for each engagement.
            </p>
          </div>
          <dl className="divide-y divide-border border-t border-border">
            <div className="py-6">
              <dt className="text-h3 font-medium">Goals and constraints</dt>
              <dd className="mt-3 leading-relaxed text-muted">
                The current process, what is getting in the way, and what a
                useful improvement would look like.
              </dd>
            </div>
            <div className="py-6">
              <dt className="text-h3 font-medium">
                Access, approvals, and ownership
              </dt>
              <dd className="mt-3 leading-relaxed text-muted">
                The people, access, and approvals needed to move from a
                recommendation to implementation.
              </dd>
            </div>
            <div className="py-6">
              <dt className="text-h3 font-medium">
                Handover and ongoing support
              </dt>
              <dd className="mt-3 leading-relaxed text-muted">
                An agreed handover and support arrangement, with room to review
                what needs improving.
              </dd>
            </div>
          </dl>
        </div>
      </Section>
      <ContactCTA
        action="Start a Conversation"
        title="Let's Plan Your Next Step"
      />
    </>
  );
}
