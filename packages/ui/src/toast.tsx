"use client";
import { useEffect, useRef, useState } from "react";
import { LuX } from "react-icons/lu";

// Supplementary feedback only: essential outcomes must also remain in page content.
export function Toast({
  message,
  duration = 7000,
  returnFocusId,
}: {
  message: string;
  duration?: number;
  returnFocusId?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const region = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = region.current;
    if (!node) return;
    const pause = () => setPaused(true);
    const resume = (event: Event) => {
      if (
        event instanceof FocusEvent &&
        event.relatedTarget instanceof Node &&
        node.contains(event.relatedTarget)
      )
        return;
      if (!node.matches(":hover") && !node.contains(document.activeElement))
        setPaused(false);
    };
    node.addEventListener("mouseenter", pause);
    node.addEventListener("mouseleave", resume);
    node.addEventListener("focusin", pause);
    node.addEventListener("focusout", resume);
    return () => {
      node.removeEventListener("mouseenter", pause);
      node.removeEventListener("mouseleave", resume);
      node.removeEventListener("focusin", pause);
      node.removeEventListener("focusout", resume);
    };
  }, []);
  useEffect(() => {
    setVisible(Boolean(message));
  }, [message]);
  useEffect(() => {
    if (!visible || paused || duration === 0) return;
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [visible, paused, duration]);
  function dismiss() {
    if (region.current?.contains(document.activeElement) && returnFocusId) {
      document.getElementById(returnFocusId)?.focus();
    }
    setVisible(false);
  }
  return (
    <div
      ref={region}
      className={
        visible
          ? "toast fixed right-5 bottom-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm items-start gap-4 border border-border bg-surface p-5 text-foreground shadow-lg"
          : "sr-only"
      }
    >
      <output
        aria-live="polite"
        aria-atomic="true"
        className="flex-1 text-small leading-relaxed"
      >
        {visible ? message : ""}
      </output>
      {visible && (
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss Notification"
          className="-m-2 inline-flex min-h-11 min-w-11 items-center justify-center"
        >
          <LuX aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
