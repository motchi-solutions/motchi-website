import type { ReactNode } from "react";
import { LuCheck } from "react-icons/lu";
import styles from "./contact.module.css";

// The result structure is shared so future outcomes can supply their own icon and copy.
export function ContactResultPanel({
  title,
  titleId,
  icon,
  children,
  actions,
  role = "status",
}: {
  title: string;
  titleId: string;
  icon: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  role?: "status" | "alert";
}) {
  return (
    <section
      className={styles.resultPanel}
      role={role}
      aria-labelledby={titleId}
    >
      <div className={styles.resultIcon} aria-hidden="true">
        {icon}
      </div>
      <div className={styles.resultContent}>
        <h2 id={titleId} className={styles.resultTitle} tabIndex={-1}>
          {title}
        </h2>
        <div className={styles.resultDescription}>{children}</div>
        {actions && <div className={styles.resultActions}>{actions}</div>}
      </div>
    </section>
  );
}

export function ContactSuccess({
  message,
  children,
}: {
  message?: string;
  children?: ReactNode;
}) {
  return (
    <ContactResultPanel
      title="Your enquiry has been sent"
      titleId="contact-success-heading"
      icon={
        <LuCheck className={styles.resultCheck} size={30} strokeWidth={2.25} />
      }
      actions={children}
    >
      <p>
        {message ??
          "Thank you for reaching out. We usually reply within 2-3 business days."}
      </p>
    </ContactResultPanel>
  );
}
