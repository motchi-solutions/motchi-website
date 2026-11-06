import { createContactToken } from "@motchi/email";
import { contactMessage } from "@motchi/email/feedback";
import type { Branch } from "@motchi/brand";
import { ContactExperience } from "./contact/contact-experience";
import { ContactNavigation } from "./contact/contact-navigation";
import { getContactConfiguration } from "./contact/contact-config";
import { Eyebrow } from "./primitives";
import styles from "./contact/contact.module.css";

export function ContactPageContent({
  branch,
  status,
  topic,
}: {
  branch: Branch;
  status?: string;
  fields?: string;
  topic?: string;
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
