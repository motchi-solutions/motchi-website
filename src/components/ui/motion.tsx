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
  return null;
}
