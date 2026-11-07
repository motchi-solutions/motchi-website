// Safe to render in server pages or client feedback; no secrets or provider output.
export const contactMessages = {
  sent: "Thank you. Your enquiry has been sent. We typically respond within 2–3 business days.",
  partial:
    "Your enquiry has been sent, but we could not send your confirmation email. There is no need to submit again. We typically respond within 2–3 business days.",
  invalid:
    "Your enquiry was not sent. Check the fields below and re-enter your details. You can also email us directly.",
  expired:
    "This form has expired or was submitted too quickly. Please re-enter your details and try again.",
  unavailable:
    "We could not confirm delivery. Please email us directly rather than submitting again.",
  configuration:
    "Online enquiries are temporarily unavailable. Please email us directly.",
  limited:
    "Too many enquiries have been submitted. Please try again later or email us directly.",
  busy: "A submission is already being processed or the service is busy. Please wait before trying again.",
} as const;
export type ContactStatus = keyof typeof contactMessages;
export function contactMessage(status?: string): string | undefined {
  return status && Object.hasOwn(contactMessages, status)
    ? contactMessages[status as ContactStatus]
    : undefined;
}
