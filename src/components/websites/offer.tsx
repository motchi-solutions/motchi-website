import { ButtonLink, Section, SectionHeading } from "../ui/primitives.tsx";
import { websiteStarter, websiteBusiness } from "../../lib/config/sites.ts";
import {
  LuCalendarClock,
  LuFileCheck,
  LuReceipt,
  LuWrench,
} from "react-icons/lu";
import styles from "./landing.module.css";

const tiers = [
  {
    name: "Starter",
    price: websiteStarter.price,
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
    price: websiteBusiness.price,
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
    name: "Advanced",
    price: null,
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
            <div className={styles.pricingName}>
              <h3>{tier.name}</h3>
              {tier.name === "Business" && (
                <span className={styles.pricingLabel}>Recommended</span>
              )}
            </div>
            <p className={styles.pricingPrice}>
              {tier.price ? (
                <>
                  <span className={styles.priceLabel}>From</span>
                  <span className={styles.priceAmount}>
                    {tier.price.replace("CAD ", "")}
                  </span>
                  <span className={styles.priceLabel}>CAD</span>
                </>
              ) : (
                <span className={styles.priceAmount}>Custom quote</span>
              )}
            </p>
            <p className={styles.pricingDescription}>{tier.description}</p>
            <p className={styles.pricingIncludes}>{tier.includes}</p>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <ButtonLink
              // The enquiry below picks up the tier; see ServiceEnquiry.
              href="#enquiry"
              data-enquiry-tier={tier.name}
              secondary={tier.name !== "Business"}
            >
              {tier.action}
            </ButtonLink>
          </article>
        ))}
      </div>
      <aside aria-labelledby="maintenance-heading" className={styles.support}>
        <div className={styles.supportIntro}>
          <div className={styles.supportHeading}>
            <LuWrench aria-hidden="true" />
            <h3 id="maintenance-heading">Support After Launch</h3>
          </div>
          <p>Content changes, fixes, upgrades, backups, and more.</p>
        </div>
        <dl className={styles.supportOffers}>
          <div className={styles.supportOffer}>
            <dt>
              <strong>
                {websiteStarter.includedSecurityUpdateYears} year free
              </strong>
              Security updates
            </dt>
            <dd>Every tier</dd>
          </div>
          <div className={styles.supportOffer}>
            <dt>
              <strong>{websiteBusiness.includedCareMonths} months free</strong>
              Maintenance
            </dt>
            <dd>Business and Advanced</dd>
          </div>
        </dl>
      </aside>
      <ul className={styles.pricingNotes}>
        <li>
          <LuReceipt aria-hidden="true" />
          Prices in CAD. Taxes, domain, and hosting fees are extra.
        </li>
        <li>
          <LuCalendarClock aria-hidden="true" />
          Maintenance after the included period is quoted separately.
        </li>
        <li>
          <LuFileCheck aria-hidden="true" />
          {websiteStarter.terms}
        </li>
      </ul>
    </Section>
  );
}
