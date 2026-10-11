"use client";
import { contactEmail } from "@motchi/brand";
export function ErrorState({
  reset,
  reference,
}: {
  reset: () => void;
  reference?: string;
}) {
  return (
    <section className="mx-auto max-w-shell px-5 py-section sm:px-8 lg:px-12">
      <p className="mb-5 text-eyebrow font-semibold uppercase tracking-widest text-primary">
        Something Went Wrong
      </p>
      <h1 className="max-w-reading text-h1 font-medium tracking-tight">
        We Couldn’t Load This Page
      </h1>
      <p className="mt-6 max-w-lg text-body-lg leading-relaxed text-muted">
        Please try again, or email us directly if you need a hand. If you were
        sending an enquiry, check for confirmation before submitting again.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="min-h-12 bg-primary px-6 py-3 font-semibold text-inverse"
        >
          Try Again
        </button>
        <a
          href="/"
          className="inline-flex min-h-12 items-center border border-border px-6 py-3"
        >
          Back to Home
        </a>
        <a
          href={`mailto:${contactEmail}`}
          className="inline-flex min-h-12 items-center px-2 underline underline-offset-4"
        >
          Email Motchi
        </a>
      </div>
      {reference && (
        <p className="mt-6 text-small text-muted">Reference: {reference}</p>
      )}
    </section>
  );
}
