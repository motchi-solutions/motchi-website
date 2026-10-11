import { Eyebrow, Section } from "@motchi/ui";
import { engagement } from "@/content/capabilities";
export function Approach() {
  return (
    <Section id="approach" className="bg-surface">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow>From Idea to Everyday Use</Eyebrow>
          <h2 className="text-h2 font-medium tracking-tight">
            A Recommendation
            <br />
            Needs Someone
            <br />
            <span className="font-display italic text-primary">
              To Carry It Through.
            </span>
          </h2>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
            We don’t want to hand over a slide deck and disappear. We can work
            alongside your team through implementation, adoption, and the
            improvements that come next.
          </p>
          <p className="mt-7 max-w-md text-sm leading-relaxed text-muted">
            Each engagement has an agreed scope. We’ll be clear about what we
            can take on, what your team owns, and where other expertise is
            needed.
          </p>
        </div>
        <ol className="lifecycle">
          <svg
            viewBox="0 0 40 1000"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-5 left-0 h-full w-10 text-accent"
            fill="none"
            aria-hidden="true"
          >
            <path
              pathLength="1"
              className="path-trace"
              d="M19 0V920"
              stroke="currentColor"
            />
          </svg>
          {engagement.map((step, i) => (
            <li
              key={step.title}
              className="lifecycle-step grid grid-cols-[2.5rem_1fr] gap-5 pb-8 last:pb-0"
            >
              <span className="lifecycle-number inline-flex h-10 w-10 items-center justify-center rounded-full text-xs text-primary">
                0{i + 1}
              </span>
              <div className="pt-1">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
