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
        <div className="about-summary grid gap-8 lg:grid-cols-2">
          <div className="about-summary-heading">
            <Eyebrow>About Motchi</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              Toronto Roots.
              <br />
              <span className="font-display italic text-primary">
                A Wider Perspective.
              </span>
            </h2>
          </div>
          <div className="about-summary-content">
            <p className="max-w-lg text-body-lg leading-relaxed text-muted">
              We make useful technology affordable and accessible. Based in
              Toronto and working globally, we bring advice, implementation, and
              continued support into one practical relationship.
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
