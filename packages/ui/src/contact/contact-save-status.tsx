import styles from "./contact.module.css";
const messages = {
  off: [
    "If unchecked, your progress won't be saved after you leave.",
    "On a shared device, we recommend leaving this unchecked.",
  ],
  on: [
    "We're saving your progress as you go.",
    "One draft will be saved on this browser for 3 days.",
  ],
  error: [
    "Your changes could not be saved.",
    "Keep this page open or try another browser.",
  ],
};
export function ContactSaveStatus({
  enabled,
  failed,
}: {
  enabled: boolean;
  failed: boolean;
}) {
  const active = !enabled ? "off" : failed ? "error" : "on";
  return (
    <p
      id="save-contact-draft-hint"
      className={styles.saveStatus}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {Object.entries(messages).map(([state, sentences]) => (
        <span
          key={state}
          className={styles.saveMessage}
          data-active={state === active}
          aria-hidden="true"
        >
          {sentences.map((sentence) => (
            <span key={sentence} className={styles.saveSentence}>
              {sentence}
            </span>
          ))}
        </span>
      ))}
      <span className="sr-only">{messages[active].join(" ")}</span>
    </p>
  );
}
