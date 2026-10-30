import { AnimatedLink, ContactCTA, Eyebrow, Section } from "@motchi/ui";
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
      <Businesses />
      <Products />
      <Approach />
      <Section
        id="about"
        className="about-summary-section border-t border-border"
      >
        <div className="about-summary section-layout grid lg:grid-cols-2">
          <div className="about-summary-heading section-introduction">
            <Eyebrow>About Motchi</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              Practical Technology.
              <br />
              <span className="font-display italic text-primary">
                Support Within Reach.
              </span>
            </h2>
          </div>
          <div className="about-summary-content">
            <p className="max-w-lg text-body-lg leading-relaxed text-muted">
              We make useful technology accessible to businesses of different
              sizes. Clear advice, help building the solution, and ongoing
              support make it easier to choose what fits your needs and budget.
            </p>
            <AnimatedLink
              href="/about"
              arrow
              className="mt-6 min-h-12 text-primary"
            >
              Learn More About Motchi
            </AnimatedLink>
          </div>
        </div>
      </Section>
      <ContactCTA />
    </>
  );
}
