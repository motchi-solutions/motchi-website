"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./hero.module.css";

export function DrawnMonogram() {
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    const sketch = node?.querySelector<SVGGElement>("[data-sketch]");
    const finishedMark = node?.querySelector<SVGImageElement>("image");
    const artwork = node?.closest<HTMLElement>("[data-monogram-artwork]");
    if (!node || !sketch || !finishedMark || !artwork) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;

    const strokes = Array.from(sketch.querySelectorAll("path"));
    const animations: Animation[] = [];
    let played = false;
    let cancelled = false;
    let frame = 0;
    let typingTimer: number | undefined;
    let captionTimer: number | undefined;
    let cursor: HTMLElement | undefined;
    let inView = false;
    const intro = document.querySelector<HTMLElement>(".intro-experience");
    let revealed = !intro || intro.dataset.introReleasing === "true";
    node.dataset.drawState = "waiting";
    artwork.dataset.captionState = "waiting";

    const typeCaption = (stage: "sketch" | "finish") => {
      window.clearTimeout(typingTimer);
      const letters = artwork.querySelectorAll<HTMLElement>(
        `[data-caption-stage="${stage}"]`,
      );
      let index = 0;
      artwork.dataset.captionTyping = "true";
      const typeNext = () => {
        if (cancelled || index >= letters.length) return;
        cursor?.removeAttribute("data-cursor");
        cursor = letters[index++];
        cursor.style.opacity = "1";
        cursor.dataset.cursor = "true";
        if (index < letters.length) {
          typingTimer = window.setTimeout(typeNext, 75);
        } else {
          artwork.dataset.captionTyping = "false";
        }
      };
      typeNext();
    };
    const finishMark = () => {
      played = true;
      for (const animation of animations) animation.cancel();
      node.dataset.drawState = "complete";
    };
    const complete = () => {
      cancelled = true;
      window.clearTimeout(typingTimer);
      window.clearTimeout(captionTimer);
      finishMark();
      cursor?.removeAttribute("data-cursor");
      artwork.dataset.captionTyping = "false";
      artwork.dataset.captionState = "complete";
    };
    const start = () => {
      if (played || !revealed || !inView || preference.matches) return;
      played = true;
      frame = requestAnimationFrame(() => {
        node.dataset.drawState = "drawing";
        artwork.dataset.captionState = "active";
        typeCaption("sketch");
        // A light concept sketch follows four deliberate pen strokes. Each
        // starts only when the pen reaches it, without revealing distant corners.
        const timing = [
          { duration: 260, delay: 0 },
          { duration: 470, delay: 310 },
          { duration: 230, delay: 830 },
          { duration: 650, delay: 1060 },
        ];
        strokes.forEach((stroke, index) => {
          animations.push(
            stroke.animate(
              [
                { strokeDashoffset: "1", opacity: 1 },
                { strokeDashoffset: "0", opacity: 1 },
              ],
              { ...timing[index], easing: "linear", fill: "forwards" },
            ),
          );
        });
        Promise.all(animations.map((animation) => animation.finished)).then(
          () => {
            if (cancelled) return;
            node.dataset.drawState = "settling";
            typeCaption("finish");
            // Resolve the drawn concept into the untouched original vector.
            const finish = {
              duration: 1200,
              easing: "ease-in-out",
              fill: "forwards",
            } as const;
            const ink = finishedMark.animate(
              [{ opacity: 0 }, { opacity: 1 }],
              finish,
            );
            const pencil = sketch.animate(
              [{ opacity: 1 }, { opacity: 0 }],
              finish,
            );
            animations.push(ink, pencil);
            Promise.all([ink.finished, pencil.finished]).then(
              () => {
                if (cancelled) return;
                finishMark();
                artwork.dataset.captionState = "holding";
                captionTimer = window.setTimeout(() => {
                  artwork.dataset.captionState = "complete";
                }, 2000);
              },
              () => {},
            );
          },
          () => {},
        );
      });
    };
    const reveal = () => {
      revealed = true;
      start();
    };
    const motionChange = () => {
      if (preference.matches) {
        cancelAnimationFrame(frame);
        complete();
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        start();
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    document.addEventListener("motchi:page-reveal", reveal);
    preference.addEventListener("change", motionChange);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("motchi:page-reveal", reveal);
      preference.removeEventListener("change", motionChange);
      complete();
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1095 1095"
      width="1095"
      height="1095"
      className={styles.monogram}
      aria-hidden="true"
      data-draw-state="complete"
    >
      <g
        data-sketch
        fill="none"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {[
          ["M105 130V850", "#d7ae66"],
          [
            "M720 425V155C650 190 580 235 480 329C390 420 300 530 265 690",
            "#d7ae66",
          ],
          ["M105 130C235 180 332 278 420 430", "#d7ae66"],
          [
            "M423 434C503 539 548 700 583 811C615 910 660 947 704 923C754 889 780 837 813 839C851 841 877 915 935 935C1015 967 1028 868 1027 790V535",
            "#5B0202",
          ],
        ].map(([path, color]) => (
          <path
            key={path}
            d={path}
            stroke={color}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
            opacity="0"
          />
        ))}
      </g>
      <image href="/brand/mw-logo.svg" width="1095" height="1095" />
    </svg>
  );
}
