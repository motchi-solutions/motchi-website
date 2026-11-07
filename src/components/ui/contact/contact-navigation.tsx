"use client";
import { useEffect } from "react";
// Re-activating Contact in the shell returns to the introduction without losing the draft.
export function ContactNavigation() {
  useEffect(() => {
    const activate = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>(
              ".site-header a, .site-footer a",
            )
          : null;
      if (!link || link.target === "_blank") return;
      const url = new URL(link.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== "/contact" ||
        url.hash
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      document
        .querySelector<HTMLElement>("main h1")
        ?.focus({ preventScroll: true });
      window.scrollTo({
        top: 0,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    };
    document.addEventListener("click", activate, true);
    return () => document.removeEventListener("click", activate, true);
  }, []);
  return null;
}
