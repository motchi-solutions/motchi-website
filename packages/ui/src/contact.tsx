import { type Branch, contactEmail, family } from "@motchi/brand";
import { createContactToken } from "@motchi/email";
import { type ContactInput, interests } from "@motchi/email/validation";
import { Container, Eyebrow } from "./primitives";

const messages: Record<string, string> = {
  sent: "Thank you. Your enquiry has been sent. We typically respond within 2–3 business days.",
  partial:
    "Your enquiry has been sent, but we could not send your confirmation email. There is no need to submit again. We typically respond within 2–3 business days.",
  invalid:
    "Your enquiry was not sent. Check the fields below and re-enter your details. You can also email us directly.",
  expired:
    "This form has expired or was submitted too quickly. Please re-enter your details and try again.",
  unavailable:
    "We could not confirm delivery. Please email us directly rather than submitting again.",
  limited:
    "Too many enquiries have been submitted. Please try again later or email us directly.",
  busy: "A submission is already being processed or the service is busy. Please wait before trying again.",
};
const fieldErrors: Record<keyof ContactInput, string> = {
  name: "Enter a name of up to 100 characters, without line breaks.",
  email: "Enter a valid email address.",
  company: "Use up to 150 characters without line breaks.",
  interest: "Choose an area of interest.",
  message: "Enter 10–5,000 characters.",
  website: "Enter a complete http or https URL without account credentials.",
};
export function ContactPageContent({
  branch,
  status,
  fields = "",
}: {
  branch: Branch;
  status?: string;
  fields?: string;
}) {
  const message = status ? messages[status] : undefined;
  const sent = status === "sent" || status === "partial";
  let token: string | null = null;
  try {
    token = createContactToken();
  } catch {
    /* Unconfigured deployments retain direct email access. */
  }
  const invalidFields = new Set(
    fields.split(",").filter((key) => key in fieldErrors),
  );
  const inputClass =
    "mt-2 min-h-12 w-full rounded-none border border-border bg-surface px-4 py-3 text-base";
  const props = (field: keyof ContactInput) => ({
    id: field,
    name: field,
    "aria-invalid": invalidFields.has(field) || undefined,
    "aria-describedby": invalidFields.has(field) ? `${field}-error` : undefined,
  });
  const error = (field: keyof ContactInput) =>
    invalidFields.has(field) ? (
      <p
        id={`${field}-error`}
        className="mt-2 text-sm font-semibold text-primary"
      >
        {fieldErrors[field]}
      </p>
    ) : null;
  return (
    <Container className="py-section">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
        <div>
          <Eyebrow>{family[branch].name} / Contact</Eyebrow>
          <h1 className="text-section font-medium tracking-tight">
            Tell us what you have in mind.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            A clear problem, an early idea, or a question about where to start.
            We’d like to hear it.
          </p>
          <p className="mt-8 max-w-md leading-relaxed">
            We typically respond with next steps or an initial quote within{" "}
            <strong>2–3 business days</strong>.
          </p>
          <a
            className="mt-8 inline-flex min-h-12 items-center underline underline-offset-4"
            href={`mailto:${contactEmail}`}
          >
            {contactEmail}
          </a>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">
            Share only what we need to understand your enquiry. Please leave out
            passwords, sensitive personal information, and confidential records.
          </p>
        </div>
        <div id="contact-form">
          <h2 className="sr-only">Send an enquiry</h2>
          {message && (
            <div
              role={sent ? "status" : "alert"}
              className="mb-8 border-l-4 border-primary bg-surface p-5 leading-relaxed"
            >
              <p>{message}</p>
            </div>
          )}
          {!token && !sent && (
            <p className="mb-8 border border-border p-5">
              Online enquiries are temporarily unavailable. Please contact us by
              email.
            </p>
          )}
          {token && !sent && (
            <form action="/api/contact" method="post" className="space-y-6">
              <input type="hidden" name="token" value={token} />
              <div hidden aria-hidden="true">
                <label htmlFor="fax">Leave this field empty</label>
                <input id="fax" name="fax" autoComplete="off" tabIndex={-1} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold">
                    Name <span className="font-normal">(required)</span>
                  </label>
                  <input
                    {...props("name")}
                    autoComplete="name"
                    required
                    maxLength={100}
                    className={inputClass}
                  />
                  {error("name")}
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-semibold">
                    Email <span className="font-normal">(required)</span>
                  </label>
                  <input
                    {...props("email")}
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    className={inputClass}
                  />
                  {error("email")}
                </div>
              </div>
              <div>
                <label htmlFor="company" className="text-sm font-semibold">
                  Company <span className="font-normal">(optional)</span>
                </label>
                <input
                  {...props("company")}
                  autoComplete="organization"
                  maxLength={150}
                  className={inputClass}
                />
                {error("company")}
              </div>
              <div>
                <label htmlFor="interest" className="text-sm font-semibold">
                  {branch === "consulting"
                    ? "Area of interest"
                    : "What can we help with?"}{" "}
                  <span className="font-normal">(required)</span>
                </label>
                <select
                  {...props("interest")}
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {interests[branch].map((interest) => (
                    <option key={interest}>{interest}</option>
                  ))}
                </select>
                {error("interest")}
              </div>
              {branch === "websites" && (
                <div>
                  <label htmlFor="website" className="text-sm font-semibold">
                    Existing website URL{" "}
                    <span className="font-normal">(optional)</span>
                  </label>
                  <input
                    {...props("website")}
                    type="url"
                    autoComplete="url"
                    placeholder="https://"
                    maxLength={500}
                    className={inputClass}
                  />
                  {error("website")}
                </div>
              )}
              <div>
                <label htmlFor="message" className="text-sm font-semibold">
                  Message <span className="font-normal">(required)</span>
                </label>
                <textarea
                  {...props("message")}
                  rows={6}
                  required
                  minLength={10}
                  maxLength={5000}
                  className={inputClass}
                />
                {error("message")}
              </div>
              <p className="text-sm leading-relaxed text-muted">
                We use these details to respond to your enquiry. Read our{" "}
                <a href="/privacy" className="underline underline-offset-4">
                  privacy notice
                </a>
                .
              </p>
              <button
                type="submit"
                className="min-h-12 cursor-pointer bg-primary px-7 py-3 text-sm font-semibold text-inverse hover:bg-secondary"
              >
                Send enquiry{" "}
                <span aria-hidden="true" className="ml-6">
                  ↗
                </span>
              </button>
            </form>
          )}
          {sent && (
            <a
              href="/"
              className="inline-flex min-h-12 items-center underline underline-offset-4"
            >
              Return to {family[branch].name}
            </a>
          )}
        </div>
      </div>
    </Container>
  );
}
