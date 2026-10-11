# Architecture

## Boundaries

Three independent Next.js App Router applications share npm workspaces. Each app owns its pages, content, public files, and business-specific sections. Solutions is the umbrella landing site; Websites presents services and supplied project examples; Consulting describes an emerging implementation-focused practice without fabricated case studies.

Shared packages export TypeScript source directly. Next transpiles them through `transpilePackages`, so there is no separate package-build pipeline. Apps use strict TypeScript and a single root lockfile. Node 24 runs TypeScript-only utility modules in tests using native type stripping; these modules avoid enums and other transpilation-dependent syntax.

| Package | Responsibility | Boundary |
| --- | --- | --- |
| `@motchi/brand` | Family names/domains, approved asset paths, palette, typography, CSS tokens | No application or email imports |
| `@motchi/ui` | Server-rendered navigation/footer, layout primitives, process graphic, forms, privacy notice | No branch-specific content |
| `@motchi/email` | Validation, signed tokens, rate limits, escaped email templates, Brevo POST handling | Public entry is guarded by `server-only`; `/validation` is safe for shared types |
| `@motchi/config` | TypeScript defaults, HTTP security headers, metadata/schema helpers | References family configuration; imports Next metadata types only |

The contact component uses the email server entry, so UI's main barrel is intended for Server Components. Import a focused safe module if future client components need primitives. The only current client component remembers/plays an optional, non-blocking brand introduction. CSS handles the remaining motion.

## Rendering and forms

Marketing content renders as server HTML; home pages can be statically generated. Contact pages render dynamically to create fresh signed tokens. Native `POST /api/contact` works with JavaScript disabled and ends with a 303 redirect to a status message. No user input is placed in URLs. Invalid submissions identify field names and ask for re-entry rather than storing submitted personal data in a cookie or session.

Email uses HTTPS fetch rather than an SDK. There is no database, analytics, account system, animation framework, or instant quote calculator. Acknowledgements contain no submitted message, reducing unsolicited content in visitor mail.

## Growth

Add products in Solutions' typed content file, projects in Websites' typed content file, and consulting capabilities in Consulting's content file. Add shared components only after they serve more than one app. Additional branches can reuse the family config and shell without reworking deployment boundaries.

In-memory anti-abuse state is bounded and temporary, but local to each process. Production must add an edge rate-limit rule for the contact endpoints. A shared store/queue becomes appropriate for higher volume, durable replay protection, or reliable automatic acknowledgement retries; these are deliberate future infrastructure steps, not features silently claimed today.
