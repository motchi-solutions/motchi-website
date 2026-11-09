# Motchi Solutions

One Next.js application for Motchi Solutions (MS), with Motchi Websites (MW) and Motchi Consulting (MC) as specialist service branches. Products presents approved products in development, with their actual availability.

## Development

Use Node 26.12.1 from `.nvmrc` and npm 11 or newer. Run everything from this directory:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. No workspace commands or feature flags are required.

```bash
npm run build
npm start
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run format:check
```

`build` creates one production application. `start` serves that build. Prettier formats source (`npm run format`); Biome lints it. CI runs the same checks. After reviewed dependency changes, update the single lockfile with `npm install`, then run `npm run dependencies:inventory`.

Tests come in two layers. `npm test` runs the unit tests in `tests/` (Node's test runner): contact model and validation, configuration, metadata, security headers, email templates and token checks, and repository rules such as ASCII-only copy. `npm run test:e2e` runs the Playwright suite in `e2e/` against the installed Google Chrome, on a desktop and a phone profile: page smoke checks, navigation, the Consulting, Websites, Products and About interactions, the full contact journey, axe accessibility scans (WCAG 2.2 AA), sideways-scroll and text-size checks from 320px to 2560px, touch-target size, and motion with and without reduced motion. Locally it reuses `npm run dev` on port 3000 (or `E2E_PORT`); in CI it builds and serves production. Contact submissions are intercepted in the tests, so no mail is sent.

## Routes and source

- Company: `/`, `/products`, `/about`, `/contact`, `/privacy`
- Websites: `/websites` combines selected work, services, pricing, process, FAQs and the enquiry. Pricing buttons scroll to the enquiry with their tier selected. `/websites/work` contains the full portfolio.
- Consulting: `/consulting` combines services, how we work, what clients can expect, FAQs and the enquiry. Service anchors such as `/consulting#databricks` open that service, and each service links to Contact with its matching option preselected.

| Location           | Purpose                                                                  |
| ------------------ | ------------------------------------------------------------------------ |
| `src/app`          | App Router pages, layouts, metadata and contact API                      |
| `src/components`   | Company and branch composition, with reusable controls in `ui`           |
| `src/content`      | Approved services, processes, projects and product content               |
| `src/lib`          | Brand identity, configuration, validation and server-only email handling |
| `src/styles`       | Shared brand, responsive typography and interaction tokens               |
| `public`           | Original logos, portfolio media, product artwork and icons               |
| `tests`, `scripts` | Node-native behavior tests and dependency inventory generation           |

The single header links to Websites, Consulting, Products, About and Contact. The Websites and Consulting pages use an animated right-edge section navigator instead of dropdowns. The full portfolio is linked from Websites. The header identity follows the current branch; its logo always returns to the company homepage. The retired `/services` and `/businesses` URLs permanently redirect to the homepage service overview (`/#businesses`).

The initial family intro selects MS, MW or MC once from the initial pathname. Client navigation updates the header identity without replaying the intro.

Marketing pages render on the server; interactive navigation, motion and forms use client components. Client components import from `ui/primitives.tsx` or the specific module, never the `ui/index.ts` barrel, which includes server-only shell code. Keep branch compositions distinct while reusing controls and tokens.

Style new components with Tailwind utilities and the theme tokens in `src/styles/tokens.css`; use a CSS module only for what utilities cannot express cleanly. Tailwind's `hover:` variant is limited to fine pointers in `src/app/globals.css`, so touch taps never leave a hover state. Tabs share `ui/use-tabs.ts` (roving focus, arrow keys, Home and End) and question lists share `ui/disclosure.tsx`; both render on the server and fall back to fully expanded content without JavaScript. Navigation and sitemap route lists live in `src/lib/config/navigation.ts`; site identity and the default origin live in `sites.ts`. The site currently blocks indexing until publication is intended; robots rules are not access control.

The [local application diagram](docs/diagrams/application.html) shows server/client boundaries and the contact/email path. Open the self-contained HTML in a browser; it makes no network requests. Keep it aligned with the contact components and server handlers when those boundaries change.

## Environment and contact

Copy `.env.example` to `.env.local` at the root. Never commit filled environment files. `SOLUTIONS_URL` optionally overrides the site origin for alternate local ports or staging. Use an origin without a path, credentials, query or fragment. Production requires HTTPS and rejects loopback addresses. Restart development after environment changes; statically rendered URLs require rebuilding too.

`BREVO_API_KEY`, `CONTACT_FROM_EMAIL` (verified sender), and `CONTACT_TO_EMAIL` configure transactional email. Production also requires a stable `CONTACT_FORM_SECRET` of at least 32 characters. Development can use a temporary process-wide signing key. Missing configuration shows an email fallback rather than claiming delivery. Contact requires a Node server, not static export. Build/runtime origins must agree because POSTs accept only the configured origin.

The four-step wizard lives in `src/components/ui/contact`; `contact-config.ts` owns choices, questions and topic aliases. `ContactPageContent` supplies signed tokens and results. The wizard requires JavaScript and offers direct email without it. Draft saving is opt-in and expires after three days. Preserve the full optional message for editing; validate its 2,000-character limit on blur/navigation. Failed requests retain answers; confirmed or partial delivery clears saved drafts. Mock email in UI/CI tests and use controlled inboxes for real delivery checks.

Project records live in `src/content/websites/projects.json`. Server-rendered pages and `GET /api/projects` share the async `getProjects()` data boundary; replace its file read when adopting a database.

Websites and Consulting reuse the wizard's service questions in their enquiry sections. Continue carries only allowlisted service choices in the URL and opens Contact at step two; personal contact details never belong in these links. The main form's first step explicitly asks Websites or Consulting; branch links preselect that choice. The selected type controls services and project questions, stays in the saved draft and review, and determines submission routing.

Edit approved project, service and process records in `src/content/websites` and `src/content/consulting`; company products live directly in `src/content`. Use actual image dimensions, useful alt text, approved URLs and original SVG marks. Next discovers icons, manifests and social images through app file conventions.

See [DEPENDENCIES.md](docs/DEPENDENCIES.md) for the direct inventory, [AUDIT.md](docs/AUDIT.md) for maintenance concerns, [AGENTS.md](AGENTS.md) for persistent agent constraints, [AGENT_SECURITY.md](docs/AGENT_SECURITY.md) for mandatory third-party executable review, [CONTRIBUTING.md](CONTRIBUTING.md) for contribution access and [SECURITY.md](SECURITY.md) for vulnerability reporting. The existing [license](LICENSE) applies.
