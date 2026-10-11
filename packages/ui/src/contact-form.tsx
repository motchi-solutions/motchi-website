"use client";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./icons";

export function ContactForm({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(false);
  const [slow, setSlow] = useState(false);
  const submitted = useRef(false);
  useEffect(() => {
    // Back/forward cache restores the usable form after a native navigation.
    const reset = () => {
      submitted.current = false;
      setPending(false);
      setSlow(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);
  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(() => setSlow(true), 25000);
    return () => window.clearTimeout(timer);
  }, [pending]);
  return (
    <>
      <form
        action="/api/contact"
        method="post"
        className="space-y-6"
        aria-busy={pending || undefined}
        onSubmit={(event) => {
          if (submitted.current) {
            event.preventDefault();
            return;
          }
          submitted.current = true;
          setPending(true);
        }}
      >
        {children}
        <button
          type="submit"
          aria-disabled={pending || undefined}
          className="button-link inline-flex min-h-12 w-full cursor-pointer items-center justify-between gap-5 bg-primary px-7 py-3 text-button font-semibold text-inverse hover:bg-secondary aria-disabled:cursor-wait sm:w-auto"
        >
          <span className="grid">
            <span
              className={
                pending
                  ? "invisible col-start-1 row-start-1"
                  : "col-start-1 row-start-1"
              }
            >
              Send Enquiry
            </span>
            <span
              aria-hidden={!pending}
              className={
                pending
                  ? "col-start-1 row-start-1"
                  : "invisible col-start-1 row-start-1"
              }
            >
              Sending…
            </span>
          </span>
          <Arrow />
        </button>
      </form>
      <output
        aria-live="polite"
        className="block min-h-6 text-small text-muted"
      >
        {slow
          ? "This is taking longer than expected. If delivery remains unclear, email us directly before sending again."
          : pending
            ? "Sending your enquiry. Please wait."
            : ""}
      </output>
    </>
  );
}
