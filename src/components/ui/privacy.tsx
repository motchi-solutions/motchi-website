import type { ReactNode } from "react";
import { contactEmail } from "../../lib/config/sites.ts";
import { Container, Eyebrow } from "./primitives.tsx";

/* Motchi's privacy policy, written for PIPEDA (Canada's federal private-sector
   privacy law; Ontario has no general private-sector law of its own).
   Sources: Office of the Privacy Commissioner of Canada, "PIPEDA fair
   information principles" and "Guidelines for obtaining meaningful consent"
   (https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/).

   Keep it true to the code: when the contact fields, providers, storage,
   analytics, or retention change, update the matching section and `updated`.
   Have it reviewed by an Ontario privacy lawyer before relying on it. */

export const privacyUpdated = { iso: "2026-11-12", label: "November 12, 2026" };

const link =
  "text-primary underline decoration-primary/40 underline-offset-4 transition-[text-decoration-color] duration-(--motion-hover) ease-(--ease-hover) hover:decoration-primary motion-reduce:transition-none";

const email = (
  <a href={`mailto:${contactEmail}`} className={link}>
    {contactEmail}
  </a>
);

const glance = [
  "We collect only what you send us through the contact form or by email, and use it to reply and discuss your project.",
  "No analytics, advertising trackers, or cookies.",
  "We never sell your information or add you to a mailing list.",
  "Enquiries that don't become projects are deleted within 12 months.",
  "You can ask to see, correct, or delete your information at any time.",
];

function Term({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-semibold text-foreground">{term}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <p>
          When you send an enquiry through our contact form, we receive the
          answers you give. We ask only for what we need to reply well.
        </p>
        <dl className="grid gap-4">
          <Term term="Always">
            Your name, your email address, and the services you're interested
            in.
          </Term>
          <Term term="For website and consulting enquiries">
            The kind of business or project, its stage, and your timeline.
          </Term>
          <Term term="For product enquiries">
            Your message, and the product it's about.
          </Term>
          <Term term="Optional">
            A budget range, your business or organization, your website, your
            phone number, how you found us, and any extra details you choose to
            share. You can leave all of these blank.
          </Term>
          <Term term="When you visit any page">
            Our hosting provider records technical information to deliver and
            protect the site: your IP address, browser type, the page you asked
            for, and the time. We don't combine this with your enquiry.
          </Term>
        </dl>
        <p>
          If you email us directly, we receive your email address and whatever
          you include in your message.
        </p>
        <p>
          Please don't send sensitive information such as health details,
          financial account numbers, or passwords. We don't need it to reply.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it and your consent",
    body: (
      <>
        <p>We use your information only to:</p>
        <ul className="grid list-disc gap-2 ps-5">
          <li>reply to your enquiry and answer your questions;</li>
          <li>understand your needs and prepare a proposal or estimate;</li>
          <li>deliver the work if you become a client;</li>
          <li>protect the contact form from spam and abuse.</li>
        </ul>
        <p>
          We don't use your enquiry for marketing, and we never sell, rent, or
          trade it.
        </p>
        <p>
          By sending the form or emailing us, you consent to these uses. You can
          withdraw your consent at any time by emailing {email}. We'll then stop
          using your information and delete it, unless the law requires us to
          keep it. If you withdraw consent, we may not be able to continue
          discussing your project.
        </p>
      </>
    ),
  },
  {
    id: "who-processes-it",
    title: "Who processes your information",
    body: (
      <>
        <p>
          We use a small number of service providers to run the website and our
          email. They handle your information on our behalf, only to provide
          their service to us.
        </p>
        <dl className="grid gap-4">
          <Term term="Brevo (France)">
            Sends your enquiry to our inbox and a short acknowledgement to you.
            Brevo stores this data in the European Union and keeps a record of
            each email's delivery.
          </Term>
          <Term term="Google Workspace (Google LLC, United States)">
            Hosts our business inbox, where your enquiry and our replies are
            kept. Google may store this data in the United States and other
            countries.
          </Term>
          <Term term="Vercel (Vercel Inc., United States)">
            Hosts this website and runs the contact form. Its server logs are
            processed in the United States.
          </Term>
        </dl>
        <p>
          We don't share your information with anyone else unless the law
          requires it, for example in response to a valid court order.
        </p>
      </>
    ),
  },
  {
    id: "outside-canada",
    title: "Information stored outside Canada",
    body: (
      <p>
        Because of the providers above, your information is stored and processed
        in the United States and the European Union. While it's there, it's
        subject to those countries' laws, which may allow their courts, law
        enforcement, and national security authorities to access it.
      </p>
    ),
  },
  {
    id: "on-your-device",
    title: "What stays on your device",
    body: (
      <>
        <p>
          <strong className="font-semibold text-foreground">
            Saved progress.
          </strong>{" "}
          The contact form has a "Save my progress" option, which is off by
          default. If you turn it on, one draft is saved in this browser's local
          storage so you can come back later. The draft is never sent to us
          until you submit your enquiry. It expires 3 days after its last save
          and is removed the next time you open the form. You can clear it from
          the form at any time, and starting a new enquiry replaces it. Anyone
          using the same browser may be able to see a saved draft, so we
          recommend leaving saving off on shared devices.
        </p>
        <p>
          <strong className="font-semibold text-foreground">
            Offline files.
          </strong>{" "}
          The site saves copies of its own files, such as styles, scripts,
          images, and an offline notice, so pages load faster and you see a
          helpful message when you lose your connection. These copies contain no
          personal information. You can remove them by clearing this site's data
          in your browser settings.
        </p>
        <p>
          <strong className="font-semibold text-foreground">Cookies.</strong>{" "}
          The site does not set cookies.
        </p>
      </>
    ),
  },
  {
    id: "no-tracking",
    title: "No tracking",
    body: (
      <>
        <p>
          The website has no analytics, advertising trackers, tracking pixels,
          social media widgets, or third-party scripts. Our fonts are served
          from our own site.
        </p>
        <p>
          Like most email services, Brevo counts how many of our emails are
          opened and how many of their links are clicked. We've set it to count
          these only as anonymous totals, so they're never linked to you.
        </p>
        <p>
          If we ever add visitor statistics, we'll choose a tool that doesn't
          identify you, and we'll update this policy before we start.
        </p>
      </>
    ),
  },
  {
    id: "how-long",
    title: "How long we keep it",
    body: (
      <dl className="grid gap-4">
        <Term term="Enquiries that don't lead to a project">
          Deleted from our inbox within 12 months of our last exchange.
        </Term>
        <Term term="If you become a client">
          We keep project correspondence for as long as we work together.
          Business and tax records are kept for 6 years, as Canadian tax law
          requires.
        </Term>
        <Term term="Email delivery records">
          Kept by Brevo for a limited time under its retention schedule, then
          deleted.
        </Term>
        <Term term="Spam protection">
          A scrambled, one-way code made from your email address, kept in the
          server's memory for up to 1 hour to limit repeated sending.
        </Term>
        <Term term="Server logs">
          Kept by Vercel for a short time under its retention settings.
        </Term>
        <Term term="Saved drafts">On your device only, for up to 3 days.</Term>
      </dl>
    ),
  },
  {
    id: "how-we-protect-it",
    title: "How we protect it",
    body: (
      <>
        <ul className="grid list-disc gap-2 ps-5">
          <li>Every page and form submission uses an encrypted connection.</li>
          <li>
            A strict security policy stops other websites' scripts from running
            on ours.
          </li>
          <li>
            The contact form checks every submission on our server, uses signed,
            expiring form codes, and limits repeated sending.
          </li>
          <li>
            The keys for our email service stay on our server and are never sent
            to your browser.
          </li>
          <li>
            Access to our inbox and provider accounts is limited to the people
            who need it and protected with two-step verification.
          </li>
        </ul>
        <p>
          No system is perfectly secure. If a breach of your information creates
          a real risk of significant harm, we'll tell you and the Office of the
          Privacy Commissioner of Canada, as the law requires.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>You can ask us to:</p>
        <ul className="grid list-disc gap-2 ps-5">
          <li>
            tell you what information we hold about you, how we've used it, and
            who we've shared it with;
          </li>
          <li>correct information that's inaccurate or incomplete;</li>
          <li>delete your information, or withdraw your consent.</li>
        </ul>
        <p>
          Email {email} with "Privacy request" in the subject. To protect your
          information, we may ask you to confirm your identity, usually by
          replying from the email address you used. We'll respond within 30
          days, free of charge. If we can't fully meet a request, for example
          because the law requires us to keep a record, we'll explain why.
        </p>
      </>
    ),
  },
  {
    id: "complaints",
    title: "Concerns and complaints",
    body: (
      <p>
        Please contact us first so we can try to resolve your concern. If you're
        not satisfied with our answer, you can complain to the{" "}
        <a
          href="https://www.priv.gc.ca/en/report-a-concern/"
          className={link}
          rel="noreferrer"
        >
          Office of the Privacy Commissioner of Canada
        </a>{" "}
        (toll-free 1-800-282-1376).
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This website is meant for businesses and adults. We don't knowingly
        collect information from children. If you believe a child has sent us
        information, please contact us and we'll delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We'll update this page, and the date at the top, whenever our practices
        or service providers change. If a change affects how we use information
        we already hold, we'll ask for your consent first.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        Our Privacy Officer is accountable for how Motchi handles personal
        information. You can reach them at {email}. Motchi Solutions is based in
        Toronto, Ontario, Canada.
      </p>
    ),
  },
];

export function PrivacyNotice() {
  return (
    <Container className="py-section">
      <article className="mx-auto w-full max-w-reading">
        <header className="page-introduction">
          <Eyebrow>Your Information</Eyebrow>
          <h1 className="text-h2 font-medium">Privacy Policy</h1>
          <p className="mt-3 text-muted">
            Updated on{" "}
            <time dateTime={privacyUpdated.iso}>{privacyUpdated.label}</time>
          </p>
        </header>

        <div className="privacy-content leading-relaxed text-muted">
          <p>
            This policy explains how Motchi Solutions, including Motchi Websites
            and Motchi Consulting, handles the personal information you share
            through motchi.ca. We follow Canada's Personal Information
            Protection and Electronic Documents Act (PIPEDA).
          </p>

          <section
            aria-labelledby="privacy-glance"
            className="rounded-(--radius-panel) border border-border bg-surface p-(--space-inset)"
          >
            <h2
              id="privacy-glance"
              className="mb-3 text-xl font-semibold text-foreground"
            >
              At a glance
            </h2>
            <ul className="grid list-disc gap-2 ps-5">
              {glance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <nav aria-labelledby="privacy-contents">
            <h2
              id="privacy-contents"
              className="mb-3 text-xl font-semibold text-foreground"
            >
              On this page
            </h2>
            <ol className="grid list-decimal gap-1 ps-5">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={link}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="grid gap-4"
            >
              <h2
                id={`${section.id}-title`}
                className="text-xl font-semibold text-foreground"
              >
                {index + 1}. {section.title}
              </h2>
              {section.body}
            </section>
          ))}
        </div>
      </article>
    </Container>
  );
}
