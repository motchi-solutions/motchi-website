"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  LuClock3,
  LuHandHeart,
  LuSlidersHorizontal,
  LuListChecks,
  LuClipboardCheck,
  LuWrench,
  LuCopy,
  LuWorkflow,
  LuUsers,
  LuStore,
  LuHandshake,
  LuMessagesSquare,
} from "react-icons/lu";
import { ButtonLink, Container, Eyebrow } from "@motchi/ui/primitives";
import styles from "./about-hero.module.css";
import hero from "./exploration-hero.module.css";

const beliefs = [
  {
    id: "budget",
    label: "Spend Wisely",
    icon: LuSlidersHorizontal,
    title: "Start With What Fits",
    example: [
      ["Set your priorities", "Focus on what helps now", LuListChecks],
      [
        "Agree on the cost",
        "Know what is included before we start",
        LuClipboardCheck,
      ],
      ["Build what you need", "Stay focused on the agreed scope", LuWrench],
    ],
    description:
      "A useful starting point, with clear costs you agree to before work begins.",
  },
  {
    id: "time",
    label: "Save Time",
    icon: LuClock3,
    title: "Make Room for Better Work",
    example: [
      ["Find the busywork", "The tasks you keep repeating", LuCopy],
      ["Connect your tools", "Fewer manual steps to manage", LuWorkflow],
      ["Make time for people", "Customers, ideas, and better work", LuUsers],
    ],
    description:
      "Let technology handle the repetition so your team can focus on work that matters.",
  },
  {
    id: "together",
    label: "Grow Together",
    icon: LuHandHeart,
    title: "Move Forward Together",
    example: [
      ["Your goals", "You know your business", LuStore],
      ["Our expertise", "We work through the options together", LuHandshake],
      ["Ongoing support", "Review, adapt, and keep in touch", LuMessagesSquare],
    ],
    description:
      "Your business knowledge and our technology support, working toward shared goals.",
  },
] as const;

export function AboutHero() {
  const [selected, setSelected] = useState(1);
  const controls = useRef<HTMLDivElement>(null);
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? beliefs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + beliefs.length) %
            beliefs.length;
    setSelected(next);
    controls.current
      ?.querySelectorAll("button")
      [next]?.focus({ preventScroll: true });
  };
  return (
    <section className={`${styles.hero} ${hero.hero}`}>
      <Container>
        <div className={hero.frame}>
          <header className={`page-introduction ${hero.introduction}`}>
            <Eyebrow>About Motchi</Eyebrow>
            <h1>
              Technology That Gives You <em>Room to Grow.</em>
            </h1>
            <p>
              More time for your work. A plan you can afford. People in your
              corner.
            </p>
          </header>
          <div
            ref={controls}
            role="tablist"
            aria-label="Explore what matters to us"
            className={styles.options}
            data-entry-reveal=""
          >
            {beliefs.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`about-tab-${index}`}
                  type="button"
                  role="tab"
                  tabIndex={selected === index ? 0 : -1}
                  aria-selected={selected === index}
                  aria-controls="about-belief"
                  onClick={() => setSelected(index)}
                  onKeyDown={(event) => navigate(event, index)}
                >
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div
            id="about-belief"
            role="tabpanel"
            aria-labelledby={`about-tab-${selected}`}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: A tab panel with introductory text needs keyboard focus.
            tabIndex={0}
            className={styles.workspace}
          >
            <div className={styles.belief} data-entry-reveal="">
              {beliefs.map((belief, index) => (
                <div
                  key={belief.id}
                  className={styles.arrival}
                  data-active={selected === index}
                  aria-hidden={selected !== index}
                  inert={selected !== index}
                >
                  <ol className={styles.example}>
                    {belief.example.map(([label, detail, Icon], index) => (
                      <li key={label} className={styles.exampleStep}>
                        <span className={styles.exampleIcon} aria-hidden="true">
                          <Icon />
                        </span>
                        <span className={styles.exampleText}>
                          <span className={styles.exampleTitle}>{label}</span>
                          <span className={styles.exampleDetail}>{detail}</span>
                        </span>
                        <span
                          className={styles.exampleNumber}
                          aria-hidden="true"
                        >
                          0{index + 1}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <div className={styles.summary} data-entry-reveal="">
              {beliefs.map((belief, index) => (
                <div
                  key={belief.id}
                  className={`${styles.arrival} ${styles.caption}`}
                  data-active={selected === index}
                  aria-hidden={selected !== index}
                  inert={selected !== index}
                >
                  <h2>{belief.title}</h2>
                  <p>{belief.description}</p>
                  <ButtonLink href="/contact" className="content-action">
                    Tell Us About Your Business
                  </ButtonLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
