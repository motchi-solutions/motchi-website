"use client";

import { useRouter } from "next/navigation";
import { AnimatedLink } from "../primitives.tsx";

let cancelPendingScroll: (() => void) | undefined;

// Wait for the destination DOM, rather than guessing how long routing takes.
function preparePricingScroll() {
  cancelPendingScroll?.();
  let scheduled = false;
  let frame = 0;
  const cleanup = () => {
    observer.disconnect();
    window.clearTimeout(deadline);
    cancelAnimationFrame(frame);
    window.removeEventListener("pointerdown", cleanup);
    window.removeEventListener("wheel", cleanup);
    window.removeEventListener("keydown", cleanup);
    if (cancelPendingScroll === cleanup) cancelPendingScroll = undefined;
  };
  const observer = new MutationObserver(() => {
    const target = document.getElementById("pricing");
    if (!target || scheduled) return;
    scheduled = true;
    observer.disconnect();
    frame = requestAnimationFrame(() => {
      if (!target.isConnected || location.pathname !== "/websites") {
        cleanup();
        return;
      }
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) window.scrollTo({ top: 0, behavior: "instant" });
      frame = requestAnimationFrame(() => {
        if (target.isConnected) {
          const heading = target.querySelector<HTMLElement>("h2");
          heading?.setAttribute("tabindex", "-1");
          heading?.focus({ preventScroll: true });
          target.scrollIntoView({
            block: "start",
            behavior: reduced ? "instant" : "smooth",
          });
        }
        cleanup();
      });
    });
  });
  // A failed or superseded navigation must not leave a document observer behind.
  const deadline = window.setTimeout(cleanup, 10000);
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("pointerdown", cleanup, { once: true });
  window.addEventListener("wheel", cleanup, { once: true, passive: true });
  window.addEventListener("keydown", cleanup, { once: true });
  cancelPendingScroll = cleanup;
}

export function ComparePricingLink({ href }: { href: string }) {
  const router = useRouter();
  return (
    <AnimatedLink
      href={href}
      arrow
      underline="always"
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const destination = new URL(href, location.href);
        if (
          destination.origin !== location.origin ||
          destination.pathname !== "/websites" ||
          destination.hash !== "#pricing" ||
          location.pathname === destination.pathname
        )
          return;
        event.preventDefault();
        preparePricingScroll();
        router.push(
          `${destination.pathname}${destination.search}${destination.hash}`,
          {
            scroll: false,
          },
        );
      }}
    >
      Compare pricing
    </AnimatedLink>
  );
}
