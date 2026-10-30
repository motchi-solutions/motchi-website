"use client";
import { motionMilliseconds } from "./motion-timing";
import { usePathname } from "next/navigation";
import { SiteLink } from "./site-link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./icons";
export type NavItem = { label: string; href: string };
export function MobileMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
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
    node.dataset.expanded = String(node.open);
    let closing: Animation | undefined;
    let isClosing = false;
    const summary = node.querySelector("summary");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const transition = (opening: boolean, restore = false, animate = true) => {
      if (!opening && animate && (isClosing || !node.open)) {
        if (restore) summary?.focus();
        return;
      }
      setOpen(opening);
      node.dataset.expanded = String(opening);
      const panel = node.querySelector<HTMLElement>(".mobile-panel");
      const current = node.open && panel ? getComputedStyle(panel) : undefined;
      // Capture presentation values before cancelling so a reversal never jumps.
      const from = {
        opacity: current?.opacity ?? "0",
        transform: current?.transform ?? "translateY(-6px)",
      };
      closing?.cancel();
      closing = undefined;
      isClosing = !opening;
      if (opening) node.open = true;
      const finish = () => {
        closing = undefined;
        isClosing = false;
        if (!opening) node.open = false;
        if (restore) summary?.focus();
      };
      if (animate && panel && !preference.matches) {
        closing = panel.animate(
          [
            from,
            opening
              ? { opacity: 1, transform: "translateY(0)" }
              : { opacity: 0, transform: "translateY(-6px)" },
          ],
          {
            duration: motionMilliseconds(
              getComputedStyle(node).getPropertyValue("--motion-menu"),
              280,
            ),
            easing: getComputedStyle(node)
              .getPropertyValue("--ease-reveal")
              .trim(),
          },
        );
        closing.onfinish = finish;
      } else finish();
    };
    const close = (restore = false, animate = true) =>
      transition(false, restore, animate);
    dismissMenu.current = () => close();
    const toggle = (event: MouseEvent) => {
      event.preventDefault();
      transition(!node.open || isClosing);
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
      delete node.dataset.expanded;
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
      onToggle={(event) => {
        if (event.currentTarget.dataset.animated !== "true")
          setOpen(event.currentTarget.open);
      }}
    >
      {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: Native summary is a disclosure control; its open state is mirrored only after enhancement. */}
      <summary
        aria-label={open ? "Close menu" : "Open menu"}
        aria-controls="mobile-navigation"
        aria-expanded={enhanced ? open : undefined}
        className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-3 text-sm font-medium"
      >
        <span className="menu-trigger-label" aria-hidden="true">
          <span data-visible={!open}>Menu</span>
          <span data-visible={open}>Close</span>
        </span>
        <span className="hamburger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </summary>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={enhanced ? !open : undefined}
        inert={enhanced && !open}
        className="mobile-panel"
      >
        <p className="mobile-nav-heading">How can we help?</p>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <SiteLink
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`nav-link flex min-h-12 items-center justify-between px-3 text-base ${item.href === "/contact" ? "mobile-contact-cta" : ""}`}
                onClick={() => {
                  dismissMenu.current();
                }}
              >
                {item.label}
                <Arrow
                  external={/^(https?:)?\/\//.test(item.href)}
                  className="mobile-nav-arrow"
                />
              </SiteLink>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
