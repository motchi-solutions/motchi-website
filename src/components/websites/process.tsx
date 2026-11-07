"use client";

import { useEffect, useId, useState } from "react";
import { LuCheck } from "react-icons/lu";
import { Container, SectionHeading } from "../ui/primitives.tsx";
import { processSteps } from "../../content/websites/process.ts";
import { WebsiteResponsibilities } from "./responsibilities.tsx";
import styles from "./process.module.css";

const stages = [
  {
    title: "Understand",
    summary: processSteps[0].summary,
    content: processSteps.slice(0, 1),
  },
  {
    title: "Plan",
    summary: processSteps[1].summary,
    content: processSteps.slice(1, 2),
  },
  {
    title: "Design & Build",
    summary: "Design, build, and review a website that reflects your business.",
    content: processSteps.slice(2, 4),
  },
  {
    title: "Review & Launch",
    summary: processSteps[4].summary,
    content: processSteps.slice(4, 5),
  },
  {
    title: "Support",
    summary: processSteps[5].summary,
    content: processSteps.slice(5),
  },
];

export function Process() {
  const [enhanced, setEnhanced] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [selected, setSelected] = useState<number | null>(0);
  const [direction, setDirection] = useState("forward");
  const id = useId();
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setDesktop(media.matches);
      if (media.matches) setSelected((current) => current ?? 0);
    };
    update();
    setEnhanced(true);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  function detail(stage: (typeof stages)[number], index: number) {
    const open = !enhanced || selected === index;
    return (
      <section
        id={`${id}-${index}-panel`}
        className={styles.panel}
        data-open={open}
        aria-hidden={!open}
        inert={!open}
        aria-labelledby={`${id}-${index}-title`}
      >
        <div className={styles.clip}>
          <div className={styles.detail}>
            <div className={styles.detailHeading}>
              <span className={styles.position} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className={styles.detailKicker}>Step {index + 1} of 5</p>
                <h3>{stage.title}</h3>
              </div>
            </div>
            <div className={styles.detailGroups}>
              {stage.content.map((part) => (
                <div className={styles.detailGroup} key={part.id}>
                  <h4>{part.detailHeading}</h4>
                  <ul>
                    {part.details.map((item) => (
                      <li key={item}>
                        <LuCheck
                          aria-hidden="true"
                          className={styles.detailCheck}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {index === 0 && <WebsiteResponsibilities />}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="process" className={styles.process}>
      <Container>
        <SectionHeading wide title="How We Build Your Website">
          From the first conversation to launch and ongoing support, we work
          through each stage together.
        </SectionHeading>
        <div
          className={styles.journey}
          data-enhanced={enhanced}
          data-desktop={desktop}
          data-direction={direction}
        >
          <ol className={styles.stages}>
            {stages.map((stage, index) => {
              const active = selected === index;
              return (
                <li
                  className={styles.stage}
                  key={stage.title}
                  data-selected={active}
                  data-progress={selected !== null && index < selected}
                >
                  {enhanced ? (
                    <h3 className={styles.stageHeading}>
                      <button
                        type="button"
                        className={styles.stageButton}
                        aria-expanded={active}
                        aria-controls={`${id}-${index}-panel`}
                        aria-labelledby={`${id}-${index}-title`}
                        aria-describedby={`${id}-${index}-summary`}
                        onClick={() => {
                          setDirection(
                            index < (selected ?? 0) ? "back" : "forward",
                          );
                          setSelected((current) =>
                            !desktop && current === index ? null : index,
                          );
                        }}
                      >
                        <span className={styles.number} aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.stageCopy}>
                          <span
                            id={`${id}-${index}-title`}
                            className={styles.stageTitle}
                          >
                            {stage.title}
                          </span>
                          <span
                            id={`${id}-${index}-summary`}
                            className={styles.summary}
                          >
                            {stage.summary}
                          </span>
                        </span>
                        <svg
                          className={styles.chevron}
                          viewBox="0 0 20 20"
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <path d="m7 5 5 5-5 5" />
                        </svg>
                      </button>
                    </h3>
                  ) : (
                    <div className={styles.fallbackHeading}>
                      <span className={styles.number} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 id={`${id}-${index}-title`}>{stage.title}</h3>
                        <p className={styles.summary}>{stage.summary}</p>
                      </div>
                    </div>
                  )}
                  {!desktop && detail(stage, index)}
                </li>
              );
            })}
          </ol>
          {desktop && (
            <div className={styles.panels}>
              {stages.map((stage, index) => (
                <div
                  className={styles.panelSlot}
                  data-active={selected === index}
                  key={stage.title}
                >
                  {detail(stage, index)}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
