import { contactEmail } from "../../lib/config/sites.ts";
import { Container, Eyebrow } from "./primitives.tsx";
export function PrivacyNotice({
  frontendOnly = false,
}: {
  frontendOnly?: boolean;
}) {
  return (
    <Container className="py-section">
      <article className="mx-auto w-full max-w-reading">
        <header className="page-introduction">
          <Eyebrow>Your Information</Eyebrow>
          <h1 className="text-h2 font-medium">Privacy Notice</h1>
        </header>
        <div className="privacy-content leading-relaxed text-muted">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Information You Share
            </h2>
            <p>
              {frontendOnly ? (
                "The guided form asks about your project, business stage, timing, name, and email. You can also provide a budget, organization, website, phone number, referral source, and extra context. If you choose to save your progress, one draft is saved in local storage on this browser so you can return later. Saving is off by default. Starting fresh replaces the previous draft. Anyone using this browser may be able to access the draft. You can clear it from the form. Drafts expire after 3 days and are removed the next time you open the form."
              ) : (
                <>
                  We collect the services you select, project context, timing,
                  name, email address, and any budget, organization, website,
                  phone number, referral source, or extra details you choose to
                  provide. We use this information to respond, understand your
                  needs, and discuss a possible engagement. Please avoid sending
                  sensitive or confidential information through the form.
                </>
              )}
            </p>
          </section>
          {!frontendOnly && (
            <section>
              <h2 className="mb-3 text-xl font-semibold text-foreground">
                Saving Your Progress
              </h2>
              <p>
                Saving is off by default. If you choose to save your progress,
                one draft is stored on this browser for 3 days after its last
                save. Starting a new enquiry replaces that draft. You can clear
                it from the form. Expired drafts are removed when you next open
                the form. Anyone using this browser may be able to access a
                saved draft, so we recommend leaving saving off on shared
                devices. Drafts are not sent to Motchi until you submit your
                enquiry.
              </p>
            </section>
          )}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              How Your Information Is Handled
            </h2>
            <p>
              {frontendOnly ? (
                "The guided contact form does not currently send your answers to Motchi. If you opt in, one draft is saved only on your browser. You can contact us by email instead."
              ) : (
                <>
                  Enquiries and acknowledgements are sent through Brevo to our
                  business inbox and the email address you provide. Our hosting
                  provider processes requests to operate and protect the
                  website. These providers may process information outside your
                  country. We do not sell your enquiry information or use it to
                  subscribe you to marketing.
                </>
              )}
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Keeping and Accessing Your Information
            </h2>
            <p>
              Enquiries are retained in our business email system as needed to
              respond, manage an engagement, and meet applicable obligations.
              {!frontendOnly &&
                "Temporary abuse-prevention records expire after an hour. "}
              You can ask about access, correction, or deletion by contacting
              us; applicable obligations may require us to retain some
              information.
            </p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Tracking and Browser Storage
            </h2>
            <p>
              The website does not include advertising or analytics trackers.
              The short, decorative brand introduction plays on a new page load
              and does not store a playback record in your browser. Core content{" "}
              {frontendOnly
                ? "is available without JavaScript. The guided contact form needs JavaScript; email is available as an alternative."
                : "and enquiry forms work without JavaScript."}
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
