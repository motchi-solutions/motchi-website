import type { ReactNode } from "react";
import { Container, Eyebrow } from "./primitives";

export function PageHero({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="brand-grid relative overflow-hidden border-b border-border py-hero">
      <Container className="page-introduction section-introduction relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-4xl text-h1 font-medium tracking-tight">
          {title}
        </h1>
        <p className="mt-[var(--space-copy)] max-w-reading text-body-lg leading-relaxed text-muted">
          {children}
        </p>
        {actions && (
          <div className="mt-[var(--space-action)] flex flex-wrap gap-3">
            {actions}
          </div>
        )}
      </Container>
    </section>
  );
}
