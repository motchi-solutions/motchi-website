"use client";

/* The parts of the Contact form around the steps: the error reminders, the
   saved-draft prompt and controls, and the navigation buttons. They render
   only; ContactExperience owns the state. */

import type { Ref } from "react";
import { contactEmail } from "../../../lib/config/sites.ts";
import { InfoTip } from "../info-tip.tsx";
import { Arrow } from "../primitives.tsx";
import type { ContactDraft, ContactErrors } from "./contact-model.ts";
import styles from "./contact.module.css";

export const errorLabels: Partial<Record<keyof ContactDraft, string>> = {
  enquiryType: "Enquiry type",
  services: "Preferred services",
  business: "Project or organization",
  stage: "Project stage",
  timeline: "Start time",
  name: "Name",
  email: "Email",
  website: "Website",
  phone: "Phone number",
  phoneCountryCode: "Country code",
  context: "Additional details",
};

// Links in the error lists jump to the first option of a group, or the field.
export function errorTarget(key: string) {
  if (
    ["enquiryType", "services", "business", "stage", "timeline"].includes(key)
  )
    return `#${key}-0`;
  return key === "phoneCountryCode" ? "#phone-country-code" : `#${key}`;
}

/* Wide screens: a side rail listing what still needs an answer. Items fade
   out as they are fixed; resolved ones are inert so they leave the tab order.
   The error-summary pattern follows GOV.UK and WCAG 3.3.1 (Error
   Identification). */
export function ReminderRail({
  visible,
  errors,
  ref,
}: {
  visible: boolean;
  errors: ContactErrors;
  ref: Ref<HTMLDivElement>;
}) {
  return (
    <aside
      className={styles.reminderRail}
      aria-label="Incomplete answers"
      aria-hidden={!visible}
      inert={!visible}
    >
      <div ref={ref} tabIndex={-1} className={styles.reminderCard}>
        <p className={styles.reminderTitle}>Please complete these answers</p>
        <ul>
          {Object.entries(errorLabels).map(([key, label]) => {
            const resolved = !errors[key as keyof ContactDraft];
            return (
              <li
                key={key}
                className={styles.reminderItem}
                data-resolved={resolved}
                aria-hidden={resolved}
                inert={resolved}
              >
                <div>
                  <a href={errorTarget(key)}>{label}</a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

// Narrower screens: the same summary sits inside the step.
export function ErrorSummary({
  keys,
  ref,
}: {
  keys: string[];
  ref: Ref<HTMLDivElement>;
}) {
  if (!keys.length) return null;
  return (
    // Not a live region: Continue already moves focus to the first answer,
    // which reads its own error. Announcing this too repeats everything.
    <div ref={ref} tabIndex={-1} className={styles.errorSummary}>
      <h3>Please check these answers</h3>
      <ul>
        {keys.map((key) => (
          <li key={key}>
            <a href={errorTarget(key)}>
              {errorLabels[key as keyof ContactDraft] ?? key}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Shown instead of the form when this browser holds a saved draft.
export function ResumePrompt({
  onContinue,
  onRestart,
  clearFailed,
}: {
  onContinue: () => void;
  onRestart: () => void;
  clearFailed: boolean;
}) {
  return (
    <section className={styles.draftPrompt} aria-labelledby="resume-heading">
      <h2 id="resume-heading">Continue your contact form</h2>
      <p>
        You chose to save your progress. We've kept your answers so you can pick
        up where you left off.
      </p>
      <div className={styles.draftActions}>
        <button type="button" className={styles.primary} onClick={onContinue}>
          Continue form
        </button>
        <button
          type="button"
          onClick={onRestart}
          aria-describedby="replace-draft-note"
        >
          Start a new form
        </button>
      </div>
      {clearFailed && (
        <p role="alert">
          Your saved draft could not be cleared. Please check your browser
          storage settings and try again.
        </p>
      )}
      <p id="replace-draft-note" className={styles.draftRestartNote}>
        Starting a new form will replace your saved answers.
      </p>
    </section>
  );
}

const saveLabels = {
  saving: "Saving...",
  saved: "Saved",
  error: "Could not save",
} as Record<string, string>;

/* Saving is opt-in: nothing is stored unless the person ticks the box, and
   the draft lives only in this browser. */
export function DraftControls({
  savingEnabled,
  saveState,
  canClear,
  confirmClear,
  disabled,
  clearButton,
  onToggleSaving,
  onToggleConfirm,
  onClear,
  onKeep,
}: {
  savingEnabled: boolean;
  saveState: string;
  canClear: boolean;
  confirmClear: boolean;
  disabled: boolean;
  clearButton: Ref<HTMLButtonElement>;
  onToggleSaving: (enabled: boolean) => void;
  onToggleConfirm: () => void;
  onClear: () => void;
  onKeep: () => void;
}) {
  return (
    <>
      <div className={styles.actionDetails}>
        <div className={styles.saveCopy}>
          <div className={styles.draftHeading}>
            <div className={styles.savePreferenceGroup}>
              <label className={styles.savePreference}>
                <input
                  id="save-contact-draft"
                  name="saveDraft"
                  type="checkbox"
                  disabled={disabled}
                  checked={savingEnabled}
                  onChange={(event) => onToggleSaving(event.target.checked)}
                />
                <span>Save my progress</span>
              </label>
              <InfoTip label="Save my progress">
                We can save one draft on this browser for 3 days. Starting a new
                enquiry replaces the previous draft. We recommend leaving this
                unchecked on a shared device.
              </InfoTip>
            </div>
            <span
              className={styles.saveIndicator}
              role="status"
              aria-live="polite"
            >
              {savingEnabled ? (saveLabels[saveState] ?? "") : ""}
            </span>
            {savingEnabled && canClear && (
              <button
                type="button"
                ref={clearButton}
                disabled={disabled}
                aria-expanded={confirmClear}
                aria-controls="clear-draft"
                onClick={onToggleConfirm}
              >
                Clear draft
              </button>
            )}
          </div>
        </div>
      </div>

      {confirmClear && (
        <section
          id="clear-draft"
          className={styles.draftPrompt}
          aria-labelledby="clear-draft-title"
        >
          <h3 id="clear-draft-title">Start a new enquiry?</h3>
          <p>This removes your saved answers from this browser.</p>
          <div className={styles.draftActions}>
            <button type="button" onClick={onClear} disabled={disabled}>
              Clear and start fresh
            </button>
            <button type="button" disabled={disabled} onClick={onKeep}>
              Keep my draft
            </button>
          </div>
        </section>
      )}
    </>
  );
}

/* Back and the primary action. The primary button stays enabled so pressing
   it can explain what is missing (AGENTS.md: Interface copy); only sending
   itself is unavailable without a token. */
export function FormActions({
  step,
  sending,
  returnToReview,
  canSend,
  sendingAvailable,
  onBack,
}: {
  step: number;
  sending: boolean;
  returnToReview: boolean;
  canSend: boolean;
  sendingAvailable: boolean;
  onBack: () => void;
}) {
  const primaryLabel = returnToReview
    ? "Back to review"
    : step === 2
      ? "Review enquiry"
      : "Continue";
  const sendLabel = sending
    ? "Sending..."
    : sendingAvailable
      ? "Send enquiry"
      : "Sending not available yet";

  return (
    <>
      <fieldset className={styles.actions} disabled={sending}>
        <legend className="sr-only">Form navigation</legend>
        {step > 0 && (
          <button className={styles.backButton} type="button" onClick={onBack}>
            Back
          </button>
        )}
        {step < 3 ? (
          <div className={styles.nextAction}>
            <button className={styles.primary} type="submit">
              {primaryLabel} <Arrow />
            </button>
          </div>
        ) : (
          <button
            className={styles.primary}
            type="submit"
            disabled={!canSend || sending}
          >
            {sendLabel}
          </button>
        )}
      </fieldset>

      {step === 3 && sendingAvailable && !canSend && (
        <p className={styles.hint}>
          Online sending is temporarily unavailable. Please{" "}
          <a href={`mailto:${contactEmail}`}>email us</a>.
        </p>
      )}
    </>
  );
}
