import {
  contactOptionLabel,
  getContactConfiguration,
} from "./contact-config.ts";
import { formatInternationalPhone } from "./contact-phone.ts";
import type { ContactDraft } from "./contact-model.ts";
import styles from "./contact.module.css";
// Label, answer, and the id of the field that changes it.
type ReviewRow = readonly [string, string | string[], string];
export function ContactReview({
  draft,
  edit,
  disabled = false,
}: {
  draft: ContactDraft;
  edit: (step: number, field: string) => void;
  disabled?: boolean;
}) {
  const { services } = getContactConfiguration(draft.enquiryType || undefined);
  const sections: { title: string; step: number; rows: ReviewRow[] }[] = [
    {
      title:
        draft.enquiryType === "products"
          ? "Your product question"
          : "Selected services",
      step: 0,
      rows: [
        [
          "Service",
          draft.enquiryType === "websites"
            ? "Motchi Websites"
            : draft.enquiryType === "products"
              ? "Motchi Products"
              : "Motchi Consulting",
          "enquiryType",
        ],
        ...(draft.enquiryType === "websites"
          ? [["Website tier", draft.websiteTier, "websiteTier"] as ReviewRow]
          : []),
        ...(draft.enquiryType === "products" && draft.productName
          ? [["Product", draft.productName, "productName"] as ReviewRow]
          : []),
        [
          draft.enquiryType === "products" ? "Questions" : "Areas",
          draft.services,
          "services",
        ],
        ...draft.services
          .filter((service) => draft.details[service]?.length)
          .map((service): ReviewRow => [
            service,
            draft.details[service],
            `details-${services.indexOf(service)}`,
          ]),
      ],
    },
    {
      title: "Your project",
      step: 1,
      rows: [
        ["Project / organization", draft.business, "business"],
        ["Project stage", draft.stage, "stage"],
        ["Timeline", draft.timeline, "timeline"],
        ["Budget", draft.budget, "budget"],
      ],
    },
    {
      title: "Contact and context",
      step: 2,
      rows: [
        ["Name", draft.name, "name"],
        ["Email", draft.email, "email"],
        ["Organization", draft.organization, "organization"],
        ["Website", draft.website, "website"],
        [
          "Phone",
          formatInternationalPhone(draft.phoneCountryCode, draft.phone),
          "phone",
        ],
        ["How you found us", draft.source, "source"],
        ["Anything else", draft.context, "context"],
      ],
    },
  ];
  return (
    <div className={styles.review}>
      {sections
        .filter(
          (section) => draft.enquiryType !== "products" || section.step !== 1,
        )
        .map((section) => (
          <section
            className={styles.reviewSection}
            key={section.title}
            aria-labelledby={`review-section-${section.step}`}
          >
            <div className={styles.reviewHeading}>
              <h3 id={`review-section-${section.step}`}>{section.title}</h3>
            </div>
            <dl>
              {section.rows
                .filter(
                  ([label]) =>
                    draft.enquiryType !== "products" ||
                    section.step !== 2 ||
                    ["Name", "Email", "Anything else"].includes(label),
                )
                .map(([label, value, field]) => (
                  <div className={styles.reviewRow} key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {Array.isArray(value) && value.length > 0 ? (
                        <ul className={styles.reviewValues}>
                          {value.map((answer) => (
                            <li key={answer}>{contactOptionLabel(answer)}</li>
                          ))}
                        </ul>
                      ) : typeof value === "string" && value ? (
                        section.step === 2 ? (
                          value
                        ) : (
                          contactOptionLabel(value)
                        )
                      ) : (
                        <span className={styles.reviewMissing}>
                          Not provided
                        </span>
                      )}
                    </dd>
                    <button
                      type="button"
                      className={styles.reviewEdit}
                      disabled={disabled}
                      onClick={() => edit(section.step, field)}
                      aria-label={`Edit ${label.toLowerCase()}`}
                    >
                      Edit
                    </button>
                  </div>
                ))}
            </dl>
          </section>
        ))}
    </div>
  );
}
