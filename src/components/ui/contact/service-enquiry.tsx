"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Arrow, Section, SectionHeading } from "../primitives.tsx";
import { RequiredNotice } from "../required-mark.tsx";
import { ContactServices } from "./contact-services.tsx";
import {
  initialDraft,
  validateContact,
  type ContactDraft,
} from "./contact-model.ts";
import { contactEntryHref } from "./contact-entry.ts";
import styles from "./contact.module.css";

export function ServiceEnquiry({
  branch,
}: {
  branch: "websites" | "consulting";
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
  return (
    <Section id="enquiry">
      <SectionHeading
        title={
          branch === "websites"
            ? "Let's Plan Your Website"
            : "Let's Plan Your Next Step"
        }
      >
        Select all the services you would like help with. You can share your
        project details on the next page.
      </SectionHeading>
      <div className={styles.composition}>
        <form
          className={`${styles.layout} ${styles.enquiry}`}
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
            draft={draft}
            update={update}
            error={error}
            onBlur={() => setError(validateContact(draft, 0).services)}
            announce={setAnnouncement}
            detailsOpen
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
