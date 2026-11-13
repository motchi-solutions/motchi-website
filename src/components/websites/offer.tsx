import { ButtonLink, Section, SectionHeading } from "../ui/primitives.tsx";
import { tiers } from "../../content/websites/pricing.ts";
import { websiteBusiness, websiteStarter } from "../../lib/config/sites.ts";
import {
  LuCalendarClock,
  LuFileCheck,
  LuReceipt,
  LuWrench,
} from "react-icons/lu";
import styles from "./landing.module.css";

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
