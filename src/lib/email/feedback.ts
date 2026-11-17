/* Contact results, safe to show anywhere: no secrets, provider output, or
   internal detail. Each says what happened, whether the enquiry arrived, and
   what to do next; email is always offered as another way in.

   - invalid / verification / expired / limited: the visitor can fix or retry.
   - failed: definitely not sent (our side); retrying later is safe.
   - unavailable: delivery unknown (a timeout); email instead, so nothing is
     sent twice.
   - configuration: online sending is switched off; email instead. */
export const contactMessages = {
  sent: "Thank you. Your enquiry has been sent. We usually reply within 2-3 business days.",
  partial:
    "Your enquiry has been sent, but we couldn't send your confirmation email. There's no need to send it again. We usually reply within 2-3 business days.",
  invalid:
    "Some answers need another look. Please check the highlighted fields and try again.",
  verification:
    "We couldn't confirm this was sent by a person. Please complete the check above the Send button and try again.",
  expired:
    "The form timed out before it was sent. Please try again; your answers are still here.",
  limited:
    "You've sent several enquiries in a short time. Please try again later, or email us.",
  busy: "Your enquiry is already being sent. Please wait a moment before trying again.",
  failed:
    "Your enquiry wasn't sent because of a problem on our side. Please try again in a few minutes, or email us.",
  unavailable:
    "We couldn't confirm your enquiry arrived. To avoid sending it twice, please email us instead of trying again.",
  configuration:
    "Online enquiries are temporarily unavailable. Please email us instead.",
} as const;
export type ContactStatus = keyof typeof contactMessages;

/** Server-side problems carry a reference so a visitor can quote it. */
export const referencedStatuses: readonly ContactStatus[] = [
  "failed",
  "unavailable",
  "configuration",
];

export function contactMessage(
  status?: string,
  details: { retryMinutes?: number } = {},
): string | undefined {
  if (!status || !Object.hasOwn(contactMessages, status)) return undefined;
  if (
    status === "limited" &&
    details.retryMinutes &&
    details.retryMinutes > 0
  ) {
    const minutes = Math.min(Math.ceil(details.retryMinutes), 24 * 60);
    const wait =
      minutes >= 90
        ? `about ${Math.round(minutes / 60)} hours`
        : minutes === 1
          ? "about a minute"
          : `about ${minutes} minutes`;
    return `You've sent several enquiries in a short time. Please try again in ${wait}, or email us.`;
  }
  return contactMessages[status as ContactStatus];
}

/** A short, harmless code shared by the server log and the visitor. */
export function isReference(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z0-9]{8}$/.test(value);
}
