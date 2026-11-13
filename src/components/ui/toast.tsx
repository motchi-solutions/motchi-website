"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LuCheck, LuCircleAlert, LuX } from "react-icons/lu";

export type ToastTone = "success" | "error";
export type ToastMessage = {
  id: number;
  tone: ToastTone;
  title: string;
  body?: ReactNode;
};

// Success notices hide on their own; errors stay until dismissed so nobody
// misses an unsent enquiry. Hover or focus pauses the timer.
const successDuration = 6000;

/* A fixed notice for results that happen away from where the user is looking,
   such as a form submission that finishes after they scrolled. It does not
   replace inline validation, which stays beside each field. */
export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastMessage | null;
  onDismiss: () => void;
}) {
  const [paused, setPaused] = useState(false);
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  useEffect(() => {
    if (toast?.tone !== "success" || paused) return;
    const timer = setTimeout(() => dismiss.current(), successDuration);
    return () => clearTimeout(timer);
  }, [toast, paused]);
  useEffect(() => {
    if (!toast) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss.current();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [toast]);
  const error = toast?.tone === "error";
  return (
    // The live region stays mounted so screen readers announce new messages.
    // It sits just below the sticky header (6rem, as scroll-padding-top) so it
    // never covers the form's Send or Continue buttons.
    <div
      role={error ? "alert" : "status"}
      aria-live={error ? "assertive" : "polite"}
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-4 top-[6.75rem] z-[90] flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end"
    >
      {toast && (
        <section
          key={toast.id}
          aria-labelledby={`toast-title-${toast.id}`}
          data-toast={toast.tone}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="toast-enter pointer-events-auto flex w-full max-w-[26rem] items-start gap-3 rounded-lg border border-border bg-surface p-4 text-foreground shadow-[0_12px_32px_rgb(23_19_19/18%)]"
        >
          <span
            aria-hidden="true"
            className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${error ? "bg-primary text-inverse" : "bg-primary/10 text-primary"}`}
          >
            {error ? (
              <LuCircleAlert size={16} strokeWidth={2.25} />
            ) : (
              <LuCheck size={16} strokeWidth={2.5} />
            )}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              id={`toast-title-${toast.id}`}
              className="font-semibold leading-snug text-foreground"
            >
              {toast.title}
            </p>
            {toast.body && (
              <div className="mt-1 text-small leading-normal text-muted [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
                {toast.body}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="toast-close -mt-2 -mr-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-muted"
          >
            <LuX size={18} aria-hidden="true" />
          </button>
        </section>
      )}
    </div>
  );
}
