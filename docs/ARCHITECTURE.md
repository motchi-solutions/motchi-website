# Architecture

## Boundaries

Three independent Next.js App Router applications share npm workspaces. Each app owns its pages, content, public files, and business-specific sections. Solutions is the parent company site; Websites presents services and supplied project examples; Consulting describes an emerging implementation-focused practice without fabricated case studies.

Shared packages export TypeScript source directly. Next transpiles them through `transpilePackages`, so there is no separate package-build pipeline. Apps use strict TypeScript and a single root lockfile. Node 26.12 or newer within Node 26 runs TypeScript-only utility modules in tests using native type stripping; these modules avoid enums and other transpilation-dependent syntax.

| Package          | Responsibility                                                                                                   | Boundary                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `@motchi/brand`  | Approved asset paths, palette, typography, CSS tokens                                                            | No application or email imports                                                           |
| `@motchi/ui`     | Server-rendered navigation/footer, layout primitives, process graphic, forms, privacy notice                     | No branch-specific content                                                                |
| `@motchi/email`  | Validation, signed tokens, rate limits, escaped email templates, Brevo POST handling                             | Public entry is guarded by `server-only`; `/validation` is safe for shared types          |
| `@motchi/config` | Site/organization/navigation config, validated server env, TypeScript/security defaults, metadata/schema helpers | Browser-safe source exports are separate from guarded server environment/metadata modules |

The contact component uses the email server entry, so UI's main barrel is intended for Server Components. Import a focused safe module if future client components need primitives. Client components handle the document-entry intro, mobile-menu enhancement, header active/scroll state, the single reveal observer, optional video/GIF controls, contact sending feedback, notifications, and error recovery. CSS handles the transitions and paths. The menu still uses native details/summary without JavaScript; media uses static posters or native controls as its fallback.

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

`packages/config/src/navigation.ts` owns desktop/mobile navigation and public route lists. Sitemaps use those lists. New routes use `pageMetadata` for canonicals and matching social titles/descriptions. Navigation state considers only linked section IDs, so unrelated sections cannot accidentally clear the current page. Shared `PageHero` establishes inner-page hierarchy; business-specific detail stays in app components. Individual case-study routes are deliberately deferred until approved content provides sufficient substance.

## Feedback and error boundaries

`ContactForm` is a small client shell around server-rendered inputs. It observes native submission, prevents duplicate submissions while pending, reserves button width, announces progress, and resets on back/forward restoration. It does not intercept delivery with fetch or move validation into the browser. Native field constraints run first. After 25 seconds it offers conservative guidance because delivery may be ambiguous.

`Toast` provides supplemental, polite live feedback after success. The full server result stays visible. Notifications have a close button, a seven-second timeout paused on hover/focus, reduced-motion support, and focus restoration when dismissed by keyboard. They are not used for field errors or essential instructions.

Each app has `error.tsx` using the focused client-safe `@motchi/ui/error-state` export and a self-contained `global-error.tsx` for root-layout failures. Neither displays raw errors. Existing not-found pages remain distinct. Expected contact validation/provider outcomes use server messages, not thrown rendering errors. Static marketing routes have no artificial skeletons.

## Progressive disclosure

`InteractiveSteps` is the shared client interaction for the four-stage Solutions, six-stage Websites, and seven-stage Consulting journeys. Apps own typed process content; the UI owns selection and responsive disclosure. Stage titles and one-sentence summaries are always server-rendered and visible. Native `details` provide optional detail without JavaScript. Enhancement replaces those controls with desktop selection buttons and one adjacent detail panel, or mobile disclosure buttons with inline regions. Focus and mouse hover select desktop stages; click/tap and keyboard activation control mobile details. Relationships and states use `aria-controls`, `aria-pressed`, or `aria-expanded` as appropriate. Reduced motion suppresses transition effects.

Websites' homepage names core services and the full brief-to-support journey; Consulting's homepage names all core capabilities and its engagement journey. These remain understandable without opening anything. Service scope uses native disclosure, and optional structured project detail appears only on the full Work page. No new empty project routes or additional framework dependencies were introduced.

## Application vs identity configuration

`packages/config` owns `sites.ts`, navigation, environment validation, and deployment-aware URLs. `packages/brand` owns visual identity only. Client-safe source configuration contains public identity facts; `@motchi/config/env` uses a server-only marker and is consumed only by server-rendered links, metadata, and email handling. No public environment variables are required. See [CONFIGURATION.md](CONFIGURATION.md).

`SiteLink` uses Next Link for internal routes with prefetch disabled and ordinary anchors for fragments, mailto, and sister domains. New tabs are opt-in and receive safe rel attributes. Header/motion effects respond to pathname changes because the root shell persists during internal navigation. Dynamic contact tokens continue to be generated on the server rather than prefetched into a static page.

## Entry experience

Each root layout mounts `Introduction` once alongside the server-rendered page. Header no longer owns it. CSS choreographs the three approved identities, branch emphasis, centring, zoom, and expanding radial aperture; the client controller handles dismissal and lifetime only. A new document or refresh restarts the sequence; same-app navigation preserves the dismissed controller. The overlay does not use session storage, add a route, or delay page rendering. Privacy and metadata remain independent of animation state.

`PageEntry` coordinates initial reveals across all three sites. It waits for streamed page content, assembles initial artwork, then reveals whole introduction groups and stable `data-entry-reveal` groups with shared motion tokens. The sequence begins with the intro aperture, or on `motchi:page-reveal` when the intro is skipped. Client navigation starts it immediately. Secondary line details start with the entrance, while newly mounted interaction content keeps its own animation timing. Mark stable artwork containers rather than their keyed tab children, and avoid nesting entrance groups. Server HTML remains visible without the enhancement.

Interactive About, Services, and Products hero copy panels share a CSS grid cell. Inactive panels reserve their natural responsive space while remaining inert and hidden from accessibility APIs. Selection crossfades the panels without changing the height or recentering adjacent content. No fixed content heights or clipping are used.

Solutions Services, Products, and About share `exploration-hero.module.css` for a centered introduction, readable line lengths, bounded content width, and compact vertical spacing. Horizontal tabs lead into a visual on the left and selected explanation and CTA on the right. Smaller screens stack these in reading order. Products artwork scales from its available column width with a square gate and a reserved control area. Short viewports may scroll instead of compressing the gate. Services artwork follows the same width-based sizing approach, preserving its aspect ratio. About uses naturally sized story cards with larger desktop spacing. Text stays in natural document flow without fixed content heights; none of these heroes is compressed to fit a short viewport. All three tab sets use roving focus with Left/Right and Home/End keys. About's story and summary reserve responsive space for every option. The Solutions navigation groups Services and Products before About.
