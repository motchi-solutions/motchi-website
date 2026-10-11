import type { ComponentProps, ReactNode } from "react";
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-shell px-5 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}
export function Section({
  children,
  id,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`py-section ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`mb-5 text-xs font-bold tracking-widest uppercase ${light ? "text-accent" : "text-primary"}`}
    >
      {children}
    </p>
  );
}
export function ButtonLink({
  children,
  href,
  secondary = false,
  light = false,
  ...rest
}: ComponentProps<"a"> & { secondary?: boolean; light?: boolean }) {
  const color = light
    ? "border-inverse/40 text-inverse hover:bg-inverse/10"
    : secondary
      ? "border-border text-foreground hover:bg-surface"
      : "border-primary bg-primary text-inverse hover:bg-secondary";
  return (
    <a
      href={href}
      {...rest}
      className={`inline-flex min-h-12 items-center justify-center gap-6 border px-6 py-3 text-sm font-semibold transition-colors ${color}`}
    >
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-12 max-w-reading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-section font-medium tracking-tight">{title}</h2>
      {children && (
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {children}
        </p>
      )}
    </div>
  );
}
export function ContactCTA({
  title = "Let’s start with your business.",
}: {
  title?: string;
}) {
  return (
    <Section className="bg-primary text-inverse">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <Eyebrow light>A conversation, first</Eyebrow>
          <h2 className="text-section font-medium tracking-tight">{title}</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-inverse/80">
            Tell us what you’re working on. We typically respond with next steps
            or an initial quote within 2–3 business days.
          </p>
        </div>
        <div className="shrink-0">
          <ButtonLink href="/contact" light>
            Talk to Motchi
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
