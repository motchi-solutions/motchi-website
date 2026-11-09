"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { LuArrowRight } from "react-icons/lu";
import { engagement } from "../../content/consulting/process.ts";
import { Container } from "../ui/primitives.tsx";
import { useTabs } from "../ui/use-tabs.ts";

const stages = [
  { title: "Problem", steps: engagement.slice(0, 1) },
  { title: "Decision", steps: engagement.slice(1, 3) },
  { title: "Implementation", steps: engagement.slice(3, 4) },
  { title: "Adoption", steps: engagement.slice(4, 5) },
  { title: "Support", steps: engagement.slice(5) },
];

const number = (index: number) => String(index + 1).padStart(2, "0");
// A mouse drag this far (px) moves to the neighbouring stage.
const SWIPE = 48;
const slidesOf = (track: HTMLElement | null) =>
  Array.from(track?.querySelectorAll<HTMLElement>("[role=tabpanel]") ?? []);
// Scroll position that rests a slide at the track's snap edge.
const leftOf = (track: HTMLElement, slide: HTMLElement) =>
  Math.min(
    slide.offsetLeft -
      (Number.parseFloat(getComputedStyle(track).scrollPaddingInlineStart) ||
        0),
    track.scrollWidth - track.clientWidth,
  );

/* An engagement track: the rail shows progress, and the stages sit in a
   carousel that can be swiped by touch or dragged with a mouse. The rail,
   arrow keys, and Next buttons move the same carousel. Without JavaScript
   every stage is listed in full. */
export function Approach() {
  const { selected, setSelected, tabId, panelId, tabProps } = useTabs(
    stages.length,
  );
  const [enhanced, setEnhanced] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  // Stage the carousel is moving to; stages it passes on the way are ignored.
  const target = useRef<number | null>(null);
  const drag = useRef<{
    x: number;
    left: number;
    from: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => setEnhanced(true), []);

  const slides = () => slidesOf(track.current);

  function goTo(index: number) {
    const element = track.current;
    const slide = slides()[index];
    if (!element || !slide) return;
    target.current = index;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollTo({
      left: leftOf(element, slide),
      behavior: reduced ? "instant" : "smooth",
    });
  }

  // The rail, keyboard, and Next buttons select a stage; the carousel follows
  // unless it is already resting on that stage after a swipe.
  // biome-ignore lint/correctness/useExhaustiveDependencies: goTo reads refs only.
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const offsets = slidesOf(element).map((slide) =>
      Math.abs(leftOf(element, slide) - element.scrollLeft),
    );
    const showing = offsets.indexOf(Math.min(...offsets));
    if (target.current === null && showing === selected) return;
    goTo(selected);
  }, [selected]);

  // The carousel takes the height of the current stage, so a short stage does
  // not leave a tall empty panel.
  useEffect(() => {
    const element = track.current;
    const slide = slidesOf(element)[selected];
    if (!element || !slide) return;
    const fit = () => {
      element.style.height = `${slide.offsetHeight}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(slide);
    return () => observer.disconnect();
  }, [selected]);

  // Swiping selects the stage that comes to rest in view.
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const panels = slidesOf(element);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < 0.6) continue;
          const index = panels.indexOf(entry.target as HTMLElement);
          if (target.current !== null && target.current !== index) continue;
          target.current = null;
          setSelected(index);
        }
      },
      { root: element, threshold: 0.6 },
    );
    for (const panel of panels) observer.observe(panel);
    return () => observer.disconnect();
  }, [setSelected]);

  // Focus moves with Next so it is not left on a stage that is now hidden.
  function next(index: number) {
    setSelected(index);
    requestAnimationFrame(() =>
      slides()[index]?.focus({ preventScroll: true }),
    );
  }

  // Touch scrolls natively; a mouse drags the carousel by hand.
  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = {
      x: event.clientX,
      left: event.currentTarget.scrollLeft,
      from: selected,
      moved: false,
    };
  }
  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state) return;
    const distance = event.clientX - state.x;
    if (!state.moved && Math.abs(distance) < 6) return;
    if (!state.moved) {
      state.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "";
    }
    event.currentTarget.scrollLeft = state.left - distance;
  }
  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved) return;
    const element = event.currentTarget;
    const distance = event.clientX - state.x;
    const step = distance <= -SWIPE ? 1 : distance >= SWIPE ? -1 : 0;
    const index = Math.min(Math.max(state.from + step, 0), stages.length - 1);
    const slide = slides()[index];
    setSelected(index);
    goTo(index);
    // Snapping returns once the carousel has settled on the stage; turning it
    // back on sooner would pull the carousel to the nearest stage instead.
    const started = performance.now();
    const settle = () => {
      const done =
        !slide || Math.abs(element.scrollLeft - leftOf(element, slide)) < 2;
      if (done || performance.now() - started > 1000) {
        delete element.dataset.dragging;
      } else requestAnimationFrame(settle);
    };
    requestAnimationFrame(settle);
    // A drag is not a click on whatever it started over. The click, if any,
    // follows this pointerup in the same task.
    const swallow = (click: MouseEvent) => {
      click.preventDefault();
      click.stopPropagation();
    };
    element.addEventListener("click", swallow, { capture: true, once: true });
    setTimeout(() =>
      element.removeEventListener("click", swallow, { capture: true }),
    );
  }

  const nextButton = (index: number, className: string) =>
    index < stages.length - 1 && (
      <button
        type="button"
        data-next=""
        onClick={() => next(index + 1)}
        className={`group/next min-h-11 cursor-pointer items-center gap-2 justify-self-start font-semibold text-(--active) transition-colors duration-(--motion-hover) ease-(--ease-hover) hover:text-secondary motion-reduce:transition-none ${className}`}
      >
        Next: {stages[index + 1].title}
        <LuArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-(--motion-hover) ease-(--ease-hover) group-hover/next:translate-x-0.5 group-focus-visible/next:translate-x-0.5 motion-reduce:transition-none"
        />
      </button>
    );

  return (
    <section
      id="approach"
      className="border-y border-border bg-surface py-section"
    >
      <Container>
        <div className="max-w-176">
          <h2 className="text-h2 font-medium tracking-tight">
            How We Work Together
          </h2>
          <p className="mt-4 max-w-152 text-body-lg leading-relaxed text-muted">
            We stay with your team from the first question through
            implementation and support. Scope and responsibilities are agreed
            for every engagement.
          </p>
        </div>

        <div id="consulting-process" className="mt-(--space-section-heading)">
          <noscript>
            <style>
              {
                "#approach [role=tablist],#approach [data-next]{display:none}#approach [data-track]{display:grid;gap:1.5rem;overflow:visible;margin-inline:0;padding-inline:0}#approach [data-track]>*{width:auto}"
              }
            </style>
          </noscript>
          {/* Phones show numbered steps; the stage title leads its slide. */}
          <div
            role="tablist"
            aria-label="Engagement stages"
            className="grid grid-cols-5 gap-2"
          >
            {stages.map((stage, index) => {
              const state =
                selected === index
                  ? "current"
                  : index < selected
                    ? "done"
                    : "upcoming";
              return (
                <button
                  key={stage.title}
                  {...tabProps(index)}
                  data-state={state}
                  className="group relative grid min-h-12 min-w-0 cursor-pointer content-start justify-items-start gap-2 pt-4 pb-2 text-start text-muted transition-colors duration-(--motion-hover) ease-(--ease-hover) before:absolute before:inset-x-0 before:top-0 before:h-1 before:rounded-full before:bg-border before:transition-colors before:duration-(--motion-hover) before:ease-(--ease-hover) hover:text-(--active) hover:before:bg-[color-mix(in_srgb,var(--active)_35%,var(--border))] data-[state=current]:text-foreground data-[state=current]:before:bg-(--active) data-[state=done]:before:bg-(--active-detail) motion-reduce:transition-none motion-reduce:before:transition-none"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-8 place-items-center rounded-full border border-border bg-background text-small font-semibold text-muted tabular-nums transition-colors duration-(--motion-hover) ease-(--ease-hover) group-data-[state=current]:border-(--active) group-data-[state=current]:bg-(--active) group-data-[state=current]:text-(--active-foreground) group-data-[state=done]:border-(--active-detail) group-data-[state=done]:bg-(--active-detail) group-data-[state=done]:text-foreground motion-reduce:transition-none"
                  >
                    {number(index)}
                  </span>
                  <span className="sr-only text-base font-medium md:not-sr-only lg:text-lg">
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            ref={track}
            data-track=""
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              drag.current = null;
            }}
            className="relative -mx-5 mt-6 flex scroll-px-5 snap-x snap-mandatory items-start gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-5 transition-[height] duration-(--motion-hover) ease-(--ease-hover) motion-reduce:transition-none sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:gap-4 lg:px-0 scrollbar-none data-dragging:cursor-grabbing data-dragging:snap-none data-dragging:select-none pointer-fine:cursor-grab"
          >
            {stages.map((stage, index) => (
              <section
                key={stage.title}
                id={panelId(index)}
                role="tabpanel"
                aria-labelledby={tabId(index)}
                inert={enhanced && selected !== index}
                // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA tab panels take focus so keyboard users can reach their content.
                tabIndex={0}
                className="grid w-[86%] shrink-0 snap-start content-start focus-visible:outline-offset-[-3px] sm:w-[88%] lg:w-full gap-x-16 gap-y-8 rounded-(--radius-panel) bg-background p-[clamp(1.5rem,3vw,2.75rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
              >
                <div className="min-w-0">
                  <p className="text-small font-semibold text-(--active)">
                    Stage {index + 1} of {stages.length}
                  </p>
                  <h3 className="mt-3 text-3xl leading-tight font-medium tracking-[-0.02em]">
                    {stage.title}
                  </h3>
                  <p className="mt-4 max-w-120 text-body-lg leading-relaxed text-muted">
                    {stage.steps.map((step) => step.summary).join(" ")}
                  </p>
                  {nextButton(index, "mt-6 hidden lg:inline-flex")}
                </div>
                <div className="grid min-w-0 content-start gap-7">
                  {stage.steps.map((step) => (
                    <div key={step.id}>
                      <h4 className="text-lg font-semibold">
                        {step.detailHeading}
                      </h4>
                      <ul className="mt-3 grid gap-2.5">
                        {step.details.map((detail) => (
                          <li
                            key={detail}
                            className="relative ps-5 leading-relaxed text-muted before:absolute before:inset-s-0 before:top-[0.6em] before:size-1.5 before:rounded-full before:bg-(--active-detail)"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {nextButton(index, "inline-flex lg:hidden")}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
