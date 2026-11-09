import { Container, HeroBrand } from "./ui/index.ts";
import { CapabilityThread } from "./capability-thread.tsx";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="solutions-title">
      <Container className={styles.composition}>
        <div className={styles.identity}>
          <HeroBrand branch="solutions" />
        </div>
        <h1 id="solutions-title" className={styles.headline}>
          <span>Technology Built Around</span> <span>Real Business Needs.</span>
        </h1>
        <div className={styles.explanation}>
          <p>
            Websites, AI, data, and automation, designed and supported around
            how your business actually works.
          </p>
        </div>
        <CapabilityThread
          websitesUrl={"/websites"}
          consultingUrl={"/consulting"}
        />
      </Container>
    </section>
  );
}
