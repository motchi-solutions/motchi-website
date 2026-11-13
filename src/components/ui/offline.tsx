"use client";

import { contactEmail } from "../../lib/config/sites.ts";
import { Arrow, Container } from "./primitives.tsx";

/* Shown by the service worker (public/sw.js) when a page cannot load because
   the device is offline. It reuses the not-found layout, and "Try again"
   reloads the address the visitor asked for. */
export function OfflinePage() {
  return (
    <Container className="not-found-layout">
      <div className="not-found-copy">
        <h1 className="text-h1 font-medium tracking-tight">You're offline</h1>
        <p className="text-body-lg leading-relaxed text-muted">
          We couldn't reach Motchi just now. Please check your internet
          connection, then try again.
        </p>
        <div className="not-found-actions">
          <button
            type="button"
            className="button-link inline-flex min-h-12 items-center justify-between gap-5 border border-primary bg-primary px-6 py-3 text-button font-semibold text-inverse hover:bg-secondary"
            onClick={() => window.location.reload()}
          >
            Try again <Arrow />
          </button>
          <a
            href={`mailto:${contactEmail}`}
            className="button-link inline-flex min-h-12 items-center justify-between gap-5 border border-border px-6 py-3 text-button font-semibold text-foreground hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            Email us
          </a>
        </div>
      </div>
    </Container>
  );
}
