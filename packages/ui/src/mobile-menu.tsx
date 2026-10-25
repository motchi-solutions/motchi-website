"use client";
import { SiteLink } from "./site-link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./icons";
export type NavItem = { label: string; href: string };
export function MobileMenu({ items }: { items: NavItem[] }) {
  const details = useRef<HTMLDetailsElement>(null);
  const dismissMenu = useRef<() => void>(() => {});
  const [enhanced, setEnhanced] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setEnhanced(true);
    const node = details.current;
    if (!node) return;
    setOpen(node.open);
    node.dataset.animated = "true";
    let closing: Animation | undefined;
    const summary = node.querySelector("summary");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const close = (restore = false, animate = true) => {
      const panel = node.querySelector<HTMLElement>(".mobile-panel");
      const current = panel ? getComputedStyle(panel) : undefined;
      const opacity = current?.opacity ?? "1";
      const transform = current?.transform ?? "none";
      closing?.cancel();
      closing = undefined;
      const finish = () => {
        closing = undefined;
        node.open = false;
        if (restore) summary?.focus();
      };
      if (animate && panel && !preference.matches) {
        const duration = Number.parseFloat(
          getComputedStyle(node).getPropertyValue("--motion-base"),
        );
        closing = panel.animate(
          [
            { opacity, transform },
            { opacity: 0, transform: "translateY(-8px) scale(0.98)" },
          ],
          {
            duration,
            easing: getComputedStyle(node)
              .getPropertyValue("--ease-reveal")
              .trim(),
          },
        );
        closing.onfinish = finish;
      } else finish();
    };
    dismissMenu.current = () => close();
    const toggle = (event: MouseEvent) => {
      event.preventDefault();
      if (node.open) {
        close(false, true);
        return;
      }
      node.open = true;
      const panel = node.querySelector<HTMLElement>(".mobile-panel");
      if (panel && !preference.matches) {
        closing?.cancel();
        closing = panel.animate(
          [
            { opacity: 0, transform: "translateY(-12px) scale(0.98)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ],
          { duration: 520, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
        );
      }
    };
    const reduce = () => {
      if (preference.matches && closing) close(false, false);
    };
    summary?.addEventListener("click", toggle);
    preference.addEventListener("change", reduce);
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape" && node.open) {
        event.preventDefault();
        close(true);
      }
    };
    const outside = (event: Event) => {
      if (
        node.open &&
        event.target instanceof Node &&
        !node.contains(event.target)
      )
        close();
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const resize = () => {
      if (desktop.matches) close(false, false);
    };
    document.addEventListener("keydown", keyboard);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    desktop.addEventListener("change", resize);
    return () => {
      closing?.cancel();
      delete node.dataset.animated;
      summary?.removeEventListener("click", toggle);
      preference.removeEventListener("change", reduce);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      desktop.removeEventListener("change", resize);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <details
      ref={details}
      className="mobile-menu relative lg:hidden"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: Native summary is a disclosure control; its open state is mirrored only after enhancement. */}
      <summary
        aria-controls="mobile-navigation"
        aria-expanded={enhanced ? open : undefined}
        className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-3 text-sm font-medium"
      >
        <span>Menu</span>
        <span className="hamburger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </summary>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className="mobile-panel w-72 max-w-[calc(100vw-2.5rem)] border border-border bg-surface p-4 shadow-lg"
      >
        <p className="px-3 pt-2 pb-3 text-xs tracking-widest uppercase text-muted">
          How can we help?
        </p>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <SiteLink
                href={item.href}
                className={`nav-link flex min-h-12 items-center justify-between px-3 text-base ${item.href === "/contact" ? "mobile-contact-cta" : ""}`}
                onClick={() => {
                  dismissMenu.current();
                }}
              >
                {item.label}
                <Arrow
                  external={/^(https?:)?\/\//.test(item.href)}
                  className="text-muted"
                />
              </SiteLink>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
