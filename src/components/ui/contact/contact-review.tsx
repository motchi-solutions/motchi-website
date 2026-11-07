import { formatPhone } from "./contact-phone.ts";
import type { ContactDraft } from "./contact-model.ts";
import styles from "./contact.module.css";
type ReviewRow = readonly [string, string | string[]];
export function ContactReview({
  draft,
  edit,
  disabled = false,
}: {
  draft: ContactDraft;
  edit: (step: number) => void;
  disabled?: boolean;
}) {
  const sections: { title: string; step: number; rows: ReviewRow[] }[] = [
    {
      title: "Selected services",
      step: 0,
      rows: [
        ["Areas", draft.services],
        ...draft.services
          .filter((service) => draft.details[service]?.length)
          .map((service): ReviewRow => [service, draft.details[service]]),
      ],
    },
    {
      title: "Your project",
      step: 1,
      rows: [
        ["Project / organization", draft.business],
        ["Project stage", draft.stage],
        ["Timeline", draft.timeline],
        ["Budget", draft.budget],
      ],
    },
    {
      title: "Contact and context",
      step: 2,
      rows: [
        ["Name", draft.name],
        ["Email", draft.email],
        ["Organization", draft.organization],
        ["Website", draft.website],
        [
          "Phone",
          draft.phone
            ? `+${draft.phoneCountryCode} ${formatPhone(draft.phoneCountryCode, draft.phone)}`
            : "",
        ],
        ["How you found us", draft.source],
        ["Anything else", draft.context],
      ],
    },
  ];
  return (
    <div className={styles.review}>
      {sections.map((section) => (
        <section
          className={styles.reviewSection}
          key={section.title}
          aria-labelledby={`review-section-${section.step}`}
        >
          <div className={styles.reviewHeading}>
            <h3 id={`review-section-${section.step}`}>{section.title}</h3>
            <button
              type="button"
              disabled={disabled}
              onClick={() => edit(section.step)}
              aria-label={`Edit ${section.title.toLowerCase()}`}
            >
              Edit
            </button>
          </div>
          <dl>
            {section.rows.map(([label, value]) => (
              <div className={styles.reviewRow} key={label}>
                <dt>{label}</dt>
                <dd>
                  {Array.isArray(value) && value.length > 0 ? (
                    <ul className={styles.reviewValues}>
                      {value.map((answer) => (
                        <li key={answer}>{answer}</li>
                      ))}
                    </ul>
                  ) : typeof value === "string" && value ? (
                    value
                  ) : (
                    <span className={styles.reviewMissing}>Not provided</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
