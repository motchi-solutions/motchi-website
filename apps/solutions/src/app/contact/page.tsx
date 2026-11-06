import type { Metadata } from "next";
import { Eyebrow } from "@motchi/ui/primitives";
import { ContactNavigation } from "@motchi/ui/contact-navigation";
import { ContactExperience } from "@motchi/ui/contact-experience";
import styles from "@motchi/ui/contact.module.css";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Explore how Motchi can support your goals, from websites and software to everyday technology support.",
  alternates: { canonical: "/contact" },
};
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  return (
    <>
      <ContactNavigation />
      <ContactExperience topic={topic}>
        <header className={styles.hero}>
          <div className={styles.contactEyebrow}>
            <Eyebrow>Contact Motchi</Eyebrow>
          </div>
          <h1 id="contact-title" tabIndex={-1}>
            Let's Explore How We Can Help
          </h1>
          <div className={styles.heroCopy}>
            <p>
              Please share what you have in mind. New ideas and organizations
              are welcome. We can help from planning to delivery.
            </p>
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
