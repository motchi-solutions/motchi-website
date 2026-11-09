"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import {
  prepareSectionArrival,
  wantsSectionArrival,
} from "./section-arrival.ts";

export function SiteLink({
  href,
  target,
  rel,
  children,
  onClick,
  ...props
}: ComponentProps<"a">) {
  const router = useRouter();
  const safeRel =
    target === "_blank"
      ? Array.from(
          new Set([...(rel?.split(/\s+/) ?? []), "noopener", "noreferrer"]),
        ).join(" ")
      : rel;
  if (href?.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link
        href={href}
        prefetch={false}
        target={target}
        rel={safeRel}
        {...props}
        onClick={(event) => {
          onClick?.(event);
          // Respect handlers that already stopped navigation, such as the
          // contact form's unsaved-answers guard.
          const destination = wantsSectionArrival(event, href, target);
          if (!destination) return;
          event.preventDefault();
          prepareSectionArrival(destination);
          router.push(
            `${destination.pathname}${destination.search}${destination.hash}`,
            { scroll: false },
          );
        }}
      >
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target={target} rel={safeRel} onClick={onClick} {...props}>
      {children}
    </a>
  );
}
