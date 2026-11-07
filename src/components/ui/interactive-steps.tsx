"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
export type ProcessStep = {
  id: string;
  title: string;
  summary: string;
  detailHeading?: string;
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
  singleSelection = false,
}: {
  id: string;
  steps: readonly ProcessStep[];
  singleSelection?: boolean;
}) {
  const [enhanced, setEnhanced] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [selected, setSelected] = useState<number | null>(
    singleSelection ? 0 : null,
  );
  const [outgoing, setOutgoing] = useState<number | null>(null);
  useEffect(() => {
    if (outgoing === null) return;
    const timer = window.setTimeout(() => setOutgoing(null), 320);
    return () => window.clearTimeout(timer);
  }, [outgoing]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setDesktop(media.matches);
    };
    update();
    if (!singleSelection && media.matches) setSelected(0);
    setEnhanced(true);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [singleSelection]);
  const track = useRef<HTMLDivElement>(null);
  const connectors = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    if (!singleSelection || !enhanced) return;
    const node = track.current;
    if (!node) return;
    const measure = () => {
      const bounds = node.getBoundingClientRect();
      const numbers = node.querySelectorAll<HTMLElement>(".step-number");
      const center = (index: number) => {
        const rect = numbers[index].getBoundingClientRect();
        return {
          x: rect.left - bounds.left + rect.width / 2,
          y: rect.top - bounds.top + rect.height / 2,
        };
      };
      connectors.current?.querySelectorAll("line").forEach((line, index) => {
        const start = center(index);
        const end = center(index + 1);
        line.setAttribute("x1", String(start.x));
        line.setAttribute("y1", String(start.y));
        line.setAttribute("x2", String(end.x));
        line.setAttribute("y2", String(end.y));
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    // Equal-height disclosures can trade space without resizing the track.
    // Measure each row before paint and update both strokes' shared geometry.
    node.querySelectorAll(".step-stage").forEach((stage) => {
      observer.observe(stage);
    });
    return () => observer.disconnect();
  }, [singleSelection, enhanced]);
  const current = selected === null ? undefined : steps[selected];
  return (
    <div
      id={id}
      data-steps
      data-enhanced={enhanced}
      data-desktop={desktop}
      data-single-selection={singleSelection}
    >
      <div ref={track} className="step-track">
        <ol
          className="step-journey"
          style={{
            gridTemplateColumns:
              enhanced && desktop && !singleSelection
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
                <div className="step-hit-area">
                  <span aria-hidden="true" className="step-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3
                      id={titleId}
                      className="step-title-with-toggle text-h3 font-semibold"
                    >
                      {step.title}
                      {enhanced && (
                        <span
                          className="step-disclosure-icon"
                          aria-hidden="true"
                        >
                          <span className="step-disclosure-horizontal" />
                          <span className="step-disclosure-vertical" />
                        </span>
                      )}
                    </h3>
                    <p
                      id={summaryId}
                      className="mt-2 text-small leading-relaxed text-muted"
                    >
                      {step.summary}
                    </p>
                  </div>
                  {enhanced && (
                    <button
                      type="button"
                      className="step-card-control"
                      aria-labelledby={titleId}
                      aria-describedby={summaryId}
                      aria-controls={desktop ? `${id}-panel` : detailId}
                      aria-expanded={selected === index}
                      onClick={() => {
                        const next = selected === index ? null : index;
                        const animate =
                          desktop &&
                          next !== null &&
                          selected !== null &&
                          !window.matchMedia("(prefers-reduced-motion: reduce)")
                            .matches;
                        setOutgoing(animate ? selected : null);
                        setSelected(next);
                      }}
                    />
                  )}
                </div>
                <div>
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
                      data-open={selected === index}
                      aria-hidden={selected !== index}
                      inert={selected !== index}
                      aria-labelledby={titleId}
                      className="step-detail step-inline-detail"
                    >
                      <div className="step-inline-clip">
                        <div className="pt-5 ml-14">
                          <StepDetails step={step} />
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        {singleSelection && enhanced && (
          <svg ref={connectors} className="step-travel-line" aria-hidden="true">
            {steps.slice(1).map((step, index) => (
              <line
                key={step.id}
                data-progressed={selected !== null && selected > index}
              />
            ))}
          </svg>
        )}
      </div>
      {enhanced && desktop && (
        <section
          hidden={!current}
          id={`${id}-panel`}
          aria-labelledby={`${id}-panel-title`}
          className={
            singleSelection
              ? "step-detail step-side-detail"
              : "step-detail mt-8 border border-border bg-surface p-6 sm:p-8"
          }
        >
          {outgoing !== null && current && (
            <div className="step-content-departure" aria-hidden="true">
              {singleSelection && (
                <p className="mb-4 text-small font-semibold text-primary">
                  Step {String(outgoing + 1).padStart(2, "0")}
                </p>
              )}
              <h3 className="mb-5 text-h3 font-medium text-primary">
                {steps[outgoing].detailHeading ?? steps[outgoing].title}
              </h3>
              <StepDetails step={steps[outgoing]} />
            </div>
          )}
          {current && (
            <div key={current.id} className="step-content-arrival">
              {singleSelection && (
                <p className="mb-4 text-small font-semibold text-primary">
                  Step {String((selected ?? 0) + 1).padStart(2, "0")}
                </p>
              )}
              <h3
                id={`${id}-panel-title`}
                className="mb-5 text-h3 font-medium text-primary"
              >
                {current.detailHeading ?? current.title}
              </h3>
              <StepDetails step={current} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
