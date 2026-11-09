"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Arrow, Section } from "../primitives.tsx";
import { RequiredNotice } from "../required-mark.tsx";
import { ContactServices } from "./contact-services.tsx";
import {
  initialDraft,
  validateContact,
  type ContactDraft,
} from "./contact-model.ts";
import { contactEntryHref } from "./contact-entry.ts";
import { normalizeWebsiteTier, websiteTiers } from "./contact-config.ts";
import styles from "./contact.module.css";

// A preview of the whole enquiry: only the first step is on this page.
const enquirySteps = [
  {
    title: "Select your services",
    text: "Start here by choosing what you need.",
  },
  {
    title: "Add your details",
    text: "On the next page: your project and how to reach you.",
  },
  {
    title: "Review and send",
    text: "Check your answers, then send. We usually reply within 2-3 business days.",
  },
];

export function ServiceEnquiry({
  branch,
  className = "",
}: {
  branch: "websites" | "consulting";
  className?: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => initialDraft(undefined, branch));
  const [error, setError] = useState<string>();
  const [announcement, setAnnouncement] = useState("");
  function update<K extends keyof ContactDraft>(
    key: K,
    value: ContactDraft[K],
  ) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    if (error) setError(validateContact(next, 0).services);
  }
  // Pricing links (data-enquiry-tier) scroll here and preselect their tier.
  useEffect(() => {
    if (branch !== "websites") return;
    const choose = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-enquiry-tier]")
          : null;
      const tier = normalizeWebsiteTier(link?.dataset.enquiryTier ?? "");
      if (!websiteTiers.includes(tier)) return;
      setDraft((current) => ({ ...current, websiteTier: tier }));
      setAnnouncement(`${tier} tier selected.`);
    };
    document.addEventListener("click", choose);
    return () => document.removeEventListener("click", choose);
  }, [branch]);
  return (
    <Section id="enquiry" className={`${styles.enquirySection} ${className}`}>
      <div className={`${styles.composition} ${styles.enquiryLayout}`}>
        <div className={styles.enquiryIntro}>
          <div className={styles.enquiryHeading}>
            <h2
              className={`text-h2 font-medium tracking-tight ${styles.enquiryTitle}`}
            >
              {branch === "websites"
                ? "Let's Plan Your Website"
                : "Let's Plan Your Next Step"}
            </h2>
            <p className={styles.enquiryLead}>
              Please select the help you need. You can share project details
              next.
            </p>
          </div>
          <div className={styles.enquirySteps}>
            <h3 id="enquiry-steps" className={styles.enquiryStepsHeading}>
              How it works
            </h3>
            <ol aria-labelledby="enquiry-steps">
              {enquirySteps.map((step, index) => (
                <li
                  key={step.title}
                  aria-current={index === 0 ? "step" : undefined}
                >
                  <span aria-hidden="true">{index + 1}</span>
                  <div>
                    <strong>
                      {step.title}
                      {index === 0 && (
                        <span className={styles.enquiryHere}>
                          (current step)
                        </span>
                      )}
                    </strong>
                    <p className={styles.enquiryStepText}>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <form
          className={`${styles.layout} ${styles.experience} ${styles.step} ${styles.enquiryForm}`}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const message = validateContact(draft, 0).services;
            setError(message);
            if (message) document.getElementById("services-0")?.focus();
            else router.push(contactEntryHref(branch, draft));
          }}
        >
          <RequiredNotice />
          <ContactServices
            branch={branch}
            pricingHref="#pricing"
            draft={draft}
            update={update}
            error={error}
            // An empty choice waits for Continue; blur only refreshes a shown error.
            onBlur={() =>
              setError((current) =>
                current ? validateContact(draft, 0).services : current,
              )
            }
            announce={setAnnouncement}
          />
          <p className="sr-only" role="status">
            {announcement}
          </p>
          <button
            type="submit"
            className="button-link justify-self-start inline-flex min-h-12 items-center justify-between gap-5 border border-primary bg-primary px-6 py-3 text-button font-semibold text-inverse hover:bg-secondary"
          >
            Continue to project details <Arrow />
          </button>
        </form>
      </div>
    </Section>
  );
}
