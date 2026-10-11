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
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const show = (element: HTMLElement) => {
      element.dataset.reveal = "visible";
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) show(entry.target as HTMLElement);
      },
      { threshold: 0, rootMargin: "0px 0px -32px 0px" },
    );
    for (const element of targets) {
      if (element.getBoundingClientRect().top >= window.innerHeight)
        element.dataset.reveal = "pending";
      observer.observe(element);
    }
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
      preference.removeEventListener("change", revealAll);
    };
  }, [pathname]);
  return null;
}
