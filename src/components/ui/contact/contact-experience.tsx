"use client";
import type { Branch } from "../../../lib/brand.ts";
import { getContactConfiguration } from "./contact-config.ts";
import { contactEmail } from "../../../lib/config/sites.ts";
import { contactMessage } from "../../../lib/email/feedback.ts";
import { sendContactEnquiry } from "./contact-submission.ts";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { RequiredNotice } from "../required-mark.tsx";
import { Toast, type ToastMessage } from "../toast.tsx";
import { Arrow, Container } from "../primitives.tsx";
import type { ContactEntry } from "./contact-entry.ts";
import {
  DetailsStep,
  ProjectStep,
  ReviewStep,
  ServicesStep,
} from "./contact-steps.tsx";
import {
  DraftControls,
  ErrorSummary,
  FormActions,
  ReminderRail,
  ResumePrompt,
} from "./contact-form-parts.tsx";
import { ContactSuccess } from "./contact-result.tsx";
import { ContactProgress } from "./contact-progress.tsx";
import { ContactDecorations } from "./contact-decorations.tsx";
import { useContactDraft } from "./use-contact-draft.ts";
import {
  answered,
  contactStepIndices,
  draftForBranch,
  errorsFromServer,
  type EnquiryBranch,
  canVisitContactStep,
  hasContactProgress,
  validateContact,
  type ContactDraft,
  type ContactErrors,
} from "./contact-model.ts";
import styles from "./contact.module.css";

const titles = [
  "What can we help you with?",
  "A little about your project",
  "How should we reach you?",
  "Review your enquiry",
];

export function ContactExperience({
  topic,
  entry,
  branch = "solutions",
  children,
  submission,
  initialFeedback,
}: {
  topic?: string;
  entry?: ContactEntry;
  branch?: Branch;
  children: ReactNode;
  submission?: { token: string | null };
  initialFeedback?: string;
}) {
  const {
    draft,
    step,
    updateDraft,
    replaceDraft,
    changeStep,
    ready,
    pendingDraft,
    saveState,
    savingEnabled,
    toggleSaving,
    resume,
    clear,
  } = useContactDraft(topic, branch, entry);
  const activeBranch = draft.enquiryType || branch;
  const { questions, projectTitle } = getContactConfiguration(activeBranch);
  const pageTitles = [...titles];
  pageTitles[1] = projectTitle;

  const branchAnswers = useRef<
    Partial<Record<Branch | "products", ContactDraft>>
  >({});

  // Switching branch keeps compatible answers, and returns to a branch's own
  // answers if the person goes back to it.
  function chooseBranch(next: EnquiryBranch) {
    if (draft.enquiryType === next) return;
    branchAnswers.current[activeBranch] = draft;
    replaceDraft(
      draftForBranch(draft, activeBranch, next, branchAnswers.current[next]),
    );
    setErrors({});
    setAnnouncement(
      `Showing ${next === "products" ? "product questions" : next === "websites" ? "website services" : "consulting services"}.`,
    );
  }

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
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Set when an answer is edited from Review, so the step offers a direct way back.
  const [returnToReview, setReturnToReview] = useState(false);
  const [editTarget, setEditTarget] = useState<string | null>(null);

  // Guards and DOM references used to move focus between steps and errors.
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

  // Blur checks what was entered. A required answer that is still empty waits
  // for Continue or Send, so passing through a field never shows an error.
  function validateField(field: keyof ContactDraft, atStep = 2) {
    const found = validateContact(draft, atStep);
    setErrors((current) =>
      !current[field] && !answered(draft[field])
        ? current
        : { ...current, [field]: found[field] },
    );
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

  function updatePhone({
    countryCode,
    number,
  }: {
    countryCode: string;
    number: string;
  }) {
    update("phoneCountryCode", countryCode);
    update("phone", number);
    const found = validateContact(
      { ...draft, phoneCountryCode: countryCode, phone: number },
      2,
    );
    setErrors((current) => ({
      ...current,
      phone: current.phone ? found.phone : current.phone,
      phoneCountryCode: current.phoneCountryCode
        ? found.phoneCountryCode
        : current.phoneCountryCode,
    }));
  }

  function scrollBehavior(): ScrollBehavior {
    return matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth";
  }

  // Run after React has rendered a step change and the browser has laid it out.
  function afterRender(callback: () => void) {
    requestAnimationFrame(() => requestAnimationFrame(callback));
  }

  // Option groups focus their chosen (or first) option; text fields their input.
  function fieldElement(id: string) {
    const group = document.getElementById(`${id}-group`);
    const element = group
      ? (group.querySelector<HTMLElement>("input:checked:not(:disabled)") ??
        group.querySelector<HTMLElement>("input:not(:disabled)"))
      : document.getElementById(
          id === "phoneCountryCode" ? "phone-country-code" : id,
        );
    return element?.getClientRects().length ? element : null;
  }

  function focusField(id: string) {
    const element = fieldElement(id);
    if (!element) return false;
    // Centre the field so its label and error message sit above it, clear of
    // the sticky header.
    element.scrollIntoView({ block: "center", behavior: scrollBehavior() });
    element.focus({ preventScroll: true });
    return true;
  }

  // Take the user straight to the first answer that needs attention, in page order.
  function focusFirstError(found: ContactErrors) {
    afterRender(() => {
      const first = Object.keys(found)
        .map((key) => fieldElement(key))
        .filter((element): element is HTMLElement => !!element)
        .sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        )[0];
      if (first) {
        first.scrollIntoView({ block: "center", behavior: scrollBehavior() });
        first.focus({ preventScroll: true });
        return;
      }
      const target = reminder.current?.getClientRects().length
        ? reminder.current
        : summary.current;
      target?.focus({ preventScroll: true });
      card.current?.scrollIntoView({
        block: "start",
        behavior: scrollBehavior(),
      });
    });
  }

  function editAnswer(target: number, field: string) {
    if (submissionInFlight.current) return;
    setErrors({});
    setAttemptedStep(null);
    setBlockedTarget(null);
    setReturnToReview(true);
    setEditTarget(field);
    changeStep(target);
    afterRender(() => {
      if (focusField(field)) return;
      heading.current?.focus({ preventScroll: true });
      card.current?.scrollIntoView({
        block: "start",
        behavior: scrollBehavior(),
      });
    });
  }

  function backToReview() {
    setAttemptedStep(step);
    const found = validateContact(draft, step);
    setErrors(found);
    if (Object.keys(found).length) focusFirstError(found);
    else go(3);
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
    if (next === 3) {
      setReturnToReview(false);
      setEditTarget(null);
    }
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
    if (Object.keys(found).length) focusFirstError(found);
    else {
      const steps = contactStepIndices(draft);
      go(steps[steps.indexOf(step) + 1]);
    }
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
    const found = validateContact(draft, incomplete);
    setAttemptedStep(incomplete);
    setErrors(found);
    setBlockedTarget(target);
    changeStep(incomplete);
    focusFirstError(found);
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

  function startFresh() {
    if (submissionInFlight.current) return;
    if (clear(!!pendingDraft)) {
      setBlockedTarget(null);
      setAttemptedStep(null);
      setErrors({});
      setConfirmClear(false);
      setReturnToReview(false);
      setEditTarget(null);
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
    setToast(null);
    try {
      const result = await sendContactEnquiry(
        draft,
        activeBranch,
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
        setToast({
          id: Date.now(),
          tone: "success",
          title: "Your enquiry has been sent",
          body:
            result.status === "partial"
              ? "We couldn't send your confirmation email, but your enquiry arrived."
              : "We usually reply within 2-3 business days.",
        });
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
        // Shown as a toast so it is visible wherever the user has scrolled.
        setToast({
          id: Date.now(),
          tone: "error",
          title: "Your enquiry wasn't sent",
          body: (
            <>
              {result.status === "invalid"
                ? "Please check your answers and try again. Your progress is still here."
                : contactMessage(result.status)}{" "}
              <a href={`mailto:${contactEmail}`}>Email Motchi</a>
            </>
          ),
        });
        const found = errorsFromServer(result.fields);
        if (Object.keys(found).length) {
          const nextStep = found.services ? 0 : found.budget ? 1 : 2;
          changeStep(nextStep);
          setAttemptedStep(nextStep);
          setErrors(found);
          focusFirstError(found);
        }
      }
    } catch {
      setToast({
        id: Date.now(),
        tone: "error",
        title: "We couldn't confirm delivery",
        body: (
          <>
            Your answers are still here. Please email us so we can check before
            you try again. <a href={`mailto:${contactEmail}`}>Email Motchi</a>
          </>
        ),
      });
    } finally {
      submissionInFlight.current = false;
      setSending(false);
    }
  }

  function goBack() {
    const steps = contactStepIndices(draft);
    go(steps[steps.indexOf(step) - 1]);
  }

  return (
    <section className={styles.composition} aria-labelledby="contact-title">
      <Container className={styles.contactContainer}>
        <div className={styles.layout} data-resume={!!pendingDraft}>
          <div className={styles.leftColumn}>{children}</div>

          <div className={styles.formStage} data-reminder={hasReminder}>
            <ContactDecorations />
            {!pendingDraft && (
              <ReminderRail
                ref={reminder}
                visible={hasReminder}
                errors={reminderErrors}
              />
            )}

            <div ref={card} className={styles.experience}>
              {ready && pendingDraft && (
                <ResumePrompt
                  onContinue={() => openForm(resume)}
                  onRestart={() => openForm(startFresh)}
                  clearFailed={saveState === "error"}
                />
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
                    if (step < 3) {
                      if (returnToReview) backToReview();
                      else next();
                    } else void submit();
                  }}
                >
                  {/* Signed token and honeypot for abuse protection; the
                      honeypot is hidden from people and assistive tech. */}
                  {submission && (
                    <>
                      <input
                        type="hidden"
                        name="token"
                        value={submissionToken}
                      />
                      <div hidden aria-hidden="true">
                        <label htmlFor="fax">
                          Please leave this field empty
                        </label>
                        <input
                          ref={honeypot}
                          id="fax"
                          name="fax"
                          autoComplete="off"
                          tabIndex={-1}
                        />
                      </div>
                    </>
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
                    >
                      {/* Visible only: focus moves to the first answer, which
                          announces its own error. */}
                      {blocked && (
                        <span>
                          Please complete the required fields on this page
                          before moving on.
                        </span>
                      )}
                    </p>
                    <ErrorSummary
                      ref={summary}
                      keys={unresolvedErrors.map(([key]) => key)}
                    />

                    {step === 0 && (
                      <ServicesStep
                        draft={draft}
                        activeBranch={activeBranch}
                        errors={errors}
                        update={update}
                        chooseBranch={chooseBranch}
                        validateField={validateField}
                        announce={setAnnouncement}
                        detailsOpen={
                          !!topic ||
                          !!entry?.draft.services.length ||
                          !!editTarget?.startsWith("details-")
                        }
                      />
                    )}
                    {step === 1 && (
                      <ProjectStep
                        draft={draft}
                        questions={questions}
                        errors={errors}
                        update={update}
                        validateField={validateField}
                        editTarget={editTarget}
                      />
                    )}
                    {step === 2 && (
                      <DetailsStep
                        draft={draft}
                        activeBranch={activeBranch}
                        questions={questions}
                        errors={errors}
                        update={update}
                        validateField={validateField}
                        validatePhone={validatePhone}
                        updatePhone={updatePhone}
                        editTarget={editTarget}
                      />
                    )}
                    {step === 3 && (
                      <ReviewStep
                        draft={draft}
                        edit={editAnswer}
                        disabled={sending}
                      />
                    )}
                  </div>

                  <div className={styles.formFooter}>
                    <DraftControls
                      savingEnabled={savingEnabled}
                      saveState={saveState}
                      canClear={hasContactProgress(draft)}
                      confirmClear={confirmClear}
                      disabled={sending}
                      clearButton={clearButton}
                      onToggleSaving={toggleSaving}
                      onToggleConfirm={() => setConfirmClear((value) => !value)}
                      onClear={startFresh}
                      onKeep={() => {
                        setConfirmClear(false);
                        requestAnimationFrame(() =>
                          clearButton.current?.focus(),
                        );
                      }}
                    />
                    <p className={styles.privacyNote}>
                      Our <a href="/privacy">privacy policy</a> explains how we
                      use your information.
                    </p>
                    <FormActions
                      step={step}
                      sending={sending}
                      returnToReview={returnToReview}
                      canSend={!!submissionToken}
                      sendingAvailable={!!submission}
                      onBack={goBack}
                    />
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
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </section>
  );
}
