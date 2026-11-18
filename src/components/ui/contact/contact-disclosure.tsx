"use client";
import { useId, useState, type ReactNode } from "react";
import styles from "./contact.module.css";

export function ContactDisclosure({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={styles.serviceDetails}>
      <h3 className={styles.detailsHeading}>
        <button
          type="button"
          className={styles.disclosureToggle}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
        >
          <span>
            {title} <span className={styles.optional}>(optional)</span>
          </span>
          <svg
            className={styles.disclosureIcon}
            data-open={open}
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h3>
      <div
        id={id}
        className={`${styles.conditional} ${styles.disclosurePanel}`}
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.conditionalClip}>{children}</div>
      </div>
    </div>
  );
}
