"use client";

import { useId, useState, type CSSProperties } from "react";
import { AnimatedLink } from "@motchi/ui/primitives";
import { capabilityContent } from "@motchi/ui/capability-content";
import styles from "./hero.module.css";

// Only the artwork and its concise capability response need client state.
export function CapabilityThread({
  websitesUrl,
  consultingUrl,
}: {
  websitesUrl: string;
  consultingUrl: string;
}) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  return (
    <div
      className={styles.thread}
      style={{ "--selection": selected } as CSSProperties}
    >
      <div className={styles.art} aria-hidden="true">
        <svg
          viewBox="0 0 1440 1000"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            className={styles.ribbonShadow}
            transform="translate(22 16)"
            d="M1160 -160V100C1160 285 870 210 870 385S1240 505 1240 640S1000 780 760 780H-180"
          />
          <path
            className={styles.ribbon}
            d="M1160 -160V100C1160 285 870 210 870 385S1240 505 1240 640S1000 780 760 780H-180"
          />
          {/* Follow both curves; the final segment may pass behind the selector. */}
          <path
            className={styles.trace}
            pathLength="100"
            d="M1160 100C1160 285 870 210 870 385S1240 505 1240 640S1000 780 760 780"
          />
        </svg>
      </div>
      <div className={`${styles.explorer} ms-surface-feature`}>
        <div className={styles.controlSurface}>
          <fieldset
            className={styles.choices}
            aria-describedby={`${id}-introduction`}
          >
            <legend className={styles.prompt}>Our Expertise</legend>
            <p id={`${id}-introduction`} className={styles.selectionIntro}>
              Choose an area to see how we help businesses build, connect, and
              improve their technology.
            </p>
            {capabilityContent.map((item, index) => (
              <button
                key={item.name}
                type="button"
                aria-pressed={index === selected}
                aria-controls={`${id}-response`}
                onClick={() => setSelected(index)}
              >
                {item.name}
                <svg
                  className={styles.choiceIcon}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M3 8h10" />
                  <g className={styles.choiceVertical}>
                    <path d="M3 8h10" />
                  </g>
                </svg>
              </button>
            ))}
          </fieldset>
        </div>
        <div
          id={`${id}-response`}
          className={styles.response}
          aria-live="polite"
          aria-atomic="true"
        >
          {capabilityContent.map((item, index) => (
            <div
              key={item.name}
              className={styles.responseItem}
              data-active={index === selected}
              aria-hidden={index !== selected}
              inert={index !== selected}
            >
              <h2>{item.heading}</h2>
              <p>{item.detail}</p>
              <div className={styles.capabilityActions}>
                <AnimatedLink
                  href={`/contact?topic=${encodeURIComponent(item.interest)}`}
                  arrow
                  className={styles.capabilityAction}
                >
                  {item.action}
                </AnimatedLink>
                <AnimatedLink
                  href={item.name === "Websites" ? websitesUrl : consultingUrl}
                  external
                  target="_blank"
                  className={styles.capabilityMore}
                >
                  Explore Motchi{" "}
                  {item.name === "Websites" ? "Websites" : "Consulting"}
                  <span className="sr-only"> (opens in a new tab)</span>
                </AnimatedLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
