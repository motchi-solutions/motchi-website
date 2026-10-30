"use client";
import { motionMilliseconds } from "./motion-timing";
import { useLayoutEffect, useRef, type ReactNode } from "react";

const details =
  /(?:^|_)(trace|path-trace|connect|connect-story|icon-arrive|globe-turn|chart-draw|workflow-release|workflow-complete|workflow-transfer|compass-navigate)(?:$|__)/;

function prepareEntry(root: HTMLDivElement) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches) {
    root.dataset.entryPhase = "ready";
    return;
  }
  const hero = root.querySelector("section") ?? root;
  const decorations: Animation[] = [];
  // Assemble the initial artwork before revealing it. Newly mounted tab
  // content is deliberately outside this one-time entrance sequence.
  for (const animation of [
    ...root.getAnimations(),
    ...hero.getAnimations({ subtree: true }),
  ]) {
    if (!(animation instanceof CSSAnimation)) continue;
    const timing = animation.effect?.getTiming();
    if (
      timing?.iterations === Infinity ||
      details.test(animation.animationName)
    ) {
      animation.pause();
      animation.currentTime = 0;
      decorations.push(animation);
    } else {
      animation.finish();
    }
  }
  const candidates = Array.from(
    hero.querySelectorAll<HTMLElement>(
      ".page-introduction, .solutions-hero-intro, .family-hero-intro, .family-hero-secondary, .system-reveal, [data-entry-reveal]",
    ),
  );
  const targets = candidates.filter(
    (element) =>
      !candidates.some(
        (parent) => parent !== element && parent.contains(element),
      ) &&
      element.dataset.reveal !== "pending" &&
      !(
        element.hasAttribute("data-reveal") &&
        element.getBoundingClientRect().top >= window.innerHeight
      ),
  );
  if (!targets.length) targets.push(hero as HTMLElement);
  targets.sort((a, b) => {
    const first = a.getBoundingClientRect(),
      second = b.getBoundingClientRect();
    return Math.abs(first.top - second.top) < 24
      ? first.left - second.left
      : first.top - second.top;
  });
  const style = getComputedStyle(root);
  const duration = motionMilliseconds(
    style.getPropertyValue("--motion-page-reveal"),
    1000,
  );
  const stagger = motionMilliseconds(
    style.getPropertyValue("--motion-page-stagger"),
    60,
  );
  const easing =
    style.getPropertyValue("--ease-page-reveal").trim() ||
    "cubic-bezier(0.22, 0.61, 0.36, 1)";
  const entrances = targets.map((element, index) => {
    const animation = element.animate(
      [
        { opacity: 0, transform: "translateY(4px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration,
        delay: Math.min(index * stagger, 120),
        easing,
        fill: "both",
      },
    );
    animation.pause();
    animation.currentTime = 0;
    return animation;
  });
  let started = false;
  let cancelled = false;
  let timer: number | undefined;
  const start = () => {
    if (started || cancelled) return;
    started = true;
    window.clearTimeout(timer);
    root.dataset.entryPhase = "entering";
    for (const animation of entrances)
      if (animation.playState !== "finished") animation.play();
    for (const animation of decorations) {
      if (animation.effect?.getTiming().iterations === Infinity) continue;
      animation.effect?.updateTiming({ delay: 0 });
      animation.play();
    }
    Promise.all(entrances.map((animation) => animation.finished)).then(
      () => {
        if (cancelled || preference.matches) return;
        root.dataset.entryPhase = "ready";
        for (const animation of decorations) {
          if (animation.effect?.getTiming().iterations !== Infinity) continue;
          const target = (animation.effect as KeyframeEffect | null)?.target;
          if (target instanceof Element && target.isConnected) {
            animation.effect?.updateTiming({ delay: 0 });
            animation.play();
          }
        }
      },
      () => {},
    );
  };
  const finish = () => {
    window.clearTimeout(timer);
    for (const animation of entrances) animation.finish();
    for (const animation of decorations) {
      if (animation.effect?.getTiming().iterations === Infinity)
        animation.cancel();
      else animation.finish();
    }
    root.dataset.entryPhase = "ready";
  };
  const revealControl = (event: Event) => {
    if (!(event.target instanceof Node)) return;
    targets.forEach((target, index) => {
      if (target.contains(event.target as Node)) entrances[index].finish();
    });
  };
  root.dataset.entryPhase = "waiting";
  document.addEventListener("motchi:page-reveal", start);
  root.addEventListener("focusin", revealControl);
  root.addEventListener("pointerdown", revealControl);
  preference.addEventListener("change", finish);
  const intro = document.querySelector<HTMLElement>(".intro-experience");
  if (!intro || intro.dataset.introReleasing === "true") start();
  else {
    const elapsed = Number(intro.getAnimations()[0]?.currentTime ?? 0);
    const introDuration = motionMilliseconds(
      getComputedStyle(intro).getPropertyValue("--motion-intro"),
      2600,
    );
    // Begin the page entrance as the selected identity opens onto it.
    timer = window.setTimeout(
      start,
      Math.max(0, introDuration * 0.77 - elapsed),
    );
  }
  return () => {
    cancelled = true;
    window.clearTimeout(timer);
    document.removeEventListener("motchi:page-reveal", start);
    root.removeEventListener("focusin", revealControl);
    root.removeEventListener("pointerdown", revealControl);
    preference.removeEventListener("change", finish);
    for (const animation of entrances) animation.cancel();
    // Preserve CSS animation ownership across effect restarts (including
    // development Strict Mode), so the next setup can rewind and play it.
    for (const animation of decorations) animation.pause();
  };
}

export function PageEntry({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    // Next's template already remounts this component on route changes.
    // Read the committed URL after mount, without re-keying streamed children
    // or suspending this lifecycle wrapper on a navigation-hook promise.
    root.dataset.innerPage = String(window.location.pathname !== "/");
    let cleanup: (() => void) | undefined;
    const observer = new MutationObserver(() => {
      if (!root.querySelector("h1")) return;
      observer.disconnect();
      cleanup = prepareEntry(root);
    });
    if (root.querySelector("h1")) cleanup = prepareEntry(root);
    else observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, []);
  return (
    <div ref={ref} className="page-arrival">
      {children}
    </div>
  );
}
