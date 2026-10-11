import Link from "next/link";
import type { ComponentProps } from "react";

export function SiteLink({
  href,
  target,
  rel,
  children,
  ...props
}: ComponentProps<"a">) {
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
      >
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target={target} rel={safeRel} {...props}>
      {children}
    </a>
  );
}
