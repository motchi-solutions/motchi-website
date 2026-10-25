import { contactEmail } from "@motchi/config/sites";
import { Container, Eyebrow } from "./primitives";
export function PrivacyNotice() {
  return (
    <Container className="py-section">
      <article className="mx-auto w-full max-w-reading">
        <header className="page-introduction">
          <Eyebrow>Your Information</Eyebrow>
          <h1 className="text-h2 font-medium">Privacy Notice</h1>
        </header>
        <div className="mt-10 space-y-8 leading-relaxed text-muted">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Information You Share
            </h2>
            <p>
              We collect the name, email address, company, area of interest,
              message, and any website URL or project budget you choose to
              provide. We use this information to respond, understand your
              needs, and discuss a possible engagement. Please avoid sending
              sensitive or confidential information through the form.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              How Your Information Is Handled
            </h2>
            <p>
              Enquiries and acknowledgements are sent through Brevo to our
              business inbox and the email address you provide. Our hosting
              provider processes requests to operate and protect the website.
              These providers may process information outside your country. We
              do not sell your enquiry information or use it to subscribe you to
              marketing.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Keeping and Accessing Your Information
            </h2>
            <p>
              Enquiries are retained in our business email system as needed to
              respond, manage an engagement, and meet applicable obligations.
              Temporary abuse-prevention records expire after an hour. You can
              ask about access, correction, or deletion by contacting us;
              applicable obligations may require us to retain some information.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Tracking and Browser Storage
            </h2>
            <p>
              The website does not include advertising or analytics trackers.
              The short, decorative brand introduction plays on a new page load
              and does not store a playback record in your browser. Core content
              and enquiry forms work without JavaScript.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Privacy Questions
            </h2>
            <p>
              Contact{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary underline underline-offset-4"
              >
                {contactEmail}
              </a>{" "}
              with privacy questions.
            </p>
          </section>
        </div>
      </article>
    </Container>
  );
}
