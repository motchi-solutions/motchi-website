"use client";
import type { ComponentProps } from "react";
import { SiteLink } from "./site-link.tsx";
import { AnimatedLink, ButtonLink } from "./primitives.tsx";

export function ContactLink({
  appearance = "plain",
  secondary = false,
  href = "/contact",
  ...props
}: ComponentProps<"a"> & {
  appearance?: "plain" | "button" | "animated";
  secondary?: boolean;
}) {
  if (appearance === "button")
    return <ButtonLink href={href} secondary={secondary} {...props} />;
  if (appearance === "animated") return <AnimatedLink href={href} {...props} />;
  return <SiteLink href={href} {...props} />;
}
