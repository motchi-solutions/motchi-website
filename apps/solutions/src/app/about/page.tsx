import { pageMetadata } from "@motchi/config/metadata";
import { AnimatedLink, ContactCTA, Eyebrow, Section } from "@motchi/ui";
import { AboutHero } from "@/components/about-hero";
import { LuWallet, LuClock3, LuShieldCheck } from "react-icons/lu";
import styles from "./about.module.css";
export const metadata = pageMetadata(
  "About",
  "Affordable technology, less repetitive work, and a supportive partnership. Learn why Motchi Solutions helps businesses make room for better things.",
  "/about",
);
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Our Mission</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              Useful Technology, Within Reach
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              We want technology to be affordable and easy to use, even if you
              don't have a large budget or your own technical team. A small,
              thoughtful improvement can make a real difference to a working
              day.
            </p>
            <p>
              That might mean a responsive website that helps customers find
              you, tools that work together, or a simpler way to handle a task
              you repeat every week. We start with the problem, then agree on a
              solution and costs that fit.
            </p>
          </div>
        </div>
        <div className={styles.principles}>
          {(
            [
              [
                "Spend Where It Helps",
                "Build what you need now. We look at your existing tools first and explain the costs of building, running, and maintaining the solution.",
                LuWallet,
              ],
              [
                "Give Time Back to People",
                "Reduce repetitive admin so your team can focus on customers, solve better problems, and spend more time on the work that matters to them.",
                LuClock3,
              ],
              [
                "Keep People in Control",
                "Technology should support your team. We explain the tools, help people get comfortable, and consider data security when choosing how things work.",
                LuShieldCheck,
              ],
            ] as const
          ).map(([title, description, Icon], index) => (
            <article key={title} className={styles.principle}>
              <div className={styles.marker} aria-hidden="true">
                <span className={styles.number}>0{index + 1}</span>
                <span className={styles.icon}>
                  <Icon />
                </span>
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{description}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="bg-secondary text-inverse">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow light>Better Together</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              Your Progress Matters to Us
            </h2>
            <p className="mt-6 text-sm text-accent">
              Based in Toronto. Working with businesses globally.
            </p>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-inverse/85">
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
