import type { ContactEntry } from "./contact/contact-entry.ts";
import { prepareContactForm } from "../../lib/email/index.ts";
import { contactMessage } from "../../lib/email/feedback.ts";
import type { Branch } from "../../lib/brand.ts";
import { ContactExperience } from "./contact/contact-experience.tsx";
import { ContactNavigation } from "./contact/contact-navigation.tsx";
import { getContactConfiguration } from "./contact/contact-config.ts";
import { ButtonLink } from "./primitives.tsx";
import { firstCall } from "../../lib/config/sites.ts";
import styles from "./contact/contact.module.css";

export function ContactPageContent({
  branch,
  status,
  topic,
  entry,
}: {
  branch: Branch;
  status?: string;
  topic?: string;
  entry?: ContactEntry;
}) {
  const config = getContactConfiguration("solutions");
  // Checked before rendering, so the form never invites a submission that
  // cannot be sent.
  const ready = prepareContactForm(branch);
  return (
    <>
      <ContactNavigation />
      <ContactExperience
        key={JSON.stringify([branch, topic, entry])}
        entry={entry}
        branch={branch}
        topic={topic}
        submission={{
          token: ready?.token ?? null,
          siteKey: ready?.siteKey ?? null,
        }}
        initialFeedback={contactMessage(status)}
      >
        <header className={styles.hero}>
          <h1 id="contact-title" tabIndex={-1}>
            {config.title}
          </h1>
          <div className={styles.heroCopy}>
            <p className="text-balance">{config.introduction}</p>
            {/* An alternative to the form, so it reads as its own choice.
                Without a booking link, the free call stays as a plain fact. */}
            {firstCall.url && (
              <div className="mt-6 mb-3 flex flex-col items-center gap-3 sm:mb-0">
                <p>
                  Prefer to talk first? Your first {firstCall.length} call is
                  free.
                </p>
                <ButtonLink href={firstCall.url} target="_blank" secondary>
                  Book a free call
                  <span className="sr-only"> (opens in a new tab)</span>
                </ButtonLink>
              </div>
            )}
            {!firstCall.url && (
              <p className="mt-3">
                Your first {firstCall.length} call is free.
              </p>
            )}
          </div>
        </header>
      </ContactExperience>
    </>
  );
}
