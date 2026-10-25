# Development

Use Node 26.12 or newer within Node 26 and npm 11+. Work from the repository root. Install with `npm ci` for a fresh clone, or `npm install` after changing manifests. The root lockfile is authoritative. Do not create per-app lockfiles. Dependency versions for Next/React are pinned; review framework/tool upgrades together.

## Commands

| Command                                       | Result                                                             |
| --------------------------------------------- | ------------------------------------------------------------------ |
| `npm run dev:solutions`                       | Solutions on port 3000                                             |
| `npm run dev:websites`                        | Websites on port 3001                                              |
| `npm run dev:consulting`                      | Consulting on port 3002                                            |
| `npm run lint`                                | Biome linting: recommended React/Next/accessibility checks         |
| `npm run format`                              | Prettier formatting; do not treat as a security check              |
| `npm run format:check`                        | Check repository formatting with Prettier                          |
| `npm run typecheck`                           | Generate Next route types and check strict TypeScript for all apps |
| `npm test`                                    | Node-native pure utility and mocked contact submission tests       |
| `npm run build`                               | Build all apps sequentially                                        |
| `npm run build --workspace=@motchi/solutions` | Build one app                                                      |

Biome replaces the ESLint dependency chain discussed during setup. It is a supported create-next-app option, but its checks are not an exact equivalent to every Next ESLint rule. Type checking and production builds remain separate gates. No warning is resolved by hiding an audit finding. Re-run `npm audit` after dependency updates; do not use `--force` without reviewing resulting major changes.

## Changes

Keep reusable elements in `packages/ui/src`; keep business copy in its app. Default to Server Components. Add `"use client"` only for real interaction; native details/menu and form submission remain usable without it. Client enhancements add Escape, focus return, scroll handling, current navigation, and motion; they do not own the core content. Keep the shared UI barrel server-side because it exports the server contact component.

Products: edit `apps/solutions/src/content/products.ts`. Available records require a URL; planned records cannot accidentally link to a launch. Confirm scope/status before publishing.

Projects: edit `apps/websites/src/content/projects.ts`. Records have a stable ID, title, industry, services, description, website/case-study URLs, optional technologies/featured metadata, treatment, approved colour overrides, and named desktop/mobile/logo/hero/motion assets. The Work page alternates layouts by sequence, not by client identity. Null URLs and missing assets remain clearly labelled placeholders. See [MEDIA_ASSETS.md](MEDIA_ASSETS.md) for locations and examples.

Environment files belong in each app directory, not only the repository root. Never check in values. If switching a port/domain, update the site URL overrides and scripts consistently; metadata and contact origin policy use the same resolved config.

## Verification

CI runs format checks, lint, typecheck, tests, and all builds. Tests mock Brevo and require no credentials. Expected failure-path logs contain only branch and a short opaque reference. For real email tests, use a dedicated Brevo setup and inboxes you control.

Manual browser QA is required: 320/375/430/768/1024/1280/1440/1920 widths, keyboard, zoom, reduced motion, and JavaScript disabled. Add Playwright later if useful: install `@playwright/test` as a root dev dependency, install selected browser binaries, then test each running app's navigation, no-JS form, validation, and provider failure paths. Do not include a real Brevo key in ordinary browser CI.

## UI and media changes

Use `AnimatedLink`, `ButtonLink`, `Reveal`, and the existing semantic tokens for repeated behavior. `AnimatedLink` supports an internal arrow separately from an external-link arrow. Import only `@motchi/ui/media` when a focused media boundary is useful; keep branch-specific composition inside the app. Do not import the main server UI barrel into a client component.

Prefer the primary `react-icons/lu` family through shared icon wrappers. `react-icons` 5.7.0 supplies the icon family. Prettier 3.9.10 is a root development dependency. Fonts use the existing Next font tooling and need no package installation. Build machines must reach Google Fonts at build time; browsers fetch self-hosted assets. For offline builds, vendor licensed font files and deliberately migrate the central module to `next/font/local`.

Use `http://localhost:3000`, `:3001`, and `:3002` for local browser review. For phone testing, use the Mac's LAN IPv4 address on the same Wi-Fi. All three Next configs allow the machine's current non-loopback IPv4 addresses in development so the HMR connection and hydration work over the LAN. Restart dev servers after changing networks. For sister-site links and contact forms, set `SOLUTIONS_URL`, `WEBSITES_URL`, and `CONSULTING_URL` to the matching LAN origins in each app's `.env.local`, then restart. This development allowlist does not broaden production contact origin checks.

## Media assets

See [MEDIA_ASSETS.md](MEDIA_ASSETS.md) before adding screenshots, logos, video, or GIF. Keep approved content, dimensions, and alt text in configuration. Do not add heavy animation/browser dependencies for routine presentation changes.

## One formatter

Prettier is the only formatter. `.prettierrc` uses standard defaults; `.prettierignore` excludes generated outputs and the npm-managed lockfile. Workspace editor settings select the Prettier extension and require repository configuration. Biome formatting and assist actions are disabled; `npm run lint` uses `biome lint`, not `biome check`. No Tailwind formatting plugin or toast dependency is required. Run `npm run format` after editing and `npm run format:check` before handing off.

## Adding pages

Add the route in its owning app, export `pageMetadata`, and update `publicRoutes` and relevant navigation in `packages/config/src/navigation.ts`. Keep homepage summaries short and link to the deeper route. Existing anchors need an identifiable heading and sticky-header offset. Verify desktop/mobile navigation, direct entry, refresh, unknown routes, metadata, and sitemap. Keep project case-study links absent until a real approved page exists.

## Configuration and processes

Read [CONFIGURATION.md](CONFIGURATION.md) before setting domains or email credentials. Local sister links default to the three local app ports; production uses published domains. Overrides are server-only and must be available at build and runtime. Restart development servers after changing environment variables.

Edit branch processes in `apps/*/src/content/process.ts`; each step has a stable ID, title, concise summary, and optional-detail bullet list. Keep basic meaning in the summary. All branches use `InteractiveSteps`. Websites service scope lives in `content/services.ts`; detailed project records can optionally supply `details` while homepage previews stay concise. Test touch/keyboard, resizing, reduced motion, and native no-JavaScript disclosure after content changes.
