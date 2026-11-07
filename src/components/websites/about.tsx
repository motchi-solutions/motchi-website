import { Container } from "../ui/primitives.tsx";
import styles from "./landing.module.css";
export function WebsiteAbout() {
  return (
    <section id="about" className={styles.about}>
      <Container>
        <div className={styles.aboutLayout}>
          <h2>Your identity, shaped for the people you serve</h2>
          <div>
            <p>
              Appearance matters, and so does finding information, booking,
              enquiring, or buying. We consider both from the beginning.
            </p>
            <p>
              Part of the Motchi family. Based in Toronto. Working with
              businesses globally.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
