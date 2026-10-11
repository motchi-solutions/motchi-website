import { SiteLink } from "./site-link";
import { getSites } from "@motchi/config/env";

import { Arrow } from "./icons";
import { MediaFrame } from "./media";
import { Reveal } from "./reveal";
export function Workflow({
  steps,
}: {
  steps: { title: string; description: string }[];
}) {
  return (
    <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <svg
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-0 hidden h-10 w-full text-border lg:block"
        aria-hidden="true"
      >
        <path
          pathLength="1"
          className="path-trace"
          d="M20 20H980"
          stroke="currentColor"
          fill="none"
        />
      </svg>
      {steps.map((step, index) => (
        <li key={step.title} className="relative">
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-xs text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
export function SystemGraphic() {
  const family = getSites();
  const directions = [
    {
      name: "Websites",
      description: "Your business, online.",
      href: family.websites.url,
      external: true,
    },
    {
      name: "Consulting",
      description: "Your systems, working better.",
      href: family.consulting.url,
      external: true,
    },
    {
      name: "Products",
      description: "Our ideas, taking shape.",
      href: "#products",
      external: false,
    },
  ];
  return (
    <Reveal>
      <MediaFrame className="bg-secondary p-6 text-inverse sm:p-8">
        <div className="relative z-10 flex justify-between gap-4 text-xs tracking-wide">
          <span className="text-accent">ONE CONNECTED APPROACH</span>
          <span aria-hidden="true" className="text-inverse/50">
            01—03
          </span>
        </div>
        <div className="relative mt-8">
          <svg
            viewBox="0 0 500 410"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full text-accent"
            fill="none"
            aria-hidden="true"
          >
            <path
              pathLength="1"
              className="path-trace"
              d="M24 28V382M24 116H110M24 226H110M24 336H110"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="24" cy="28" r="4" fill="currentColor" />
            <circle cx="24" cy="382" r="4" fill="currentColor" />
          </svg>
          <div className="relative pl-12">
            <p className="text-sm font-semibold">Understand your business.</p>
            <p className="mt-2 text-xs text-inverse/60">
              The starting point for everything we build.
            </p>
            <ul className="mt-8 space-y-4">
              {directions.map((direction, i) => (
                <li key={direction.name}>
                  <SiteLink
                    href={direction.href}
                    className="button-link flow-node flex min-h-14 items-center sm:min-h-20 justify-between gap-4 border border-inverse/20 bg-secondary p-4 hover:bg-primary"
                  >
                    <div className="flex items-center gap-3 sm:block">
                      <span className="text-xs text-accent">0{i + 1}</span>
                      <p className="text-lg font-medium sm:mt-1 sm:text-xl">
                        {direction.name}
                      </p>
                      <p className="sr-only sm:not-sr-only sm:mt-1 sm:text-xs sm:text-inverse/70">
                        {direction.description}
                      </p>
                    </div>
                    <Arrow external={direction.external} />
                  </SiteLink>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm font-semibold">Stay involved.</p>
            <p className="mt-2 text-xs text-inverse/60">
              Implementation, adoption, and continued support.
            </p>
          </div>
        </div>
      </MediaFrame>
    </Reveal>
  );
}
