"use client";
import { useState, type ReactNode } from "react";
import { websiteStarter } from "@motchi/config/sites";
import { contactLimits } from "@motchi/email/validation";
import type { Branch } from "@motchi/brand";

export function WebsiteBudget({
  branch,
  initialInterest,
  error,
  children,
}: {
  branch: Branch;
  initialInterest: string;
  error?: string;
  children: ReactNode;
}) {
  const [interest, setInterest] = useState(initialInterest);
  const relevant =
    branch === "websites" ||
    (branch === "solutions" && interest === "Websites");
  return (
    <div
      className="space-y-6"
      onChange={(event) => {
        if (
          event.target instanceof HTMLSelectElement &&
          event.target.name === "interest"
        )
          setInterest(event.target.value);
      }}
    >
      {children}
      {relevant && (
        <div>
          <label htmlFor="budget" className="text-sm font-semibold">
            Website Budget (CAD) <span className="font-normal">(optional)</span>
          </label>
          <input
            id="budget"
            name="budget"
            type="text"
            maxLength={contactLimits.budget}
            placeholder="An amount, range, or 'not sure yet'"
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={
              error ? "budget-help budget-error" : "budget-help"
            }
            className="form-control mt-2 min-h-12 w-full border border-border bg-background px-4 py-3 text-base"
          />
          <p
            id="budget-help"
            className="mt-2 text-sm leading-relaxed text-muted"
          >
            A focused one-page website starts at {websiteStarter.price}. Domain,
            hosting, and applicable taxes are extra. More pages, added features,
            and maintenance are quoted separately. Not sure about a budget?
            Leave this blank and we'll work through the options together.
          </p>
          {error && (
            <p
              id="budget-error"
              className="mt-2 text-sm font-semibold text-primary"
            >
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
