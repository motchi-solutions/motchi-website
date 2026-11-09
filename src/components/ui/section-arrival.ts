"use client";

/* Cross-page section links: arrive at the top of the new page, then glide to
   the section, instead of replacing the view already scrolled. Waits for the
   destination DOM rather than guessing how long routing takes. */

let cancelPending: (() => void) | undefined;

/** True when a click should use the gentle arrival instead of a plain jump. */
export function wantsSectionArrival(
  event: {
    button: number;
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    defaultPrevented: boolean;
  },
  href: string | undefined,
  target: string | undefined,
): URL | null {
  if (
    !href ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (target && target !== "_self") ||
    !href.startsWith("/") ||
    href.startsWith("//")
  )
    return null;
  const destination = new URL(href, location.href);
  if (
    destination.origin !== location.origin ||
    !destination.hash ||
    destination.pathname === location.pathname
  )
    return null;
  return destination;
}

/* If content above the section changed size during the glide (late images,
   hydrated components), make one gentle correction once scrolling stops. */
function settle(target: HTMLElement, behavior: ScrollBehavior) {
  let done = false;
  const check = () => {
    if (done) return;
    done = true;
    window.removeEventListener("scrollend", check);
    if (!target.isConnected) return;
    const padding =
      Number.parseFloat(
        getComputedStyle(document.documentElement).scrollPaddingTop,
      ) || 0;
    const margin =
      Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const offset = target.getBoundingClientRect().top - (padding + margin);
    if (Math.abs(offset) > 24)
      target.scrollIntoView({ block: "start", behavior });
  };
  window.addEventListener("scrollend", check, { once: true });
  window.setTimeout(check, 1600);
}

export function prepareSectionArrival(destination: URL) {
  cancelPending?.();
  const id = decodeURIComponent(destination.hash.slice(1));
  let scheduled = false;
  let frame = 0;
  const cleanup = () => {
    observer.disconnect();
    window.clearTimeout(deadline);
    cancelAnimationFrame(frame);
    window.removeEventListener("pointerdown", cleanup);
    window.removeEventListener("wheel", cleanup);
    window.removeEventListener("keydown", cleanup);
    if (cancelPending === cleanup) cancelPending = undefined;
  };
  const observer = new MutationObserver(() => {
    if (scheduled || location.pathname !== destination.pathname) return;
    const target = document.getElementById(id);
    if (!target) return;
    scheduled = true;
    observer.disconnect();
    frame = requestAnimationFrame(() => {
      if (!target.isConnected || location.pathname !== destination.pathname) {
        cleanup();
        return;
      }
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) window.scrollTo({ top: 0, behavior: "instant" });
      frame = requestAnimationFrame(() => {
        if (target.isConnected) {
          // Move focus with the view so keyboard and screen reader users land there too.
          const heading = target.querySelector<HTMLElement>("h1, h2");
          const focusTarget = heading ?? target;
          if (!focusTarget.hasAttribute("tabindex"))
            focusTarget.setAttribute("tabindex", "-1");
          focusTarget.focus({ preventScroll: true });
          const behavior = reduced ? "instant" : "smooth";
          target.scrollIntoView({ block: "start", behavior });
          settle(target, behavior);
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
  cancelPending = cleanup;
}
