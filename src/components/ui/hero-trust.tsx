import { LuCheck } from "react-icons/lu";
import { firstCall, organization } from "../../lib/config/sites.ts";

/* Reassurance beside the hero actions on every service branch: what the first
   step costs, how soon we reply, and where we are. Keep every item true. */
export const heroTrustItems = [
  `Free ${firstCall.length} intro call, no commitment`,
  "We usually reply within 2-3 business days",
  `Based in ${organization.location}, working globally`,
] as const;

export function HeroTrust({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <ul
      aria-label="What to expect"
      className={`flex flex-col gap-2 text-small leading-snug ${light ? "text-inverse/85" : "text-muted"} ${className}`}
    >
      {heroTrustItems.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <LuCheck
            aria-hidden="true"
            focusable="false"
            size={16}
            strokeWidth={2.5}
            className={`mt-[0.2em] shrink-0 ${light ? "text-accent" : "text-primary"}`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
