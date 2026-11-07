import {
  canVisitContactStep,
  validateContact,
  type ContactDraft,
} from "./contact-model.ts";
import styles from "./contact.module.css";
export const contactSteps = ["Services", "Project", "Contact", "Review"];
export function ContactProgress({
  draft,
  step,
  go,
  disabled = false,
}: {
  draft: ContactDraft;
  step: number;
  go: (step: number) => void;
  disabled?: boolean;
}) {
  return (
    <nav aria-label="Enquiry progress" className={styles.progressNav}>
      <ol className={styles.progress}>
        {contactSteps.map((label, index) => {
          const available = canVisitContactStep(draft, step, index);
          const complete =
            index < 3 &&
            Object.keys(validateContact(draft, index)).length === 0;
          return (
            <li key={label} data-complete={complete}>
              <button
                type="button"
                disabled={disabled}
                aria-current={index === step ? "step" : undefined}
                aria-describedby={
                  !available ? "contact-progress-hint" : undefined
                }
                onClick={() => go(index)}
              >
                <span aria-hidden="true">
                  <span className={styles.stepNumberGlyph}>
                    {complete && index !== step ? "✓" : index + 1}
                  </span>
                </span>
                <span>
                  {label}
                  {index === 1 && (
                    <span className={styles.projectInfoSuffix}> Info</span>
                  )}
                </span>
                <span className="sr-only">{complete ? " (complete)" : ""}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
