"use client";
import { contactEmail } from "@motchi/config/sites";
// Root-layout failures cannot depend on the shared shell, fonts, or styles.
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          maxWidth: "42rem",
          margin: "auto",
          lineHeight: 1.6,
        }}
      >
        <main>
          <h1>We Couldn't Load This Page</h1>
          <p>
            Please try again, or email {contactEmail}. If you were sending an
            enquiry, check for confirmation before submitting again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ minHeight: 44, padding: "0.75rem 1.5rem" }}
          >
            Try Again
          </button>
          <p>
            <a href="/">Back to Home</a> ·{" "}
            <a href={`mailto:${contactEmail}`}>Email Motchi</a>
          </p>
        </main>
      </body>
    </html>
  );
}
