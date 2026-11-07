import type { ContactEntry } from "./contact/contact-entry.ts";
import { createContactToken } from "../../lib/email/index.ts";
import { contactMessage } from "../../lib/email/feedback.ts";
import type { Branch } from "../../lib/brand.ts";
import { ContactExperience } from "./contact/contact-experience.tsx";
import { ContactNavigation } from "./contact/contact-navigation.tsx";
import { getContactConfiguration } from "./contact/contact-config.ts";
import { Eyebrow } from "./primitives.tsx";
import styles from "./contact/contact.module.css";

export function ContactPageContent({
  branch,
  status,
  topic,
  entry,
}: {
  branch: Branch;
  status?: string;
  fields?: string;
  topic?: string;
  entry?: ContactEntry;
}) {
  const config = getContactConfiguration(branch);
  let token: string | null = null;
  try {
    token = createContactToken();
  } catch {
    console.error("Contact form unavailable", {
      branch,
      category: "CONFIGURATION_ERROR",
    });
  }
  return (
    <>
      <ContactNavigation />
      <ContactExperience
        key={JSON.stringify([branch, topic, entry])}
        entry={entry}
        branch={branch}
        topic={topic}
        submission={{ token }}
        initialFeedback={contactMessage(status)}
      >
        <header className={styles.hero}>
          <div className={styles.contactEyebrow}>
            <Eyebrow>Contact Motchi</Eyebrow>
          </div>
          <h1 id="contact-title" tabIndex={-1}>
            {config.title}
          </h1>
          <div className={styles.heroCopy}>
            <p>{config.introduction}</p>
            <div className={styles.contactMeta}>
              <p className={styles.responseTime}>
                We usually reply within 2-3 business days
              </p>
            </div>
          </div>
        </header>
      </ContactExperience>
    </>
  );
}
