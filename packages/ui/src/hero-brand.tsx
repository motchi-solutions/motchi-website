import type { Branch } from "@motchi/brand";
export function HeroBrand({
  branch,
  light = false,
}: {
  branch: Branch;
  light?: boolean;
}) {
  return (
    <p className={`hero-brand ${light ? "text-inverse" : "text-foreground"}`}>
      <span className="hero-brand-parent">MOTCHI</span>{" "}
      <span
        className={`hero-brand-branch ${light ? "text-accent" : "text-primary"}`}
      >
        {branch}
      </span>
    </p>
  );
}
