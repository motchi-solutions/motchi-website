"use client";
import { useId, useState, type ReactNode } from "react";
import styles from "./content-disclosure.module.css";

export function ContentDisclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={styles.root}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
        >
          {title}
          <svg
            viewBox="0 0 20 20"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            data-open={open}
          >
            <path d="m5 7 5 5 5-5" />
          </svg>
        </button>
      </h3>
      <div
        id={id}
        className={styles.panel}
        data-open={open}
        inert={!open}
        aria-hidden={!open}
      >
        <div className={styles.clip}>{children}</div>
      </div>
    </div>
  );
}
