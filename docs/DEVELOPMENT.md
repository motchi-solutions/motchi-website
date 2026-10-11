# Development

Use Node 24 and npm 11+. Work from the repository root. Install with `npm ci` for a fresh clone, or `npm install` after changing manifests. The root lockfile is authoritative. Do not create per-app lockfiles. Dependency versions for Next/React are pinned; review framework/tool upgrades together.

## Commands

| Command | Result |
| --- | --- |
| `npm run dev:solutions` | Solutions on port 3000 |
| `npm run dev:websites` | Websites on port 3001 |
| `npm run dev:consulting` | Consulting on port 3002 |
| `npm run lint` | Biome formatting, import organization, recommended React/Next/accessibility checks |
| `npm run format` | Format files; do not treat as a security check |
| `npm run typecheck` | Generate Next route types and check strict TypeScript for all apps |
| `npm test` | Node-native pure utility and mocked contact submission tests |
| `npm run build` | Build all apps sequentially |
| `npm run build --workspace=@motchi/solutions` | Build one app |

Biome replaces the ESLint dependency chain discussed during setup. It is a supported create-next-app option, but its checks are not an exact equivalent to every Next ESLint rule. Type checking and production builds remain separate gates. No warning is resolved by hiding an audit finding. Re-run `npm audit` after dependency updates; do not use `--force` without reviewing resulting major changes.

## Changes

Keep reusable elements in `packages/ui/src`; keep business copy in its app. Default to Server Components. Add `"use client"` only for real interaction; native details/menu and form submission need none. Keep the shared UI barrel server-side because it exports the server contact component.

Products: edit `apps/solutions/src/content/products.ts`. Available records require a URL; planned records cannot accidentally link to a launch. Confirm scope/status before publishing.

Projects: edit `apps/websites/src/content/projects.ts`. A record supports title, industry, services, description, URL, multiple image records, optional technologies, and featured flag. The homepage renders the first image; additional records can support a future project page. Use local images in `public/work/`, with real dimensions and useful alt text. Validate URLs and approval; null means no invented outbound link.

Environment files belong in each app directory, not only the repository root. Never check in values. If switching a port/domain, update scripts, family config, metadata, tests, and contact origin policy together.

## Verification

CI runs lint, typecheck, tests, and all builds. Tests mock Brevo and require no credentials. Expected failure-path logs contain only branch and a short opaque reference. For real email tests, use a dedicated Brevo setup and inboxes you control.

Manual browser QA is required: 320/375/768/1024/1440+ widths, keyboard, zoom, reduced motion, and JavaScript disabled. Add Playwright later if useful: install `@playwright/test` as a root dev dependency, install selected browser binaries, then test each running app's navigation, no-JS form, validation, and provider failure paths. Do not include a real Brevo key in ordinary browser CI.
