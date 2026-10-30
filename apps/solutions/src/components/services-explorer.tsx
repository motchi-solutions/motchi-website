"use client";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";
import { ButtonLink, Container, Eyebrow } from "@motchi/ui/primitives";
import {
  LuGlobe,
  LuWorkflow,
  LuChartNoAxesCombined,
  LuSparkles,
  LuCompass,
} from "react-icons/lu";
import styles from "./services-explorer.module.css";
import hero from "./exploration-hero.module.css";

const goals = [
  {
    label: "Reach more customers",
    shortLabel: "Websites",
    icon: LuGlobe,
    topic: "Websites",
    title: "A Website That Fits",
    description:
      "An affordable, responsive website built around your customers and budget, with maintenance options after launch.",
    detail:
      "We help you choose the pages and features you need, make the site easy to use on phones, and agree on costs before work begins.",
    steps: [
      "Understand your business",
      "Build around your needs",
      "Plan ongoing care",
    ],
    action: "Plan My Website",
    visual: "A clearer online presence",
  },
  {
    label: "AI & Automation",
    shortLabel: "AI",
    icon: LuWorkflow,
    topic: "Automation",
    title: "Make Everyday Work Easier",
    description:
      "Connect your tools and use AI to reduce repetitive work. We check how your data is used and where people need to review the results.",
    detail:
      "Start with tasks that take up your team's time. We test the changes together and explain how to use the tools, so everyone knows what to expect.",
    steps: ["Map the work", "Assess AI and tools", "Introduce with care"],
    action: "Simplify My Workflow",
    visual: "A smoother working day",
  },
  {
    label: "Make sense of your data",
    shortLabel: "Data",
    icon: LuChartNoAxesCombined,
    topic: "Data",
    title: "Useful Data. Clear Controls.",
    description:
      "Bring your data together for reporting and AI, with data security, data governance, and data residency in mind.",
    detail:
      "We help set clear rules for who can access it, how long it is kept, and where it is stored and processed. We check your needs before choosing a provider.",
    steps: ["Map your data", "Agree on controls", "Build useful insights"],
    action: "Get More From My Data",
    visual: "A clearer view of your business",
  },
  {
    label: "Other Tech Needs",
    shortLabel: "Other Needs",
    icon: LuCompass,
    topic: "Something else",
    title: "Find Your Next Step",
    description:
      "Need help with cloud systems, existing tools, or a problem you can't quite name? Tell us what is getting in the way. We'll work through the options with you.",
    detail:
      "We can help connect systems, review a platform, or plan a move to the cloud. You don't need a technical brief, just a starting point.",
    steps: [
      "Understand the challenge",
      "Review your options",
      "Agree on a plan",
    ],
    action: "Find My Next Step",
    visual: "A practical way forward",
  },
] as const;

export function ServicesExplorer() {
  const [selected, setSelected] = useState(0);
  const visual = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const possibility = useRef<HTMLDivElement>(null);
  const scrollFrame = useRef<number | undefined>(undefined);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  useEffect(
    () => () => {
      if (scrollFrame.current !== undefined)
        cancelAnimationFrame(scrollFrame.current);
    },
    [],
  );
  const choose = (index: number) => {
    if (scrollFrame.current !== undefined)
      cancelAnimationFrame(scrollFrame.current);
    setSelected(index);
    scrollFrame.current = requestAnimationFrame(() => {
      const node = possibility.current;
      const illustration = visual.current;
      if (!node || !illustration) return;
      const headerHeight =
        document.querySelector(".site-header")?.getBoundingClientRect()
          .height ?? 96;
      const controlHeight =
        controls.current?.getBoundingClientRect().height ?? 80;
      const bounds = illustration.getBoundingClientRect();
      if (window.matchMedia("(min-width: 1024px)").matches) {
        // The illustration is beside the controls on desktop, not below them.
        if (bounds.bottom > headerHeight && bounds.top < window.innerHeight)
          return;
        illustration.scrollIntoView({
          block: "center",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
        return;
      }
      if (
        bounds.top >= headerHeight + controlHeight &&
        bounds.bottom <= window.innerHeight
      )
        return;
      node.style.scrollMarginTop = `${controlHeight + 16}px`;
      node.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  };
  const arrowNavigation = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? goals.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + goals.length) %
            goals.length;
    choose(next);
    controls.current
      ?.querySelectorAll("button")
      [next]?.focus({ preventScroll: true });
  };
  const startSwipe = (event: PointerEvent<HTMLDivElement>) => {
    gesture.current = null;
    suppressClick.current = false;
    if (
      !event.isPrimary ||
      event.pointerType !== "touch" ||
      !window.matchMedia("(max-width: 767px)").matches ||
      !(event.target instanceof Element) ||
      event.target.closest("a") ||
      !event.target.closest("[data-service-swipe]")
    )
      return;
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };
  const moveSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x,
      dy = event.clientY - start.y;
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5)
      event.currentTarget.setPointerCapture(event.pointerId);
  };
  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x,
      dy = event.clientY - start.y;
    if (Math.abs(dx) < 64 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
    suppressClick.current = true;
    choose((selected + (dx < 0 ? 1 : -1) + goals.length) % goals.length);
  };
  const goal = goals[selected];
  const Icon = goal.icon;
  return (
    <section className={`${styles.hero} ${hero.hero} border-b border-border`}>
      <Container>
        <div
          className={`${styles.explorer} ${hero.frame}`}
          onPointerDownCapture={startSwipe}
          onPointerMoveCapture={moveSwipe}
          onPointerUpCapture={finishSwipe}
          onPointerCancel={() => {
            gesture.current = null;
          }}
          onClickCapture={(event) => {
            if (suppressClick.current) {
              suppressClick.current = false;
              if (event.detail > 0) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }}
        >
          <header className={`page-introduction ${hero.introduction}`}>
            <Eyebrow>Motchi Services</Eyebrow>
            <h1 className="text-h2 font-medium tracking-tight">
              Explore Our Services
            </h1>
            <p className="mt-3 max-w-reading leading-relaxed text-muted">
              Websites, connected tools, and clearer data, with costs agreed up
              front and support as you grow.
            </p>
          </header>

          <p className={styles.prompt} data-entry-reveal="">
            <LuSparkles aria-hidden="true" /> Choose a goal to see a possible
            path.
          </p>
          <div
            role="tablist"
            aria-label="Explore a business goal"
            ref={controls}
            className={styles.options}
            data-entry-reveal=""
            data-service-swipe=""
          >
            {goals.map((item, index) => {
              const OptionIcon = item.icon;
              return (
                <button
                  key={item.topic}
                  type="button"
                  aria-label={item.label}
                  role="tab"
                  id={`service-tab-${index}`}
                  tabIndex={selected === index ? 0 : -1}
                  aria-selected={selected === index}
                  aria-controls="service-possibility"
                  onKeyDown={(event) => arrowNavigation(event, index)}
                  onClick={() => choose(index)}
                >
                  <OptionIcon aria-hidden="true" />
                  <span className={styles.fullLabel}>
                    {item.topic === "Automation" ? item.label : item.shortLabel}
                  </span>
                  <span className={styles.shortLabel}>{item.shortLabel}</span>
                </button>
              );
            })}
          </div>
          <p className={styles.navigationHint}>
            Swipe left or right to explore another service.
          </p>
          <div
            ref={possibility}
            data-service-swipe=""
            className={styles.possibility}
          >
            <div
              ref={visual}
              className={styles.visual}
              aria-hidden="true"
              data-entry-reveal=""
            >
              <div
                key={goal.topic}
                className={styles.scene}
                data-goal={goal.topic}
              >
                <div className={styles.sculpture}>
                  <div className={styles.halo} />
                  <span className={styles.petal} />
                  <span className={styles.petal} />
                  <span className={styles.petal} />
                  <svg
                    className={styles.thread}
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 360 280"
                    fill="none"
                  >
                    <path d="M30 200 C10 90 160 15 260 75 S360 230 245 245 S105 140 180 140" />
                  </svg>
                  <div className={styles.emblem}>
                    <span className={styles.frameDots}>
                      <i />
                      <i />
                      <i />
                    </span>
                    {goal.topic === "Websites" ? (
                      <svg
                        className={styles.globe}
                        viewBox="0 0 48 48"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <circle cx="24" cy="24" r="17" />
                        <path d="M7 24h34M9 16h30M9 32h30" />
                        <ellipse
                          className={styles.meridian}
                          cx="24"
                          cy="24"
                          rx="8"
                          ry="17"
                        />
                      </svg>
                    ) : goal.topic === "Automation" ? (
                      <svg
                        className={styles.workflow}
                        viewBox="0 0 48 48"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          className={styles.workflowTrack}
                          d="M14 21v6a7 7 0 0 0 7 7h7"
                        />
                        <rect
                          className={styles.workflowFirst}
                          x="6"
                          y="5"
                          width="16"
                          height="16"
                          rx="3"
                        />
                        <rect
                          className={styles.workflowLast}
                          x="28"
                          y="26"
                          width="16"
                          height="16"
                          rx="3"
                        />
                        <circle
                          className={styles.workflowProgress}
                          cx="14"
                          cy="21"
                          r="2.5"
                        />
                      </svg>
                    ) : goal.topic === "Something else" ? (
                      <svg
                        className={styles.compass}
                        viewBox="0 0 48 48"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <circle cx="24" cy="24" r="17" />
                        <g strokeWidth="1" strokeLinecap="round">
                          {[
                            0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300,
                            330,
                          ].map((angle) => (
                            <path
                              key={angle}
                              d={angle % 90 === 0 ? "M24 8v3" : "M24 8v1.5"}
                              transform={`rotate(${angle} 24 24)`}
                            />
                          ))}
                        </g>
                        <g className={styles.compassNeedle}>
                          <path
                            d="M24 11 28 24 24 37 20 24Z"
                            transform="rotate(45 24 24)"
                            strokeWidth="1.6"
                          />
                        </g>
                      </svg>
                    ) : (
                      <Icon />
                    )}
                  </div>
                </div>
                <p className={styles.visualTitle}>{goal.visual}</p>
                <div className={styles.path}>
                  {goal.steps.map((step, index) => (
                    <div key={step}>
                      <span>{index + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className={styles.copy}
              data-entry-reveal=""
              id="service-possibility"
              role="tabpanel"
              aria-labelledby={`service-tab-${selected}`}
              // biome-ignore lint/a11y/noNoninteractiveTabindex: A tab panel with introductory text needs keyboard focus.
              tabIndex={0}
            >
              <div
                key={goal.topic}
                className={styles.copyReveal}
                data-active="true"
              >
                <h2 className="text-h3 font-semibold tracking-tight">
                  {goal.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  {goal.description}
                  <span className="hidden lg:inline"> {goal.detail}</span>
                </p>
              </div>
            </div>
            <div className={styles.serviceActions} data-entry-reveal="">
              <ButtonLink
                href={`/contact?topic=${encodeURIComponent(goal.topic)}`}
              >
                {goal.action}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
