import { SiteLink } from "./site-link";
import type { ComponentProps, ReactNode } from "react";
import { Arrow } from "./icons";
import { Reveal } from "./reveal";
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
      <Container>
        <Reveal>{children}</Reveal>
      </Container>
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
      className={`eyebrow mb-5 flex items-center gap-3 text-eyebrow font-semibold tracking-widest uppercase ${light ? "text-accent" : "text-primary"}`}
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
  className = "",
  ...rest
}: ComponentProps<"a"> & { secondary?: boolean; light?: boolean }) {
  const color = light
    ? secondary
      ? "border-inverse/40 text-inverse hover:bg-inverse/10"
      : "border-inverse bg-inverse text-primary hover:border-accent hover:bg-accent"
    : secondary
      ? "border-border text-foreground hover:bg-surface"
      : "border-primary bg-primary text-inverse hover:bg-secondary";
  const external = typeof href === "string" && /^https?:/.test(href);
  return (
    <SiteLink
      href={href}
      {...rest}
      className={`button-link inline-flex min-h-12 max-w-full items-center justify-between gap-5 border px-6 py-3 text-button font-semibold ${color} ${className}`}
    >
      <span>{children}</span>
      <Arrow external={external} />
    </SiteLink>
  );
}
export function AnimatedLink({
  children,
  external = false,
  arrow = false,
  className = "",
  ...props
}: ComponentProps<"a"> & { external?: boolean; arrow?: boolean }) {
  return (
    <SiteLink
      {...props}
      className={`animated-link inline-flex items-center gap-3 ${className}`}
    >
      <span>{children}</span>
      {(external || arrow) && <Arrow external={external} />}
    </SiteLink>
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
    <div className="section-heading mb-12 max-w-reading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-h2 font-medium tracking-tight">{title}</h2>
      {children && (
        <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-muted">
          {children}
        </p>
      )}
    </div>
  );
}
export function ContactCTA({
  title = "How Can We Help Your Business?",
}: {
  title?: string;
}) {
  return (
    <Section className="cta-section relative overflow-hidden bg-primary text-inverse">
      <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <Eyebrow light>Let's Talk</Eyebrow>
          <h2 className="text-h2 font-medium tracking-tight">{title}</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-inverse/80">
            Tell us what you're working on. We typically respond with next steps
            or an initial quote within 2–3 business days.
          </p>
        </div>
        <div className="shrink-0">
          <ButtonLink href="/contact" light>
            Contact Us
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
