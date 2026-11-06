import "@/components/home.css";
import { AnimatedLink, ContactCTA, Section } from "@motchi/ui";
import type { Metadata } from "next";
import { Approach } from "@/components/approach";
import { Businesses } from "@/components/businesses";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <div className="solutions-home">
      <Hero />
      <Businesses />
      <Approach />
      <Products />
      <Section
        id="about"
        className="about-summary-section border-t border-border"
      >
        <div className="about-summary section-layout grid lg:grid-cols-2">
          <div className="about-summary-heading section-introduction">
            <h2 className="text-h2 font-medium tracking-tight">
              About Motchi Solutions
            </h2>
          </div>
          <div className="about-summary-content">
            <p className="text-body-lg leading-relaxed text-muted">
              We build technology around people. That means working alongside
              your business with clear, accessible pricing, and creating
              community products with care for the people using them.
            </p>
            <AnimatedLink href="/about" arrow className="min-h-12 text-primary">
              Learn More About Motchi
            </AnimatedLink>
          </div>
        </div>
      </Section>
      <ContactCTA />
    </div>
  );
}
