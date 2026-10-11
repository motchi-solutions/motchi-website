"use client";
import { SiteLink } from "./site-link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./icons";
export type NavItem = { label: string; href: string };
export function MobileMenu({ items }: { items: NavItem[] }) {
  const details = useRef<HTMLDetailsElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setEnhanced(true);
    const node = details.current;
    if (!node) return;
    setOpen(node.open);
    const close = (restore = false) => {
      node.open = false;
      if (restore) node.querySelector("summary")?.focus();
    };
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
      if (desktop.matches) close();
    };
    document.addEventListener("keydown", keyboard);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    desktop.addEventListener("change", resize);
    return () => {
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
        </span>
      </summary>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className="mobile-panel absolute right-0 top-full mt-4 w-72 max-w-[calc(100vw-2.5rem)] border border-border bg-surface p-4 shadow-lg"
      >
        <p className="px-3 pt-2 pb-3 text-xs tracking-widest uppercase text-muted">
          Explore Motchi
        </p>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <SiteLink
                href={item.href}
                className="nav-link flex min-h-12 items-center justify-between px-3 text-base"
                onClick={() => {
                  if (details.current) details.current.open = false;
                }}
              >
                {item.label}
                <Arrow external className="text-muted" />
              </SiteLink>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
