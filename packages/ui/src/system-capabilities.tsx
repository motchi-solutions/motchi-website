"use client";

import { capabilityContent } from "./capability-content";
import { ButtonLink } from "./primitives";
import Image from "next/image";
import { logos } from "@motchi/brand";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import {
  LuWorkflow,
  LuLightbulb,
  LuArrowLeft,
  LuDatabase,
  LuCloud,
  LuBrainCircuit,
  LuPanelsTopLeft,
} from "react-icons/lu";

const icons = [
  LuPanelsTopLeft,
  LuBrainCircuit,
  LuDatabase,
  LuCloud,
  LuWorkflow,
];
const capabilities = capabilityContent.map((item, index) => ({
  ...item,
  icon: icons[index],
}));

export function SystemCapabilities() {
  const id = useId();
  const toolkit = useRef<HTMLDivElement>(null);
  const [entering, setEntering] = useState<{
    index: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
  } | null>(null);
  const [returning, setReturning] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => {
    setEnhanced(true);
  }, []);
  useEffect(() => {
    if (!entering) return;
    const finish = () => {
      setSelected(entering.index);
      setEntering(null);
    };
    // Finish even if an animation is interrupted by a resize or preference change.
    const timeout = window.setTimeout(finish, 950);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", finish);
    window.addEventListener("resize", finish);
    return () => {
      window.clearTimeout(timeout);
      preference.removeEventListener("change", finish);
      window.removeEventListener("resize", finish);
    };
  }, [entering]);
  useEffect(() => {
    if (!returning) return;
    const previous = selected;
    const finish = () => {
      setSelected(null);
      setReturning(false);
      requestAnimationFrame(() =>
        document
          .getElementById(`${id}-${previous}`)
          ?.focus({ preventScroll: true }),
      );
    };
    const timer = window.setTimeout(finish, 180);
    return () => window.clearTimeout(timer);
  }, [returning, selected, id]);
  const detail = enhanced ? (
    <section
      hidden={selected === null}
      id={`${id}-detail`}
      aria-labelledby={selected === null ? undefined : `${id}-${selected}`}
      aria-label={selected === null ? "Explore the toolkit" : undefined}
      className="system-capability-detail"
    >
      {selected !== null && (
        <div key={selected} className="capability-detail-reveal">
          <h2 className="text-h3 font-medium">
            {capabilities[selected].heading}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            {capabilities[selected].detail}
          </p>
          <ul className="capability-scope mt-4 grid gap-2 text-small leading-relaxed text-muted">
            {capabilities[selected].scope.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-primary">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <ButtonLink
            href={`/contact?topic=${encodeURIComponent(capabilities[selected].name)}`}
            className="mt-5"
          >
            {capabilities[selected].action}
          </ButtonLink>
        </div>
      )}
    </section>
  ) : null;
  return (
    <div
      className="system-capabilities"
      data-enhanced={enhanced}
      data-exploring={selected !== null}
      data-entering={entering !== null}
      data-returning={returning}
      aria-busy={entering !== null}
    >
      {enhanced && selected !== null && (
        <button
          type="button"
          className="capability-back"
          onClick={() => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              const previous = selected;
              setSelected(null);
              requestAnimationFrame(() =>
                document
                  .getElementById(`${id}-${previous}`)
                  ?.focus({ preventScroll: true }),
              );
            } else {
              setReturning(true);
            }
          }}
        >
          <LuArrowLeft
            aria-hidden="true"
            className="interaction-arrow"
            data-direction="left"
          />{" "}
          Back to overview
        </button>
      )}
      {enhanced && (
        <p
          className="capability-instruction"
          data-dismissed={selected !== null || entering !== null}
          aria-hidden={selected !== null || entering !== null}
        >
          <LuLightbulb aria-hidden="true" />
          <span>Select an area to see how we can help.</span>
        </p>
      )}
      <div
        ref={toolkit}
        className="system-toolkit"
        style={
          entering
            ? ({
                transformOrigin: `${entering.x}px ${entering.y}px`,
                "--zoom-x": `${entering.dx}px`,
                "--zoom-y": `${entering.dy}px`,
              } as CSSProperties)
            : undefined
        }
        onAnimationEnd={(event) => {
          if (
            event.target !== event.currentTarget ||
            event.animationName !== "capability-enter-area" ||
            !entering
          )
            return;
          setSelected(entering.index);
          setEntering(null);
        }}
      >
        <svg
          className="toolkit-paths"
          viewBox="0 0 500 420"
          fill="none"
          aria-hidden="true"
        >
          {[
            "M250 210Q100 80 80 120",
            "M250 210Q350 150 340 45",
            "M250 210Q330 290 425 175",
            "M250 210Q160 320 115 320",
            "M250 210Q310 340 360 335",
          ].map((path, index) => (
            <path
              key={path}
              d={path}
              pathLength="1"
              data-active={selected === index}
            />
          ))}
          <path
            className="toolkit-orbit"
            d="M45 230Q20 35 265 20M455 255Q430 410 230 395"
          />
          <circle cx="265" cy="20" r="3" />
          <circle cx="230" cy="395" r="4" />
        </svg>
        <div className="toolkit-anchor">
          {logos.solutions && (
            <Image
              src={logos.solutions.src}
              width={logos.solutions.width}
              height={logos.solutions.height}
              alt=""
              className="h-16 w-16"
            />
          )}
          <span className="font-semibold tracking-wide">MOTCHI</span>
          <span className="text-xs text-muted">How We Can Help</span>
        </div>
        <ul className="system-nodes" aria-label="Technology options">
          {capabilities.map(({ name, detail, icon: Icon }, index) => (
            <li
              key={name}
              className="system-node"
              data-selected={(entering?.index ?? selected) === index}
            >
              {enhanced ? (
                <button
                  type="button"
                  id={`${id}-${index}`}
                  aria-pressed={selected === index}
                  aria-controls={`${id}-detail`}
                  onClick={(event) => {
                    if (entering || returning) return;
                    const canZoom =
                      selected === null &&
                      !window.matchMedia("(prefers-reduced-motion: reduce)")
                        .matches;
                    const scene = toolkit.current;
                    const option = event.currentTarget.parentElement;
                    if (canZoom && scene && option) {
                      // Use layout coordinates: hover transforms must not shift the zoom target.
                      const x = option.offsetLeft + option.offsetWidth / 2;
                      const y = option.offsetTop + option.offsetHeight / 2;
                      setEntering({
                        index,
                        x,
                        y,
                        dx: scene.clientWidth / 2 - x,
                        dy: scene.clientHeight / 2 - y,
                      });
                    } else {
                      setSelected(index);
                    }
                  }}
                  className="system-node-control"
                >
                  <Icon aria-hidden="true" />
                  <span>{name}</span>
                </button>
              ) : (
                <div className="system-node-control">
                  <Icon aria-hidden="true" />
                  <span>{name}</span>
                </div>
              )}
              {!enhanced && <p className="system-fallback-detail">{detail}</p>}
            </li>
          ))}
        </ul>
      </div>
      {detail}
    </div>
  );
}
