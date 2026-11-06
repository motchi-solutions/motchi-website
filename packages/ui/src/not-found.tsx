import { ButtonLink, Container } from "./primitives";
export function NotFoundPage() {
  return (
    <Container className="not-found-layout">
      <div className="not-found-copy">
        <h1 className="text-h1 font-medium tracking-tight">Page not found</h1>
        <p className="text-body-lg leading-relaxed text-muted">
          This page may have moved, or the address may be incomplete. Check the
          address or head back to explore Motchi.
        </p>
        <div className="not-found-actions">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href="/contact" secondary>
            Contact us
          </ButtonLink>
        </div>
      </div>
      <svg
        className="not-found-art"
        viewBox="0 0 480 360"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="255" cy="180" r="155" fill="currentColor" opacity="0.12" />
        <path
          d="M65 275H145C180 275 180 225 215 225H270"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M270 225V135C270 105 300 90 330 90H410"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="7 10"
        />
        <circle cx="65" cy="275" r="9" fill="var(--brand-primary)" />
        <circle
          cx="270"
          cy="225"
          r="17"
          fill="var(--cream)"
          stroke="var(--brand-primary)"
          strokeWidth="3"
        />
        <path
          d="m397 78 13 12-13 12"
          stroke="var(--brand-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Container>
  );
}
