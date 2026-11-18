"use client";

import { type CSSProperties, useLayoutEffect, useRef } from "react";

/* Strokes draw in with the dash-offset technique on pathLength="1", animated
   with the Web Animations API (MDN: Element.animate) so the sequence can be
   paused until the intro finishes and skipped under prefers-reduced-motion
   (WCAG 2.3.3 Animation from Interactions).

   Hero artwork: three tangled problems run through the Motchi Consulting mark
   and leave as clean, parallel lines. One drawing is authored left-to-right;
   phones get the same drawing turned top-to-bottom, so labels stay legible. */

const problems = [
  "A slow, manual process",
  "An unclear platform decision",
  "Data you can't depend on",
];

const outcomes = [
  "Clear decisions",
  "Connected systems",
  "A team that's ready",
];

// Authored in a 480 x 340 field; the hub sits at the centre and each strand
// ends level with its label (1/6, 1/2 and 5/6 of the height).
const tangled = [
  "M0 57 C50 57 64 160 104 133 S140 40 172 90 S204 186 240 170",
  "M0 170 C36 170 56 255 94 218 S120 100 158 149 S210 234 240 170",
  "M0 283 C48 283 76 186 114 228 S154 324 186 242 S214 149 240 170",
];

const clean = [
  "M240 170 C300 170 316 57 376 57 L474 57",
  "M240 170 L474 170",
  "M240 170 C300 170 316 283 376 283 L474 283",
];

const ends = [57, 170, 283];

// Phones: x runs down the page; the long axis is shortened to keep the hero compact.
const SHORTEN = 0.6;

const upright = (path: string) =>
  path.replace(
    /(\d+) (\d+)/g,
    (_, x: string, y: string) => `${y} ${Math.round(Number(x) * SHORTEN)}`,
  );

function Drawing({ vertical }: { vertical: boolean }) {
  const draw = vertical ? upright : (path: string) => path;
  const hub = vertical ? { x: 170, y: 240 * SHORTEN } : { x: 240, y: 170 };

  return (
    <svg
      viewBox={vertical ? `0 0 340 ${480 * SHORTEN}` : "0 0 480 340"}
      className={`block h-auto w-full overflow-visible ${vertical ? "sm:hidden" : "hidden sm:block"}`}
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="var(--gold)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      >
        {tangled.map((path) => (
          <path key={path} d={draw(path)} pathLength={1} data-strand="in" />
        ))}
      </g>
      <g
        fill="none"
        stroke="var(--cream)"
        strokeWidth="2.75"
        strokeLinecap="round"
      >
        {clean.map((path) => (
          <path key={path} d={draw(path)} pathLength={1} data-strand="out" />
        ))}
      </g>
      {ends.map((end) => (
        <circle
          key={end}
          cx={vertical ? end : 474}
          cy={vertical ? Math.round(474 * SHORTEN) : end}
          r="6"
          fill="var(--gold)"
          data-strand-end=""
        />
      ))}
      <g data-hub="" className="transform-fill origin-center">
        <circle cx={hub.x} cy={hub.y} r="46" fill="var(--cream)" />
        <circle
          cx={hub.x}
          cy={hub.y}
          r="54"
          fill="none"
          stroke="var(--gold)"
          strokeOpacity="0.5"
        />
        <image
          href="/brand/mc-logo.svg"
          x={hub.x - 30}
          y={hub.y - 30}
          width="60"
          height="60"
        />
      </g>
    </svg>
  );
}

export function UntangleDiagram() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const figure = ref.current;
    if (!figure) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const query = <T extends Element>(selector: string) =>
      Array.from(figure.querySelectorAll<T>(selector));
    const strandsIn = query<SVGPathElement>('[data-strand="in"]');
    const strandsOut = query<SVGPathElement>('[data-strand="out"]');
    const hubs = query<SVGGElement>("[data-hub]");
    const dots = query<SVGCircleElement>("[data-strand-end]");
    const causes = query<HTMLElement>("[data-problem]");
    const results = query<HTMLElement>("[data-outcome]");
    const animations: Animation[] = [];
    const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
    // Round caps would show a dot before a strand starts drawing, so each
    // strand stays hidden until its first frame.
    const drawn = [
      { strokeDasharray: "1 1", strokeDashoffset: 1, opacity: 0 },
      { opacity: 1, offset: 0.02 },
      { strokeDasharray: "1 1", strokeDashoffset: 0, opacity: 1 },
    ];
    const add = (
      element: Element,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const animation = element.animate(keyframes, {
        fill: "backwards",
        easing: ease,
        ...options,
      });
      animation.pause();
      animations.push(animation);
    };
    // Both drawings share one timeline; strands in each step 3 at a time.
    const stagger = (
      elements: Element[],
      keyframes: Keyframe[],
      duration: number,
      delay: number,
      step = 0,
    ) => {
      elements.forEach((element, index) => {
        add(element, keyframes, {
          duration,
          delay: delay + (index % 3) * step,
        });
      });
    };
    const rise = [
      { opacity: 0, transform: "translateY(4px)" },
      { opacity: 1, transform: "none" },
    ];
    // One orchestrated sequence: each problem appears and its strand follows
    // straight after, the mark settles, and the clean lines carry through to
    // each outcome.
    stagger(causes, rise, 380, 0, 120);
    stagger(strandsIn, drawn, 1150, 180, 120);
    stagger(
      hubs,
      [
        { opacity: 0, transform: "scale(0.85)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      420,
      1150,
    );
    stagger(strandsOut, drawn, 800, 1500, 90);
    stagger(dots, [{ opacity: 0 }, { opacity: 1 }], 260, 2200, 90);
    stagger(results, rise, 360, 2200, 90);

    let played = false;
    let inView = false;
    const intro = document.querySelector<HTMLElement>(".intro-experience");
    let revealed = !intro || intro.dataset.introReleasing === "true";
    const play = () => {
      if (played || !revealed || !inView) return;
      played = true;
      for (const animation of animations) animation.play();
    };
    const finish = () => {
      for (const animation of animations) animation.finish();
    };
    const reveal = () => {
      revealed = true;
      play();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        play();
      },
      { threshold: 0.2 },
    );
    const motionChange = () => {
      if (preference.matches) finish();
    };
    observer.observe(figure);
    document.addEventListener("motchi:page-reveal", reveal);
    preference.addEventListener("change", motionChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("motchi:page-reveal", reveal);
      preference.removeEventListener("change", motionChange);
      for (const animation of animations) animation.cancel();
    };
  }, []);

  // Phones: labels sit in rows above and below the upright drawing. Wider
  // screens: each label rests just above the end of its own line.
  // The lowest problem strand climbs straight away, so its label sits below.
  const place = (end: number, below = false) =>
    ({
      "--y": `${(end / 340) * 100}%`,
      "--shift": below ? "0.5rem" : "calc(-100% - 0.5rem)",
    }) as CSSProperties;
  const label =
    "text-balance sm:absolute sm:top-(--y) sm:max-w-[27%] sm:translate-y-(--shift)";
  return (
    <figure
      ref={ref}
      className="min-w-0 max-w-184 rounded-[0.25rem_0.25rem_4rem_0.25rem] bg-[color-mix(in_srgb,var(--charcoal)_24%,var(--brand-primary))] px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.5rem,3.5vw,3rem)] xl:max-w-none"
    >
      <figcaption className="sr-only">
        Three common problems pass through Motchi Consulting and come out as
        clear decisions, connected systems, and a team that's ready.
      </figcaption>
      <div className="grid gap-4 sm:relative sm:block">
        <ul className="grid grid-cols-3 gap-3 text-center text-small leading-snug text-inverse/80 sm:block sm:text-start sm:text-sm lg:text-[0.9375rem]">
          {problems.map((problem, index) => (
            <li
              key={problem}
              data-problem=""
              style={place(ends[index], index === problems.length - 1)}
              className={`${label} sm:left-0`}
            >
              {problem}
            </li>
          ))}
        </ul>
        <Drawing vertical={false} />
        <Drawing vertical />
        <ul className="grid grid-cols-3 gap-3 text-center text-small leading-snug font-semibold text-inverse sm:block sm:text-end sm:text-sm lg:text-[0.9375rem]">
          {outcomes.map((outcome, index) => (
            <li
              key={outcome}
              data-outcome=""
              style={place(ends[index])}
              className={`${label} sm:right-0`}
            >
              {outcome}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
