"use client";

import { useId } from "react";
import { LuClock3, LuHandHeart, LuSlidersHorizontal } from "react-icons/lu";
import { ButtonLink, Container } from "./ui/primitives.tsx";
import { HeroBrand } from "./ui/hero-brand.tsx";
import { useTabs } from "./ui/use-tabs.ts";
import styles from "./about-hero.module.css";

/* Short copy, one idea at a time: each principle gets a small drawing that
   plays when chosen, so the hero explains itself without paragraphs. */
const principles = [
  {
    label: "Spend wisely",
    icon: LuSlidersHorizontal,
    title: "Start with what fits",
    description: "Clear costs you agree to before work begins.",
  },
  {
    label: "Save time",
    icon: LuClock3,
    title: "Make room for better work",
    description: "Technology handles the repetition, so your team can focus.",
  },
  {
    label: "Grow together",
    icon: LuHandHeart,
    title: "Move forward together",
    description: "Your business knowledge and our technology support.",
  },
] as const;

function Drawing({ index }: { index: number }) {
  if (index === 0)
    return (
      <svg viewBox="0 0 320 180" className={styles.drawing} aria-hidden="true">
        <line className={styles.ground} x1="40" y1="150" x2="280" y2="150" />
        <rect
          className={styles.bar}
          x="62"
          y="96"
          width="44"
          height="54"
          rx="4"
        />
        <rect
          className={`${styles.bar} ${styles.barFit}`}
          x="138"
          y="70"
          width="44"
          height="80"
          rx="4"
        />
        <rect
          className={styles.bar}
          x="214"
          y="40"
          width="44"
          height="110"
          rx="4"
        />
        <line className={styles.fitLine} x1="40" y1="70" x2="280" y2="70" />
        <circle className={styles.pop} cx="160" cy="70" r="6" />
      </svg>
    );
  if (index === 1)
    return (
      <svg viewBox="0 0 320 180" className={styles.drawing} aria-hidden="true">
        <circle className={styles.dial} cx="160" cy="90" r="62" />
        <circle
          className={styles.sweep}
          cx="160"
          cy="90"
          r="62"
          pathLength="100"
          transform="rotate(-90 160 90)"
        />
        <line className={styles.hand} x1="160" y1="90" x2="160" y2="44" />
        <circle className={styles.hub} cx="160" cy="90" r="5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 320 180" className={styles.drawing} aria-hidden="true">
      {/* Two separate lines (your business, our support) join, then rise as one. */}
      <path
        className={`${styles.path} ${styles.pathGold}`}
        pathLength="100"
        d="M40 150C90 150 110 112 160 108"
      />
      <path
        className={`${styles.path} ${styles.pathBurgundy}`}
        pathLength="100"
        d="M40 72C90 72 112 106 160 110"
      />
      <path
        className={`${styles.path} ${styles.pathGold} ${styles.pathJoined}`}
        pathLength="100"
        d="M160 104C210 100 240 66 284 30"
      />
      <path
        className={`${styles.path} ${styles.pathBurgundy} ${styles.pathJoined}`}
        pathLength="100"
        d="M160 113C212 109 244 75 288 39"
      />
      <circle className={styles.pop} cx="160" cy="108" r="8" />
    </svg>
  );
}

export function AboutHero() {
  const id = useId();
  const { selected, tabId, panelId, tabProps } = useTabs(principles.length);

  return (
    <section className={styles.hero} aria-labelledby="about-title">
      <Container>
        <div className={styles.layout}>
          <header className={styles.introduction} data-entry-reveal="">
            <HeroBrand branch="solutions" className={styles.brand} />
            <h1 id="about-title">
              Technology That Gives You <em>Room to Grow.</em>
            </h1>
            <p>
              Technology built around people, with clear pricing and support
              after launch.
            </p>
            <div className={styles.actions}>
              <ButtonLink href="/contact">
                Tell Us About Your Business
              </ButtonLink>
              <ButtonLink href="/#businesses" secondary>
                See How We Can Help
              </ButtonLink>
            </div>
          </header>
          <div
            className={`${styles.card} ms-surface-feature`}
            data-entry-reveal=""
          >
            <p className={styles.cardTitle} id={`${id}-label`}>
              What we stand for
            </p>
            <div
              role="tablist"
              aria-labelledby={`${id}-label`}
              className={styles.tabs}
            >
              {principles.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} {...tabProps(index)}>
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            {principles.map((item, index) => (
              <div
                key={item.label}
                id={panelId(index)}
                role="tabpanel"
                aria-labelledby={tabId(index)}
                hidden={selected !== index}
                // biome-ignore lint/a11y/noNoninteractiveTabindex: A tab panel without focusable content needs keyboard focus.
                tabIndex={0}
                className={styles.panel}
              >
                <div className={styles.stage}>
                  {selected === index && <Drawing index={index} />}
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
