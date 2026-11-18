import type { Branch } from "../../lib/brand.ts";
export function HeroBrand({
  branch,
  light = false,
  className = "",
}: {
  branch: Branch;
  light?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`hero-brand ${light ? "text-inverse" : "text-foreground"} ${className}`}
    >
      <span className="hero-brand-parent">MOTCHI</span>{" "}
      <span
        className={`hero-brand-branch ${light ? "text-accent" : "text-primary"}`}
      >
        {branch}
      </span>
    </p>
  );
}
