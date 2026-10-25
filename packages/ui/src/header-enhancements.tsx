"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export function HeaderEnhancements() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    const header = document.querySelector<HTMLElement>("[data-header]");
    if (!header) return;
    const links = Array.from(
      header.querySelectorAll<HTMLAnchorElement>("nav a"),
    );
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]"),
    ).filter((section) =>
      links.some((link) => {
        const url = new URL(link.href);
        return (
          url.origin === window.location.origin &&
          url.pathname === window.location.pathname &&
          url.hash === `#${section.id}`
        );
      }),
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      header.dataset.scrolled = String(window.scrollY > 24);
      const active = sections
        .filter((section) => section.getBoundingClientRect().top <= 160)
        .at(-1)?.id;
      for (const link of links) {
        const url = new URL(link.href);
        const selected =
          url.origin === window.location.origin &&
          (url.pathname === window.location.pathname ||
            (url.pathname !== "/" &&
              window.location.pathname.startsWith(`${url.pathname}/`))) &&
          (url.hash ? url.hash === `#${active}` : !active);
        if (selected)
          link.setAttribute("aria-current", url.hash ? "location" : "page");
        else link.removeAttribute("aria-current");
      }
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
  }, [pathname]);
  return null;
}
