import type { ReactNode } from "react";
import { DisclosureList } from "./disclosure.tsx";
import { AnimatedLink, Container } from "./primitives.tsx";

/* Shared FAQ section for the service pages: the heading and a way to ask
   beside the questions on wide screens, stacked on smaller ones. */
export function FaqSection({
  questions,
  className = "bg-background",
}: {
  questions: readonly { title: string; content: ReactNode }[];
  className?: string;
}) {
  return (
    <section id="faq" className={`${className} py-section`}>
      <Container>
        <div className="grid gap-x-[clamp(3rem,6vw,7rem)] gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="min-w-0">
            <h2 className="text-h2 font-medium tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-5 max-w-120 text-body-lg leading-relaxed text-muted">
              Can't find what you're looking for? We're happy to talk it
              through.
            </p>
            <div className="mt-6">
              <AnimatedLink
                href="#enquiry"
                arrow
                underline="always"
                className="min-h-11 font-semibold text-primary"
              >
                Ask us a question
              </AnimatedLink>
            </div>
          </div>
          <DisclosureList items={questions} />
        </div>
      </Container>
    </section>
  );
}
