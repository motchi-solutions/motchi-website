import { AnimatedLink } from "../primitives.tsx";

// SiteLink handles the arrival: top of /websites first, then a smooth glide to
// pricing. Same-page links keep the native smooth anchor scroll.
export function ComparePricingLink({ href }: { href: string }) {
  return (
    <AnimatedLink href={href} arrow underline="always">
      Compare pricing
    </AnimatedLink>
  );
}
