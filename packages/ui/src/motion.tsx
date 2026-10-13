"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
// HTML is visible until an observer is installed. No-JS and failed enhancement stay readable.
export function MotionEnhancements() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const targets = new Set<HTMLElement>();
    const show = (element: HTMLElement) => {
      element.dataset.reveal = "visible";
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) show(entry.target as HTMLElement);
      },
      // A modest viewport inset delays entry without requiring a fraction of
      // tall sections to fit on smaller screens.
      { threshold: 0, rootMargin: "0px 0px -64px 0px" },
    );
    const register = (element: HTMLElement) => {
      if (targets.has(element)) return;
      targets.add(element);
      if (preference.matches) {
        element.dataset.reveal = "visible";
        return;
      }
      if (element.dataset.reveal === "visible") return;
      if (element.getBoundingClientRect().top >= window.innerHeight)
        element.dataset.reveal = "pending";
      observer.observe(element);
    };
    // Only enhance wrappers after their own hydration effect has run.
    for (const element of document.querySelectorAll<HTMLElement>(
      '[data-reveal-mounted="true"]',
    ))
      register(element);
    const ready = (event: Event) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.dataset.revealMounted === "true"
      )
        register(event.target);
    };
    document.addEventListener("motchi:reveal-ready", ready);
    const revealFocus = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) {
        let target = event.target.closest<HTMLElement>("[data-reveal]");
        while (target) {
          show(target);
          target =
            target.parentElement?.closest<HTMLElement>("[data-reveal]") ?? null;
        }
      }
    };
    const revealAll = () => {
      for (const element of targets) show(element);
    };
    document.addEventListener("focusin", revealFocus);
    preference.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      revealAll();
      document.removeEventListener("focusin", revealFocus);
      document.removeEventListener("motchi:reveal-ready", ready);
      preference.removeEventListener("change", revealAll);
    };
  }, [pathname]);
  useEffect(() => {
    if (!pathname) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map<
      Element,
      { animation: Animation; pulsing: boolean }
    >();
    const owner = (target: EventTarget | null) =>
      target instanceof Element ? target.closest("a, button") : null;
    const update = (control: Element, pulse: boolean) => {
      for (const arrow of control.querySelectorAll(".interaction-arrow")) {
        const previous = animations.get(arrow);
        if (pulse && previous?.pulsing) continue;
        const style = getComputedStyle(arrow);
        const current = style.transform;
        previous?.animation.cancel();
        animations.delete(arrow);
        if (preference.matches) continue;
        if (pulse) {
          const x = style.getPropertyValue("--arrow-x").trim() || "0px";
          const y = style.getPropertyValue("--arrow-y").trim() || "0px";
          const animation = arrow.animate(
            [
              { transform: "translate(0, 0)" },
              { transform: `translate(${x}, ${y})` },
              { transform: "translate(0, 0)" },
            ],
            { duration: 900, iterations: Infinity, easing: "ease-in-out" },
          );
          animations.set(arrow, { animation, pulsing: true });
        } else if (previous) {
          const animation = arrow.animate(
            [{ transform: current }, { transform: "translate(0, 0)" }],
            { duration: 260, easing: "cubic-bezier(.25,.1,.25,1)" },
          );
          animations.set(arrow, { animation, pulsing: false });
          animation.onfinish = () => {
            if (animations.get(arrow)?.animation === animation)
              animations.delete(arrow);
          };
        }
      }
    };
    const enter = (event: MouseEvent | FocusEvent) => {
      const control = owner(event.target);
      if (
        !control ||
        (event.relatedTarget instanceof Node &&
          control.contains(event.relatedTarget))
      )
        return;
      update(control, true);
    };
    const leave = (event: MouseEvent | FocusEvent) => {
      const control = owner(event.target);
      if (
        !control ||
        (event.relatedTarget instanceof Node &&
          control.contains(event.relatedTarget))
      )
        return;
      const stillActive =
        event.type === "mouseout"
          ? control.matches(":focus-visible")
          : control.matches(":hover");
      if (!stillActive) update(control, false);
    };
    const cancel = () => {
      for (const { animation } of animations.values()) animation.cancel();
      animations.clear();
    };
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    document.addEventListener("focusin", enter);
    document.addEventListener("focusout", leave);
    preference.addEventListener("change", cancel);
    return () => {
      cancel();
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
      document.removeEventListener("focusin", enter);
      document.removeEventListener("focusout", leave);
      preference.removeEventListener("change", cancel);
    };
  }, [pathname]);
  return null;
}
