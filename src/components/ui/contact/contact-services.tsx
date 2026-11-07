"use client";
import type { Branch } from "../../../lib/brand.ts";
import { getContactConfiguration } from "./contact-config.ts";
import type { ContactDraft } from "./contact-model.ts";
import { ContactOptionGroup } from "./contact-controls.tsx";
import { ContactDisclosure } from "./contact-disclosure.tsx";
import styles from "./contact.module.css";

export function ContactServices({
  branch,
  draft,
  update,
  error,
  onBlur,
  announce,
  detailsOpen = false,
}: {
  branch: Branch;
  draft: ContactDraft;
  update: <K extends keyof ContactDraft>(
    key: K,
    value: ContactDraft[K],
  ) => void;
  error?: string;
  onBlur?: () => void;
  announce?: (message: string) => void;
  detailsOpen?: boolean;
}) {
  const { services, serviceDescriptions, followUps } =
    getContactConfiguration(branch);
  return (
    <>
      <ContactOptionGroup
        id="services"
        onBlur={onBlur}
        label="Please select your preferred services"
        options={services}
        hint="You can choose more than one. If you're unsure, please choose Not Sure Yet."
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
          <ContactDisclosure
            title="Would you like to share more?"
            defaultOpen={detailsOpen}
          >
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
                      <h4 className={styles.serviceDetailTitle}>{service}</h4>
                      <p className={styles.detailDescription}>
                        {serviceDescriptions[service]}
                      </p>
                      <div className={styles.reveal}>
                        <ContactOptionGroup
                          id={`details-${services.indexOf(service)}`}
                          label="What would you like help with?"
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
                </div>
              ))}
          </ContactDisclosure>
        </div>
      </section>
    </>
  );
}
