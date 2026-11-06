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
    ).map((link) => ({ link, url: new URL(link.href) }));
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]"),
    ).filter((section) =>
      links.some(({ url }) => {
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
      const scrolled = String(window.scrollY > 24);
      // Read section positions before changing styles or navigation attributes.
      let active: string | undefined;
      for (let index = sections.length - 1; index >= 0; index--) {
        if (sections[index].getBoundingClientRect().top <= 160) {
          active = sections[index].id;
          break;
        }
      }
      if (header.dataset.scrolled !== scrolled)
        header.dataset.scrolled = scrolled;
      for (const { link, url } of links) {
        const selected =
          url.origin === window.location.origin &&
          (url.pathname === window.location.pathname ||
            (url.pathname !== "/" &&
              window.location.pathname.startsWith(`${url.pathname}/`))) &&
          (url.hash ? url.hash === `#${active}` : !active);
        const current = selected ? (url.hash ? "location" : "page") : null;
        if (link.getAttribute("aria-current") === current) continue;
        if (current) link.setAttribute("aria-current", current);
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
