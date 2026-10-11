"use client";
import { useEffect, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
export type ProcessStep = {
  id: string;
  title: string;
  summary: string;
  details: readonly string[];
};
function StepDetails({ step }: { step: ProcessStep }) {
  return (
    <ul className="grid gap-3 text-small leading-relaxed text-muted sm:grid-cols-2">
      {step.details.map((detail) => (
        <li key={detail} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
          />
          <span>{detail}</span>
        </li>
      ))}
    </ul>
  );
}
// SSR supplies useful native disclosures. Only selection and layout are enhanced.
export function InteractiveSteps({
  id,
  steps,
}: {
  id: string;
  steps: readonly ProcessStep[];
}) {
  const [enhanced, setEnhanced] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setDesktop(media.matches);
      setSelected((current) => (media.matches ? (current ?? 0) : current));
    };
    update();
    setEnhanced(true);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const current = selected === null ? undefined : steps[selected];
  return (
    <div id={id} data-steps data-enhanced={enhanced} data-desktop={desktop}>
      <ol
        className="step-journey"
        style={{
          gridTemplateColumns:
            enhanced && desktop
              ? `repeat(${steps.length}, minmax(0, 1fr))`
              : undefined,
        }}
      >
        {steps.map((step, index) => {
          const titleId = `${id}-${step.id}-title`;
          const summaryId = `${id}-${step.id}-summary`;
          const detailId = `${id}-${step.id}-detail`;
          return (
            <li
              key={step.id}
              className="step-stage"
              data-selected={selected === index}
            >
              <span aria-hidden="true" className="step-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h3 id={titleId} className="text-h3 font-semibold">
                  {enhanced ? (
                    <button
                      type="button"
                      aria-describedby={summaryId}
                      aria-controls={desktop ? `${id}-panel` : detailId}
                      aria-expanded={desktop ? undefined : selected === index}
                      aria-pressed={desktop ? selected === index : undefined}
                      className="step-control flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 text-left"
                      onPointerEnter={(event) => {
                        if (desktop && event.pointerType === "mouse")
                          setSelected(index);
                      }}
                      onFocus={() => {
                        if (desktop) setSelected(index);
                      }}
                      onClick={() =>
                        setSelected(
                          desktop ? index : selected === index ? null : index,
                        )
                      }
                    >
                      {step.title}
                      <LuChevronDown
                        aria-hidden="true"
                        className="step-chevron h-4 w-4 shrink-0 lg:hidden"
                      />
                    </button>
                  ) : (
                    step.title
                  )}
                </h3>
                <p
                  id={summaryId}
                  className="mt-2 text-small leading-relaxed text-muted"
                >
                  {step.summary}
                </p>
                {!enhanced && (
                  <details className="mt-3">
                    <summary className="inline-flex min-h-11 cursor-pointer items-center text-small text-primary">
                      Explore {step.title}
                    </summary>
                    <div className="py-4">
                      <StepDetails step={step} />
                    </div>
                  </details>
                )}
                {enhanced && !desktop && (
                  <section
                    id={detailId}
                    hidden={selected !== index}
                    aria-labelledby={titleId}
                    className="step-detail mt-5 border-l border-border pl-4"
                  >
                    <StepDetails step={step} />
                  </section>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {enhanced && desktop && current && (
        <section
          id={`${id}-panel`}
          aria-labelledby={`${id}-panel-title`}
          className="step-detail mt-8 border border-border bg-surface p-6 sm:p-8"
        >
          <h3 id={`${id}-panel-title`} className="mb-5 text-h3 font-medium">
            {current.title}: In Practice
          </h3>
          <StepDetails step={current} />
        </section>
      )}
    </div>
  );
}
