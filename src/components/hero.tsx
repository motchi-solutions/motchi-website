import { ButtonLink, Container, HeroBrand, HeroTrust } from "./ui/index.ts";
import { CapabilityThread } from "./capability-thread.tsx";
import { firstCall } from "../lib/config/sites.ts";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="solutions-title">
      <Container className={styles.composition}>
        <div className={styles.identity}>
          <HeroBrand branch="solutions" />
        </div>
        <h1 id="solutions-title" className={styles.headline}>
          {/* One run of text with a line break: block-level lines make
              VoiceOver in Safari read the heading as two separate items. */}
          Websites and Smart Systems
          <br />
          for Growing Businesses.
        </h1>
        <div className={styles.explanation}>
          <p>
            Websites, AI, data, and automation, designed and supported around
            how your business actually works.
          </p>
          {/* One clear next step; the explorer below is for browsing. */}
          <div className={styles.actions}>
            <ButtonLink href="/contact">Start a Conversation</ButtonLink>
            {firstCall.url ? (
              <ButtonLink href={firstCall.url} secondary>
                Book a Free Call
              </ButtonLink>
            ) : (
              <ButtonLink href="/websites/work" secondary>
                See Our Work
              </ButtonLink>
            )}
          </div>
          <HeroTrust className={styles.trust} />
        </div>
        <CapabilityThread
          websitesUrl={"/websites"}
          consultingUrl={"/consulting"}
        />
      </Container>
    </section>
  );
}
