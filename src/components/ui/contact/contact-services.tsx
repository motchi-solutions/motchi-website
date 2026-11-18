"use client";
import type { Branch } from "../../../lib/brand.ts";
import {
  websiteTiers,
  productNames,
  getContactConfiguration,
} from "./contact-config.ts";
import type { ContactDraft } from "./contact-model.ts";
import { ContactOptionGroup } from "./contact-controls.tsx";
import { ContactDisclosure } from "./contact-disclosure.tsx";
import { ComparePricingLink } from "./compare-pricing-link.tsx";
import styles from "./contact.module.css";

export function ContactServices({
  branch,
  draft,
  update,
  error,
  onBlur,
  announce,
  detailsOpen = false,
  pricingHref = "/websites#pricing",
}: {
  branch: Branch | "products";
  draft: ContactDraft;
  update: <K extends keyof ContactDraft>(
    key: K,
    value: ContactDraft[K],
  ) => void;
  error?: string;
  onBlur?: () => void;
  announce?: (message: string) => void;
  detailsOpen?: boolean;
  pricingHref?: string;
}) {
  const { services, serviceDescriptions, followUps } =
    getContactConfiguration(branch);
  return (
    <div className={styles.serviceQuestions}>
      {branch === "websites" && (
        <div>
          <ContactOptionGroup
            id="websiteTier"
            label="Website tier"
            options={websiteTiers}
            value={draft.websiteTier ? [draft.websiteTier] : []}
            onChange={(value) => update("websiteTier", value[0])}
            action={<ComparePricingLink href={pricingHref} />}
          />
        </div>
      )}
      {branch === "products" && (
        <ContactOptionGroup
          id="productName"
          label="Product"
          options={productNames}
          value={draft.productName ? [draft.productName] : []}
          onChange={(value) => update("productName", value[0])}
        />
      )}
      <div>
        <ContactOptionGroup
          id="services"
          onBlur={onBlur}
          label={
            branch === "products"
              ? "What would you like to discuss?"
              : "What would you like help with?"
          }
          options={services}
          value={draft.services}
          multiple
          required
          error={error}
          onChange={(value) => {
            const added = value.find(
              (service) => !draft.services.includes(service),
            );
            const removed = draft.services.find(
              (service) => !value.includes(service),
            );
            announce?.(
              added && followUps[added]
                ? `Optional details for ${added} available below.`
                : removed && followUps[removed]
                  ? `Questions for ${removed} removed.`
                  : "",
            );
            update("services", value);
          }}
        />
        <section
          className={styles.conditional}
          data-open={draft.services.some((service) => followUps[service])}
          aria-hidden={!draft.services.some((service) => followUps[service])}
          inert={!draft.services.some((service) => followUps[service])}
          aria-label="Optional service details"
        >
          <div className={styles.conditionalClip}>
            <div className={styles.serviceDetailsContent}>
              <ContactDisclosure title="More details" defaultOpen={detailsOpen}>
                {services
                  .filter((service) => followUps[service])
                  .map((service) => (
                    <div
                      className={styles.conditional}
                      key={service}
                      data-open={draft.services.includes(service)}
                      aria-hidden={!draft.services.includes(service)}
                      inert={!draft.services.includes(service)}
                    >
                      <div className={styles.conditionalClip}>
                        <div className={styles.serviceDetailGroup}>
                          <ContactOptionGroup
                            id={`details-${services.indexOf(service)}`}
                            label={service}
                            hint={serviceDescriptions[service]}
                            showRequirement={false}
                            options={followUps[service]}
                            value={draft.details[service] ?? []}
                            multiple
                            onChange={(value) =>
                              update("details", {
                                ...draft.details,
                                [service]: value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </ContactDisclosure>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
