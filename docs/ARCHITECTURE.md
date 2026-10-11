# Architecture

## Boundaries

Three independent Next.js App Router applications share npm workspaces. Each app owns its pages, content, public files, and business-specific sections. Solutions is the parent company site; Websites presents services and supplied project examples; Consulting describes an emerging implementation-focused practice without fabricated case studies.

Shared packages export TypeScript source directly. Next transpiles them through `transpilePackages`, so there is no separate package-build pipeline. Apps use strict TypeScript and a single root lockfile. Node 24 runs TypeScript-only utility modules in tests using native type stripping; these modules avoid enums and other transpilation-dependent syntax.

| Package          | Responsibility                                                                               | Boundary                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `@motchi/brand`  | Family names/domains, approved asset paths, palette, typography, CSS tokens                  | No application or email imports                                                  |
| `@motchi/ui`     | Server-rendered navigation/footer, layout primitives, process graphic, forms, privacy notice | No branch-specific content                                                       |
| `@motchi/email`  | Validation, signed tokens, rate limits, escaped email templates, Brevo POST handling         | Public entry is guarded by `server-only`; `/validation` is safe for shared types |
| `@motchi/config` | TypeScript defaults, HTTP security headers, metadata/schema helpers                          | References family configuration; imports Next metadata types only                |

The contact component uses the email server entry, so UI's main barrel is intended for Server Components. Import a focused safe module if future client components need primitives. Client components handle the session intro, mobile-menu enhancement, header active/scroll state, the single reveal observer, optional video/GIF controls, contact sending feedback, notifications, and error recovery. CSS handles the transitions and paths. The menu still uses native details/summary without JavaScript; media uses static posters or native controls as its fallback.

## Rendering and forms

Marketing content renders as server HTML; home pages can be statically generated. Contact pages render dynamically to create fresh signed tokens. Native `POST /api/contact` works with JavaScript disabled and ends with a 303 redirect to a status message. No user input is placed in URLs. Invalid submissions identify field names and ask for re-entry rather than storing submitted personal data in a cookie or session.

Email uses HTTPS fetch rather than an SDK. There is no database, analytics, account system, animation framework, or instant quote calculator. Acknowledgements contain no submitted message, reducing unsolicited content in visitor mail.

## Growth

Add products in Solutions' typed content file, projects in Websites' typed content file, and consulting capabilities in Consulting's content file. Add shared components only after they serve more than one app. Additional branches can reuse the family config and shell without reworking deployment boundaries.

In-memory anti-abuse state is bounded and temporary, but local to each process. Production must add an edge rate-limit rule for the contact endpoints. A shared store/queue becomes appropriate for higher volume, durable replay protection, or reliable automatic acknowledgement retries; these are deliberate future infrastructure steps, not features silently claimed today.

## Presentation layer

`BranchMark` handles approved logo slots and fallback wordmarks. Shared font definitions are exposed at `@motchi/ui/fonts`, attached in each layout, and mapped into the existing semantic brand tokens. React Icons uses one Lucide family through small shared arrow/mail components; no animation framework was added.

Shared `MediaFrame`/`ProjectMedia` render typed image, video, or GIF assets. Videos retain native controls, muted inline playback, poster dimensions, and preload=none; optional automatic playback is guarded by visibility and reduced-motion checks. GIFs render a static poster until deliberately played and can be paused. The intro has its own bounded decorative playback policy.

Websites owns its `ProjectPreview` because desktop/mobile composition is portfolio-specific. Project media, colour treatment, links, featured metadata, and future case-study links are data-driven rather than keyed to the current client names. The mobile order remains media first even when desktop orientation alternates. New project records require no new layout component.

## Media assets

See [MEDIA_ASSETS.md](MEDIA_ASSETS.md). Each app owns public assets so it deploys independently; configuration lives in the brand package or Websites project data. Do not invent public media or use client imagery without approval.

Development form signing uses a process-shared temporary secret so independently loaded page/API bundles agree. The regression test loads separate module copies and checks the native validation path. Production still requires a configured secret and never uses that fallback.

## Page and navigation architecture

- Solutions: `/`, `/about`, `/contact`, `/privacy`. Businesses and planned products remain short homepage sections with explicit anchors.
- Websites: `/`, `/work`, `/services`, `/process`, `/contact`, `/privacy`. The homepage shows featured projects and directs visitors to deeper pages. About remains a concise identified homepage section.
- Consulting: `/`, `/capabilities`, `/approach`, `/contact`, `/privacy`. The homepage summarizes business problems and links to detailed scopes and the engagement lifecycle. About remains an identified section.

`packages/brand/src/navigation.ts` owns desktop/mobile navigation and public route lists. Sitemaps use those lists. New routes use `pageMetadata` for canonicals and matching social titles/descriptions. Navigation state considers only linked section IDs, so unrelated sections cannot accidentally clear the current page. Shared `PageHero` establishes inner-page hierarchy; business-specific detail stays in app components. Individual case-study routes are deliberately deferred until approved content provides sufficient substance.

## Feedback and error boundaries

`ContactForm` is a small client shell around server-rendered inputs. It observes native submission, prevents duplicate submissions while pending, reserves button width, announces progress, and resets on back/forward restoration. It does not intercept delivery with fetch or move validation into the browser. Native field constraints run first. After 25 seconds it offers conservative guidance because delivery may be ambiguous.

`Toast` provides supplemental, polite live feedback after success. The full server result stays visible. Notifications have a close button, a seven-second timeout paused on hover/focus, reduced-motion support, and focus restoration when dismissed by keyboard. They are not used for field errors or essential instructions.

Each app has `error.tsx` using the focused client-safe `@motchi/ui/error-state` export and a self-contained `global-error.tsx` for root-layout failures. Neither displays raw errors. Existing not-found pages remain distinct. Expected contact validation/provider outcomes use server messages, not thrown rendering errors. Static marketing routes have no artificial skeletons.
