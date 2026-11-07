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
