import { getSites } from "@motchi/config/env";
import { Container, HeroBrand } from "@motchi/ui";
import { CapabilityThread } from "./capability-thread";
import styles from "./hero.module.css";

export function Hero() {
  const sites = getSites();
  return (
    <section className={styles.hero} aria-labelledby="solutions-title">
      <Container className={styles.composition}>
        <div className={styles.identity}>
          <HeroBrand branch="solutions" />
        </div>
        <h1 id="solutions-title" className={styles.headline}>
          <span>Technology Built</span> <span>Around Real</span>{" "}
          <span>Business Needs.</span>
        </h1>
        <div className={styles.explanation}>
          <p>
            Websites, AI, data, automation, and technology consulting. <br />
            Designed, implemented, and supported around how your business
            actually works.
          </p>
        </div>
        <CapabilityThread
          websitesUrl={sites.websites.url}
          consultingUrl={sites.consulting.url}
        />
      </Container>
    </section>
  );
}
