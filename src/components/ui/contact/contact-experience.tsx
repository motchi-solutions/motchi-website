"use client";
import type { Branch } from "../../../lib/brand.ts";
import { getContactConfiguration } from "./contact-config.ts";
import { contactEmail } from "../../../lib/config/sites.ts";
import { contactMessage } from "../../../lib/email/feedback.ts";
import { contactFieldErrors } from "../../../lib/email/validation.ts";
import { sendContactEnquiry } from "./contact-submission.ts";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { RequiredNotice } from "../required-mark.tsx";
import { InfoTip } from "../info-tip.tsx";
import { ContactNameHelp } from "../contact-name-help.tsx";
import { contactContextLimit } from "../../../lib/config/validation.ts";
import { Arrow, Container } from "../primitives.tsx";
import { ContactField, ContactOptionGroup } from "./contact-controls.tsx";
import { ContactPhoneField } from "./contact-phone-field.tsx";
import { ContactDisclosure } from "./contact-disclosure.tsx";
import { ContactReview } from "./contact-review.tsx";
import { ContactSuccess } from "./contact-result.tsx";
import { ContactProgress } from "./contact-progress.tsx";
import { ContactDecorations } from "./contact-decorations.tsx";
import { useContactDraft } from "./use-contact-draft.ts";
import {
  canVisitContactStep,
  hasContactProgress,
  validateContact,
  type ContactDraft,
  type ContactErrors,
} from "./contact-model.ts";
import styles from "./contact.module.css";
const errorLabels: Partial<Record<keyof ContactDraft, string>> = {
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
const titles = [
  "What can we help you with?",
  "A little about your project",
  "How should we reach you?",
  "Review your enquiry",
];
export function ContactExperience({
  topic,
  branch = "solutions",
  children,
  submission,
  initialFeedback,
}: {
  topic?: string;
  branch?: Branch;
  children: ReactNode;
  submission?: { token: string | null };
  initialFeedback?: string;
}) {
  const { services, serviceDescriptions, followUps, questions, projectTitle } =
    getContactConfiguration(branch);
  const pageTitles = [...titles];
  pageTitles[1] = projectTitle;
  const {
    draft,
    step,
    updateDraft,
    changeStep,
    ready,
    pendingDraft,
    saveState,
    savingEnabled,
    toggleSaving,
    resume,
    clear,
  } = useContactDraft(topic, branch);
  const [confirmClear, setConfirmClear] = useState(false);
  const [blockedTarget, setBlockedTarget] = useState<number | null>(null);
  const [attemptedStep, setAttemptedStep] = useState<number | null>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [announcement, setAnnouncement] = useState("");
  const [submissionToken, setSubmissionToken] = useState(
    submission?.token ?? "",
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [feedback, setFeedback] = useState(initialFeedback);
  const submissionInFlight = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const clearButton = useRef<HTMLButtonElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const reminder = useRef<HTMLDivElement>(null);
  const openingBounds = useRef<DOMRect | null>(null);
  useLayoutEffect(() => {
    const previous = openingBounds.current;
    const element = card.current;
    if (pendingDraft || !previous || !element) return;
    openingBounds.current = null;
    const next = element.getBoundingClientRect();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heading.current?.focus({ preventScroll: true });
      element.scrollIntoView({ block: "start", behavior: "instant" });
      return;
    }
    element.style.overflow = "hidden";
    const animation = element.animate(
      [
        {
          height: `${previous.height}px`,
          transform: `translateY(${previous.top - next.top}px)`,
        },
        { height: `${next.height}px`, transform: "translateY(0)" },
      ],
      { duration: 300, easing: "ease-in-out" },
    );
    const finish = () => {
      element.style.removeProperty("overflow");
      heading.current?.focus({ preventScroll: true });
      element.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    animation.onfinish = finish;
    animation.oncancel = finish;
    return () => {
      animation.onfinish = null;
      animation.oncancel = null;
      animation.cancel();
      element.style.removeProperty("overflow");
    };
  }, [pendingDraft]);
  function openForm(action: () => void) {
    openingBounds.current = card.current?.getBoundingClientRect() ?? null;
    action();
  }
  function update<K extends keyof ContactDraft>(
    key: K,
    value: ContactDraft[K],
  ) {
    updateDraft(key, value);
    // Refresh errors already shown; new errors still wait for blur or Continue.
    if (key !== "phone" && key !== "phoneCountryCode") {
      const found = validateContact({ ...draft, [key]: value }, step);
      setErrors((current) =>
        current[key] ? { ...current, [key]: found[key] } : current,
      );
    }
  }
  function validateField(field: keyof ContactDraft, atStep = 2) {
    const found = validateContact(draft, atStep);
    setErrors((current) => ({ ...current, [field]: found[field] }));
  }
  function validatePhone() {
    const found = validateContact(draft, 2);
    setErrors((current) => ({
      ...current,
      // Missing counterparts wait for Review; moving within the pair never validates.
      phone:
        draft.phone || (!draft.phone && !draft.phoneCountryCode)
          ? found.phone
          : current.phone,
      phoneCountryCode:
        draft.phoneCountryCode || (!draft.phone && !draft.phoneCountryCode)
          ? found.phoneCountryCode
          : current.phoneCountryCode,
    }));
  }
  function go(next: number) {
    if (submissionInFlight.current) return;
    if (!canVisitContactStep(draft, step, next)) {
      openBlockedStep(next);
      return;
    }
    setErrors({});
    setAttemptedStep(null);
    setBlockedTarget(null);
    changeStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      card.current?.scrollIntoView({
        block: "start",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }
  function next() {
    setAttemptedStep(step);
    const found = validateContact(draft, step);
    setErrors(found);
    if (Object.keys(found).length)
      requestAnimationFrame(() => {
        const target = reminder.current?.getClientRects().length
          ? reminder.current
          : summary.current;
        target?.focus({ preventScroll: true });
        card.current?.scrollIntoView({
          block: "start",
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      });
    else go(step + 1);
  }
  const blocked =
    blockedTarget !== null && !canVisitContactStep(draft, step, blockedTarget);
  function openBlockedStep(target: number | null) {
    if (target === null) {
      setBlockedTarget(null);
      return;
    }
    const incomplete = Array.from({ length: target }, (_, index) => index).find(
      (index) => Object.keys(validateContact(draft, index)).length > 0,
    );
    if (incomplete === undefined) return;
    setAttemptedStep(incomplete);
    setErrors(validateContact(draft, incomplete));
    setBlockedTarget(target);
    changeStep(incomplete);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      card.current?.scrollIntoView({
        block: "start",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }
  const currentErrors = validateContact(draft, step);
  const unresolvedErrors = Object.entries(errors).filter(
    ([key, message]) => message && currentErrors[key as keyof ContactDraft],
  );
  const reminderErrors =
    attemptedStep === step
      ? currentErrors
      : Object.fromEntries(unresolvedErrors);
  const hasReminder = !pendingDraft && Object.keys(reminderErrors).length > 0;
  function errorTarget(key: string) {
    return `#${["services", "business", "stage", "timeline"].includes(key) ? `${key}-0` : key === "phoneCountryCode" ? "phone-country-code" : key}`;
  }
  function startFresh() {
    if (submissionInFlight.current) return;
    if (clear()) {
      setBlockedTarget(null);
      setAttemptedStep(null);
      setErrors({});
      setConfirmClear(false);
      setAnnouncement("Your saved draft has been cleared.");
      if (!pendingDraft) requestAnimationFrame(() => heading.current?.focus());
    }
  }
  async function submit() {
    if (!submissionToken || submissionInFlight.current) return;
    const incomplete = [0, 1, 2].find(
      (index) => Object.keys(validateContact(draft, index)).length > 0,
    );
    if (incomplete !== undefined) {
      openBlockedStep(3);
      return;
    }
    submissionInFlight.current = true;
    setSending(true);
    setFeedback(undefined);
    try {
      const result = await sendContactEnquiry(
        draft,
        branch,
        submissionToken,
        honeypot.current?.value ?? "",
      );
      if (result.status === "sent" || result.status === "partial") {
        clear();
        setSent(true);
        setFeedback(
          result.status === "partial"
            ? "We couldn't send a confirmation email, but your enquiry has arrived. There's no need to submit again. We usually reply within 2-3 business days."
            : undefined,
        );
        requestAnimationFrame(() => {
          document
            .getElementById("contact-success-heading")
            ?.focus({ preventScroll: true });
          card.current?.scrollIntoView({
            block: "start",
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          });
        });
      } else {
        if (result.status === "expired" && result.nextToken)
          setSubmissionToken(result.nextToken);
        setFeedback(
          result.status === "invalid"
            ? "Your enquiry wasn't sent. Please check your answers and try again. Your progress is still here."
            : contactMessage(result.status),
        );
        const mapping: Record<string, keyof ContactDraft> = {
          name: "name",
          email: "email",
          company: "organization",
          website: "website",
          interest: "services",
          budget: "budget",
          message: "context",
        };
        const found: ContactErrors = {};
        for (const field of result.fields)
          if (mapping[field])
            found[mapping[field]] =
              contactFieldErrors[field as keyof typeof contactFieldErrors];
        if (Object.keys(found).length) {
          const nextStep = found.services ? 0 : found.budget ? 1 : 2;
          changeStep(nextStep);
          setAttemptedStep(nextStep);
          setErrors(found);
        }
      }
    } catch {
      setFeedback(
        "We couldn't confirm delivery. Your answers are still here. Please email us so we can check before you try again.",
      );
    } finally {
      submissionInFlight.current = false;
      setSending(false);
    }
  }
  return (
    <section className={styles.composition} aria-labelledby="contact-title">
      <Container className={styles.contactContainer}>
        <div className={styles.layout} data-resume={!!pendingDraft}>
          <div className={styles.leftColumn}>{children}</div>
          <div className={styles.formStage} data-reminder={hasReminder}>
            <ContactDecorations />
            {!pendingDraft && (
              <aside
                className={styles.reminderRail}
                aria-label="Incomplete answers"
                aria-hidden={!hasReminder}
                inert={!hasReminder}
              >
                <div
                  ref={reminder}
                  tabIndex={-1}
                  role={hasReminder ? "alert" : undefined}
                  className={styles.reminderCard}
                >
                  <p className={styles.reminderTitle}>
                    Please complete these answers
                  </p>
                  <ul>
                    {Object.entries(errorLabels).map(([key, label]) => {
                      const resolved =
                        !reminderErrors[key as keyof ContactDraft];
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
            )}
            <div ref={card} className={styles.experience}>
              {ready && pendingDraft && (
                <section
                  className={styles.draftPrompt}
                  aria-labelledby="resume-heading"
                >
                  <h2 id="resume-heading">Continue your contact form</h2>
                  <p>
                    You chose to save your progress. We've kept your answers so
                    you can pick up where you left off.
                  </p>
                  <div className={styles.draftActions}>
                    <button
                      type="button"
                      className={styles.primary}
                      onClick={() => {
                        openForm(resume);
                      }}
                    >
                      Continue form
                    </button>
                    <button
                      type="button"
                      onClick={() => openForm(startFresh)}
                      aria-describedby="replace-draft-note"
                    >
                      Start a new form
                    </button>
                  </div>
                  {saveState === "error" && (
                    <p role="alert">
                      Your saved draft could not be cleared. Please check your
                      browser storage settings and try again.
                    </p>
                  )}
                  <p
                    id="replace-draft-note"
                    className={styles.draftRestartNote}
                  >
                    Starting a new form will replace your saved answers.
                  </p>
                </section>
              )}
              {sent && (
                <ContactSuccess message={feedback}>
                  <button
                    type="button"
                    className={styles.primary}
                    onClick={() => {
                      setSent(false);
                      setFeedback(undefined);
                      startFresh();
                    }}
                  >
                    Start another enquiry
                    <Arrow />
                  </button>
                </ContactSuccess>
              )}
              <div
                hidden={!!pendingDraft || sent}
                inert={!ready || !!pendingDraft || sent}
              >
                <ContactProgress
                  draft={draft}
                  step={step}
                  go={go}
                  disabled={sending}
                />

                <p
                  className="sr-only"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {announcement}
                </p>
                <form
                  id="contact-form"
                  noValidate
                  aria-busy={sending || undefined}
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (step < 3) next();
                    else void submit();
                  }}
                >
                  {submission && (
                    <input type="hidden" name="token" value={submissionToken} />
                  )}
                  {submission && (
                    <div hidden aria-hidden="true">
                      <label htmlFor="fax">Please leave this field empty</label>
                      <input
                        ref={honeypot}
                        id="fax"
                        name="fax"
                        autoComplete="off"
                        tabIndex={-1}
                      />
                    </div>
                  )}
                  <div key={step} className={styles.step} data-step={step}>
                    <h2 ref={heading} tabIndex={-1}>
                      {pageTitles[step]}
                    </h2>
                    {step < 3 && <RequiredNotice />}
                    {feedback && (
                      <p
                        role="alert"
                        className={`form-error-notice ${styles.submissionFeedback}`}
                      >
                        {feedback}{" "}
                        <a href={`mailto:${contactEmail}`}>Email Motchi</a>
                      </p>
                    )}
                    <p
                      id="contact-progress-hint"
                      className={
                        blocked
                          ? `form-error-notice ${styles.progressHint}`
                          : "sr-only"
                      }
                      role="status"
                      aria-atomic="true"
                    >
                      {blocked && (
                        <span>
                          Please complete the required fields on this page
                          before moving on.
                        </span>
                      )}
                    </p>
                    {unresolvedErrors.length > 0 && (
                      <div
                        ref={summary}
                        tabIndex={-1}
                        role="alert"
                        className={styles.errorSummary}
                      >
                        <h3>Please check these answers</h3>
                        <ul>
                          {unresolvedErrors.map(([key]) => (
                            <li key={key}>
                              <a href={errorTarget(key)}>
                                {errorLabels[key as keyof ContactDraft] ?? key}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {step === 0 && (
                      <>
                        <ContactOptionGroup
                          id="services"
                          onBlur={() => validateField("services", 0)}
                          label="Please select your preferred services"
                          options={services}
                          hint="You can choose more than one. If you're unsure, please choose Not Sure Yet."
                          value={draft.services}
                          multiple
                          required
                          error={errors.services}
                          onChange={(value) => {
                            const added = value.find(
                              (service) => !draft.services.includes(service),
                            );
                            const removed = draft.services.find(
                              (service) => !value.includes(service),
                            );
                            setAnnouncement(
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
                          data-open={draft.services.some(
                            (service) => followUps[service],
                          )}
                          aria-hidden={
                            !draft.services.some(
                              (service) => followUps[service],
                            )
                          }
                          inert={
                            !draft.services.some(
                              (service) => followUps[service],
                            )
                          }
                          aria-label="Optional service details"
                        >
                          <div className={styles.conditionalClip}>
                            <ContactDisclosure title="Would you like to share more?">
                              {services
                                .filter((service) => followUps[service])
                                .map((service) => (
                                  <div
                                    className={styles.conditional}
                                    key={service}
                                    data-open={draft.services.includes(service)}
                                    aria-hidden={
                                      !draft.services.includes(service)
                                    }
                                    inert={!draft.services.includes(service)}
                                  >
                                    <div className={styles.conditionalClip}>
                                      <div
                                        className={styles.serviceDetailGroup}
                                      >
                                        <h4
                                          className={styles.serviceDetailTitle}
                                        >
                                          {service}
                                        </h4>
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
                    )}
                    {step === 1 &&
                      (
                        ["business", "stage", "timeline", "budget"] as const
                      ).map((key) => (
                        <ContactOptionGroup
                          key={key}
                          id={key}
                          onBlur={() => validateField(key, 1)}
                          {...questions[key]}
                          required={key !== "budget"}
                          value={draft[key] ? [draft[key]] : []}
                          error={errors[key]}
                          onChange={(value) => update(key, value[0])}
                          hint={
                            key === "budget"
                              ? "Amounts are in CAD. This helps us plan, not set a final price."
                              : undefined
                          }
                        />
                      ))}
                    {step === 2 && (
                      <>
                        <div className={styles.fields}>
                          <ContactField
                            field="name"
                            onBlur={() => validateField("name")}
                            label="Name"
                            placeholder="Alex Morgan"
                            help={<ContactNameHelp />}
                            value={draft.name}
                            onChange={(value) => update("name", value)}
                            autoComplete="name"
                            required
                            error={errors.name}
                          />
                          <ContactField
                            field="email"
                            placeholder="name@example.com"
                            onBlur={() => validateField("email")}
                            label="Email"
                            value={draft.email}
                            onChange={(value) => update("email", value)}
                            type="email"
                            autoComplete="email"
                            required
                            error={errors.email}
                          />
                          <ContactField
                            field="organization"
                            label="Business / organization"
                            placeholder="Example Studio"
                            value={draft.organization}
                            onChange={(value) => update("organization", value)}
                            autoComplete="organization"
                          />
                          <ContactField
                            field="website"
                            help="A full website address looks like https://example.com. You can leave this blank if you don't have a website."
                            placeholder="https://example.com"
                            onBlur={() => validateField("website")}
                            label="Website"
                            value={draft.website}
                            onChange={(value) => update("website", value)}
                            type="url"
                            autoComplete="url"
                            error={errors.website}
                          />
                          <ContactPhoneField
                            countryCode={draft.phoneCountryCode}
                            number={draft.phone}
                            error={errors.phone}
                            countryCodeError={errors.phoneCountryCode}
                            onBlur={validatePhone}
                            onChange={({ countryCode, number }) => {
                              update("phoneCountryCode", countryCode);
                              update("phone", number);
                              const found = validateContact(
                                {
                                  ...draft,
                                  phoneCountryCode: countryCode,
                                  phone: number,
                                },
                                2,
                              );
                              setErrors((current) => ({
                                ...current,
                                phone: current.phone
                                  ? found.phone
                                  : current.phone,
                                phoneCountryCode: current.phoneCountryCode
                                  ? found.phoneCountryCode
                                  : current.phoneCountryCode,
                              }));
                            }}
                          />
                        </div>
                        <ContactOptionGroup
                          id="source"
                          {...questions.source}
                          value={draft.source ? [draft.source] : []}
                          onChange={(value) => update("source", value[0])}
                        />
                        <ContactField
                          field="context"
                          label="Anything else you'd like to share?"
                          value={draft.context}
                          onChange={(value) => update("context", value)}
                          onBlur={() => validateField("context")}
                          error={errors.context}
                          multiline
                          maxLength={contactContextLimit}
                          help="Please use up to 2,000 characters. A few sentences about your idea or problem is enough."
                        />
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <ContactReview
                          draft={draft}
                          edit={go}
                          disabled={sending}
                        />
                        <p className={styles.hint}>
                          We'll use the information you provide to respond to
                          your enquiry. You can read our{" "}
                          <a href="/privacy">privacy notice</a>.
                        </p>
                      </>
                    )}
                  </div>
                  <div className={styles.formFooter}>
                    <div className={styles.actionDetails}>
                      <div className={styles.saveCopy}>
                        <div className={styles.draftHeading}>
                          <div className={styles.savePreferenceGroup}>
                            <label className={styles.savePreference}>
                              <input
                                id="save-contact-draft"
                                name="saveDraft"
                                type="checkbox"
                                disabled={sending}
                                checked={savingEnabled}
                                onChange={(event) =>
                                  toggleSaving(event.target.checked)
                                }
                              />
                              <span>Save my progress</span>
                            </label>
                            <InfoTip label="Save my progress">
                              We can save one draft on this browser for 3 days.
                              Starting a new enquiry replaces the previous
                              draft. We recommend leaving this unchecked on a
                              shared device.
                            </InfoTip>
                          </div>
                          <span
                            className={styles.saveIndicator}
                            role="status"
                            aria-live="polite"
                          >
                            {savingEnabled
                              ? saveState === "saving"
                                ? "Saving..."
                                : saveState === "saved"
                                  ? "Saved"
                                  : saveState === "error"
                                    ? "Could not save"
                                    : ""
                              : ""}
                          </span>
                          {savingEnabled && hasContactProgress(draft) && (
                            <button
                              type="button"
                              ref={clearButton}
                              disabled={sending}
                              aria-expanded={confirmClear}
                              aria-controls="clear-draft"
                              onClick={() => setConfirmClear((value) => !value)}
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
                        <p>
                          This removes your saved answers from this browser.
                        </p>
                        <div className={styles.draftActions}>
                          <button
                            type="button"
                            onClick={startFresh}
                            disabled={sending}
                          >
                            Clear and start fresh
                          </button>
                          <button
                            type="button"
                            disabled={sending}
                            onClick={() => {
                              setConfirmClear(false);
                              requestAnimationFrame(() =>
                                clearButton.current?.focus(),
                              );
                            }}
                          >
                            Keep my draft
                          </button>
                        </div>
                      </section>
                    )}
                    <p className={styles.privacyNote}>
                      Our <a href="/privacy">privacy notice</a> explains how we
                      use your information.
                    </p>
                    <fieldset className={styles.actions} disabled={sending}>
                      <legend className="sr-only">Form navigation</legend>
                      {step > 0 && (
                        <button
                          className={styles.backButton}
                          type="button"
                          onClick={() => go(step - 1)}
                        >
                          Back
                        </button>
                      )}
                      {step < 3 ? (
                        <div className={styles.nextAction}>
                          <button className={styles.primary} type="submit">
                            {step === 2 ? "Review enquiry" : "Continue"}{" "}
                            <Arrow />
                          </button>
                        </div>
                      ) : (
                        <button
                          className={styles.primary}
                          type="submit"
                          disabled={!submissionToken || sending}
                        >
                          {sending
                            ? "Sending..."
                            : submission
                              ? "Send enquiry"
                              : "Sending not available yet"}
                        </button>
                      )}
                    </fieldset>
                    {step === 3 && submission && !submissionToken && (
                      <p className={styles.hint}>
                        Online sending is temporarily unavailable. Please{" "}
                        <a href={`mailto:${contactEmail}`}>email us</a>.
                      </p>
                    )}
                  </div>
                </form>
              </div>
              <noscript>
                <p className={styles.notice}>
                  This guided form needs JavaScript. Please{" "}
                  <a href={`mailto:${contactEmail}`}>email us</a> to contact
                  Motchi.
                </p>
              </noscript>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
