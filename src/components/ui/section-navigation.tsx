"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

export function SectionNavigation({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const restoreFocus = useRef(false);
  useLayoutEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      toggle.current?.focus({ preventScroll: true });
    }
  }, [open]);
  useEffect(() => {
    setOpen(false);
    const sections = items.map((item) => ({
      id: item.id,
      node: document.getElementById(item.id),
    }));
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > 240);
      const threshold = Math.min(220, window.innerHeight * 0.3);
      let active = items[0]?.id ?? "";
      for (const section of sections)
        if (
          section.node &&
          section.node.getBoundingClientRect().top <= threshold
        )
          active = section.id;
      setActiveId(active);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: Event) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(false);
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreFocus.current = true;
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open]);
  return (
    <div
      ref={root}
      className="section-navigation"
      data-visible={visible}
      data-open={open}
    >
      <div className="section-navigation-drawer">
        <button
          ref={toggle}
          type="button"
          className="section-navigation-handle"
          tabIndex={visible ? 0 : -1}
          aria-expanded={open && visible}
          aria-controls={panelId}
          aria-label={
            open ? "Close section navigation" : "Open section navigation"
          }
          onClick={() => setOpen((value) => !value)}
        >
          <svg
            viewBox="0 0 20 20"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="m12 5-5 5 5 5" />
          </svg>
        </button>
        <nav
          id={panelId}
          aria-label="On this page"
          aria-hidden={!visible || !open}
          inert={!visible || !open}
        >
          <p>On this page</p>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? "location" : undefined}
                  onClick={(event) => {
                    if (
                      event.button !== 0 ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    setOpen(false);
                    const section = document.getElementById(item.id);
                    const heading =
                      section?.querySelector<HTMLElement>("h1, h2");
                    if (section) {
                      const hash = `#${item.id}`;
                      if (window.location.hash !== hash)
                        window.history.pushState(null, "", hash);
                      section.scrollIntoView({
                        block: "start",
                        behavior: window.matchMedia(
                          "(prefers-reduced-motion: reduce)",
                        ).matches
                          ? "instant"
                          : "smooth",
                      });
                    }
                    if (heading) {
                      heading.tabIndex = -1;
                      heading.focus({ preventScroll: true });
                    }
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
