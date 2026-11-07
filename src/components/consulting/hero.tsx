import Image from "next/image";
import { branchHref } from "../../lib/config/navigation.ts";
import { ButtonLink, Container, HeroBrand } from "../ui/index.ts";
import styles from "./landing.module.css";

export function Hero() {
  return (
    <section id="overview" className={styles.hero}>
      <Container>
        <div className={styles.heroLayout}>
          <div className={styles.introduction}>
            <HeroBrand branch="consulting" light className={styles.identity} />
            <h1>
              Technology Advice.
              <br />
              Hands-On Support.
            </h1>
            <p className={styles.heroCopy}>
              Practical technology consulting and hands-on implementation for
              AI, data, and business systems. We start with what your team
              needs, then help put the right solution to work.
            </p>
            <div className={styles.actions}>
              <ButtonLink href="#enquiry" light>
                Start a Conversation
              </ButtonLink>
              <ButtonLink
                href={branchHref("consulting", "/capabilities")}
                light
                secondary
              >
                Explore Our Capabilities
              </ButtonLink>
            </div>
          </div>
          <aside className={styles.heroAside}>
            <div className={styles.mark} aria-hidden="true">
              <Image
                src="/brand/mc-logo.svg"
                alt=""
                width={1095}
                height={1095}
                preload
              />
            </div>
            <h2>What is getting in the way of doing the work?</h2>
            <p>
              A slow process. An unclear platform decision. Data you can't
              depend on. Let's start there.
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
