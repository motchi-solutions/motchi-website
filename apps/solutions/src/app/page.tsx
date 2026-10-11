import { ContactCTA, Eyebrow, Section, SectionHeading } from "@motchi/ui";
import type { Metadata } from "next";
import { Approach } from "@/components/approach";
import { Businesses } from "@/components/businesses";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <Hero />
      <Section id="what-we-do" className="border-y border-border">
        <div className="grid gap-8 lg:grid-cols-3">
          <Eyebrow>What we do</Eyebrow>
          <div className="lg:col-span-2">
            <h2 className="text-section font-medium tracking-tight">
              A technology partner,
              <br />
              with your business in mind.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              Motchi connects the business problem with the right technology.
              That might mean a better website, a simpler workflow, a useful
              data platform, or a custom tool. We help you make the decision and
              follow it through.
            </p>
          </div>
        </div>
      </Section>
      <Businesses />
      <Products />
      <Approach />
      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Why Motchi"
          title="Good technology should feel manageable."
        />
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {[
            [
              "Appropriate, not excessive",
              "Choose what fits your needs. Keep complexity and cost proportionate to the problem.",
            ],
            [
              "Clear conversations",
              "Understand the scope, the trade-offs, and the next step without translating technical language.",
            ],
            [
              "Support beyond delivery",
              "Have a partner available for adoption, maintenance, and the improvements that follow.",
            ],
          ].map(([title, description]) => (
            <article key={title} className="border-t border-border pt-6">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{description}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section id="about">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>About Motchi</Eyebrow>
            <h2 className="text-section font-medium tracking-tight">
              Capable technology.
              <br />
              <span className="font-display italic text-primary">
                Approachable people.
              </span>
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted">
            <p>
              Motchi Solutions exists to make technology more accessible to
              businesses. We bring practical thinking, implementation, and
              continued support into one relationship.
            </p>
            <p>
              We’re proudly Canadian and work with businesses globally. Wherever
              you are, the starting point is the same: understanding what your
              business needs.
            </p>
          </div>
        </div>
      </Section>
      <ContactCTA />
    </>
  );
}
