import { pageMetadata } from "@motchi/config/metadata";
import { AnimatedLink, ContactCTA, Eyebrow, Section } from "@motchi/ui";
import { AboutHero } from "@/components/about-hero";
import styles from "./about.module.css";
export const metadata = pageMetadata(
  "About",
  "Client-first technology, clear pricing, and products built for the community. Discover the mission and vision behind Motchi Solutions.",
  "/about",
);
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Section id="purpose">
        <div className={styles.purposeGrid}>
          <article
            id="mission"
            className={`${styles.purposeCard} ms-surface-feature border border-border bg-surface`}
          >
            <div className="section-introduction">
              <Eyebrow>Our Mission</Eyebrow>
              <h2 className="text-h2 font-medium tracking-tight">
                Make Good Technology Easier to Access
              </h2>
            </div>
            <div
              className={`${styles.prose} text-lg leading-relaxed text-muted`}
            >
              <p>
                We help people turn good ideas into useful technology, without
                making the process feel overwhelming.
              </p>
              <dl className={styles.points}>
                <div className={styles.point}>
                  <dt className="text-lg font-medium text-foreground">
                    Client-first partnership
                  </dt>
                  <dd>
                    We learn how your business works, give honest advice, and
                    support you after launch.
                  </dd>
                </div>
                <div className={styles.point}>
                  <dt className="text-lg font-medium text-foreground">
                    Transparent pricing
                  </dt>
                  <dd>
                    You know what is included, what it costs to run, and what
                    support involves before you commit.
                  </dd>
                </div>
                <div className={styles.point}>
                  <dt className="text-lg font-medium text-foreground">
                    Sustainable technology
                  </dt>
                  <dd>
                    We focus on what helps now and discuss changes before taking
                    on more work.
                  </dd>
                </div>
              </dl>
            </div>
          </article>
          <article
            id="vision"
            className={`${styles.purposeCard} ms-surface-feature ms-surface-dark border border-border`}
          >
            <div className="section-introduction">
              <Eyebrow light>Our Vision</Eyebrow>
              <h2 className="text-h2 font-medium tracking-tight">
                Technology That Puts People First
              </h2>
            </div>
            <div
              className={`${styles.prose} text-lg leading-relaxed text-muted`}
            >
              <p>
                We want technology to make everyday life better for the people
                and communities who use it.
              </p>
              <dl className={styles.points}>
                <div className={styles.point}>
                  <dt className="text-lg font-medium text-inverse">
                    Useful products
                  </dt>
                  <dd>
                    We build tools that help people connect, solve problems, or
                    enjoy themselves.
                  </dd>
                </div>
                <div className={styles.point}>
                  <dt className="text-lg font-medium text-inverse">
                    Privacy and safety
                  </dt>
                  <dd>
                    We protect personal information and build safety into every
                    product from the start.
                  </dd>
                </div>
                <div className={styles.point}>
                  <dt className="text-lg font-medium text-inverse">
                    Welcoming experiences
                  </dt>
                  <dd>
                    Our products should feel clear, inclusive, and respectful of
                    people's choices.
                  </dd>
                </div>
              </dl>
            </div>
          </article>
        </div>
      </Section>
      <Section id="partnership" className="bg-secondary text-inverse">
        <div className="section-layout grid items-start lg:grid-cols-2">
          <div className="section-introduction">
            <h2 className="text-h2 font-medium tracking-tight">
              Working Together on Your Goals
            </h2>
            <p className="mt-6 text-sm text-accent">
              Based in Toronto. Working with businesses globally.
            </p>
          </div>
          <div
            className={`${styles.prose} text-lg leading-relaxed text-inverse/85`}
          >
            <p>
              We want to support businesses we believe in and people who care
              about what they do. We take time to understand what you're
              building, what gets in your way, and where we can help.
            </p>
            <p>
              We see a partnership as a chance to grow together. You bring
              knowledge of your business; we bring practical technology support.
              Through useful work, honest conversations, and shared goals, we
              want to earn a place in your corner for the long run.
            </p>
            <AnimatedLink href="/services" arrow className="text-accent">
              See How We Can Help
            </AnimatedLink>
          </div>
        </div>
      </Section>
      <ContactCTA title="What Would You Like to Make Easier?" />
    </>
  );
}
