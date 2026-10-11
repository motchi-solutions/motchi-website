export function Workflow({
  steps,
}: {
  steps: { title: string; description: string }[];
}) {
  return (
    <ol className="grid gap-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title}>
          <span className="text-sm text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
export function SystemGraphic() {
  return (
    <div className="relative overflow-hidden border border-border bg-surface p-6 sm:p-9">
      <div className="mb-12 flex items-center justify-between border-b border-border pb-4 text-xs text-muted">
        <span>FROM IDEA TO EVERYDAY USE</span>
        <span aria-hidden="true">01 — 04</span>
      </div>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-accent"
        viewBox="0 0 500 500"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="flow-trace"
          d="M60 140H260V260H440M260 260V390H60"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="260" cy="260" r="8" fill="currentColor" />
      </svg>
      <ol className="relative grid grid-cols-2 gap-x-4 gap-y-16">
        {["Understand", "Plan", "Build", "Support"].map((step, i) => (
          <li
            key={step}
            className={`border border-border bg-background p-4 ${i % 2 === 1 ? "translate-y-8" : ""}`}
          >
            <p className="mb-5 text-xs text-primary">0{i + 1}</p>
            <p className="text-lg font-medium">{step}</p>
          </li>
        ))}
      </ol>
      <p className="relative mt-20 text-sm text-muted">
        Connected thinking. Working technology.
      </p>
    </div>
  );
}
