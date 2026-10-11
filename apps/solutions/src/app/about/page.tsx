import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA, Eyebrow, PageHero, Section } from "@motchi/ui";
export const metadata = pageMetadata(
  "About Motchi",
  "Technology made affordable and accessible, with practical advice, implementation, and continued support from Toronto to businesses globally.",
  "/about",
);
export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Motchi" title="Technology with People in Mind">
        We make technology easier to choose, easier to use, and easier to
        manage. The business comes first.
      </PageHero>
      <Section className="bg-secondary text-inverse">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow light>Why Motchi</Eyebrow>
            <h2 className="max-w-md text-h2 font-medium tracking-tight">
              Less to Manage.
              <br />
              <span className="font-display italic text-accent">
                More Room to Work.
              </span>
            </h2>
          </div>
          <ol className="space-y-8">
            {[
              [
                "Keep It Proportionate",
                "Choose technology that earns its place. Scope and cost should make sense for the business, not just the technical wish list.",
              ],
              [
                "Keep the Conversation Clear",
                "Know what’s being built, why a decision matters, and what happens next. Ask questions without needing to learn the jargon.",
              ],
              [
                "Keep Support Within Reach",
                "Have someone to turn to during adoption and after launch. A working solution needs people who can keep it useful.",
              ],
            ].map(([title, description], i) => (
              <li key={title} className="flex gap-5">
                <span className="pt-1 text-xs text-accent">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-3 max-w-lg leading-relaxed text-inverse/75">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>About Motchi</Eyebrow>
            <h2 className="text-h2 font-medium tracking-tight">
              Technology Is Our Work.
              <br />
              <span className="font-display italic text-primary">
                Your Business Is the Point.
              </span>
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted">
            <p>
              Motchi Solutions brings advice, design, development, and ongoing
              support into one practical relationship. Our purpose is to make
              useful technology affordable and accessible to businesses.
            </p>
            <p>
              We’re based in Toronto, proudly Canadian, and work with businesses
              globally. Wherever you’re starting, we start by listening.
            </p>
          </div>
        </div>
      </Section>
      <ContactCTA />
    </>
  );
}
