import { ButtonLink, Section, SectionHeading } from "../ui/primitives.tsx";
import { websiteStarter, websiteBusiness } from "../../lib/config/sites.ts";
import { LuWrench } from "react-icons/lu";
import styles from "./landing.module.css";

const tiers = [
  {
    name: "Starter",
    price: `From ${websiteStarter.price}`,
    description:
      "Introduce your business and give visitors a simple way to get in touch.",
    includes: "Built with your supplied text and images.",
    features: [
      "1-3 responsive pages",
      "Accessibility-first design",
      "A simple contact form",
      `${websiteStarter.includedSecurityUpdateYears} year of free security updates`,
    ],
    action: "Start a Project",
  },
  {
    name: "Business",
    price: `From ${websiteBusiness.price}`,
    description:
      "For a growing business ready to connect its website and tools.",
    includes: "Everything in Starter, plus:",
    features: [
      "Tailored page layouts",
      "Booking, reservations, or other tool integrations",
      `${websiteBusiness.includedCareMonths} months of free maintenance included`,
      "SEO setup",
    ],
    action: "Discuss Your Website",
  },
  {
    name: "Advanced / Enterprise",
    price: "Custom quote",
    description:
      "For custom applications and the systems behind your business.",
    includes: "Everything in Business, plus custom scope:",
    features: [
      "Full-stack development and custom frontend design",
      "Admin pages to manage your platform",
      "Point-of-sale and other tool integrations",
      "Database design and built-in analytics",
      "AI setup, assistants, and chatbots",
    ],
    action: "Plan a Custom Build",
  },
];

export function WebsiteOffer() {
  return (
    <Section id="pricing" className={styles.offer}>
      <SectionHeading wide title="Pricing & Maintenance">
        Start with the essentials, then add what your business needs. Each tier
        builds on the one before it.
      </SectionHeading>
      <div className={styles.pricingGrid}>
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={styles.pricingCard}
            data-recommended={tier.name === "Business"}
          >
            {tier.name === "Business" && (
              <span className={styles.pricingLabel}>Most Popular</span>
            )}
            <h3>{tier.name}</h3>
            <p className={styles.pricingPrice}>{tier.price}</p>
            <p className={styles.pricingDescription}>{tier.description}</p>
            <p className={styles.pricingIncludes}>{tier.includes}</p>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <ButtonLink
              href={`/contact?branch=websites&tier=${encodeURIComponent(tier.name)}`}
              secondary={tier.name !== "Business"}
            >
              {tier.action}
            </ButtonLink>
          </article>
        ))}
      </div>
      <aside
        aria-labelledby="maintenance-heading"
        className="mt-4 grid gap-5 rounded-lg border border-border bg-surface p-5 sm:p-6 lg:grid-cols-3 lg:items-center"
      >
        <div className="min-w-0 lg:col-span-2">
          <div className="flex items-center gap-3">
            <LuWrench
              aria-hidden="true"
              className="h-6 w-6 shrink-0 text-primary"
            />
            <h3
              id="maintenance-heading"
              className="text-xl font-medium tracking-tight"
            >
              Support After Launch
            </h3>
          </div>
          <p className="mt-2 text-body leading-relaxed text-muted">
            Maintenance includes small content and layout changes, minor fixes,
            package upgrades, backups, domain and hosting upkeep, routine
            website checks, and more.
          </p>
          <p className="mt-2 text-small font-medium leading-relaxed text-primary">
            Every tier includes {websiteStarter.includedSecurityUpdateYears}{" "}
            year of free security updates.
          </p>
        </div>
        <div className="border-t border-border pt-6 lg:border-t-0 lg:border-s lg:pt-0 lg:ps-8">
          <p className="text-3xl font-medium tracking-tight text-primary">
            {websiteBusiness.includedCareMonths} months free
          </p>
          <p className="mt-2 text-body leading-relaxed text-muted">
            For Business / Advanced tiers.
          </p>
        </div>
      </aside>
      <div className={styles.pricingTerms}>
        <p>{websiteStarter.terms}</p>
        <p>
          Prices are in CAD. Taxes, domain registration, and hosting fees are
          extra. Maintenance after the included periods is quoted separately.
        </p>
      </div>
    </Section>
  );
}
