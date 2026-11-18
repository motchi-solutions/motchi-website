# Motchi Solutions

One Next.js application for Motchi Solutions (MS), with Motchi Websites (MW) and Motchi Consulting (MC) as specialist service branches. Products presents approved products in development, with their actual availability.

## Development

Use Node 26.12.1 from `.nvmrc` and npm 11 or newer. Run everything from this directory:

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

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

Tests come in two layers. `npm test` runs the unit tests in `tests/` (Node's test runner): contact model and validation, configuration, metadata, security headers, email templates and token checks, and repository rules such as ASCII-only copy. `npm run test:e2e` runs the Playwright suite in `e2e/` against the installed Google Chrome, on a desktop and a phone profile: page smoke checks, navigation, the Consulting, Websites, Products and About interactions, the full contact journey, axe accessibility scans (WCAG 2.2 AA), sideways-scroll and text-size checks from 320px to 2560px, touch-target size, and motion with and without reduced motion. Locally it reuses `npm run dev` on port 3000 (or `E2E_PORT`); in CI it builds and serves production. Run the whole suite in CI or with `CI=1` before a release: development mode adds Next's own overlay and skips the service worker. Contact submissions are intercepted in the tests, so no mail is sent.

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

The header links to Websites, Consulting, Products, About and Contact. The Websites and Consulting pages add a right-edge section navigator, and the full portfolio is linked from Websites. The header identity follows the current branch; its logo always returns to the company homepage. `/services` and `/businesses` redirect permanently to the homepage service overview (`/#businesses`).

The branded intro plays once per visit and shows MS, MW or MC according to the first page loaded. Client navigation updates the header identity without replaying it.

Marketing pages render on the server; interactive navigation, motion and forms use client components. Client components import from `ui/primitives.tsx` or the specific module, never the `ui/index.ts` barrel, which includes server-only shell code. Keep branch compositions distinct while reusing controls and tokens.

Style new components with Tailwind utilities and the theme tokens in `src/styles/tokens.css`; use a CSS module only for what utilities cannot express cleanly. Tailwind's `hover:` variant is limited to fine pointers in `src/app/globals.css`, so touch taps never leave a hover state. Tabs share `ui/use-tabs.ts` (roving focus, arrow keys, Home and End) and question lists share `ui/disclosure.tsx`; both render on the server and fall back to fully expanded content without JavaScript. Navigation and sitemap route lists live in `src/lib/config/navigation.ts`; site identity and the default origin live in `sites.ts`. Search engines may index the site only on the production origin when `ALLOW_INDEXING=true`; otherwise every page carries noindex and robots.txt keeps crawlers out, while link-preview fetchers (`linkPreviewAgents` in `src/app/robots.ts`) can still read pages so shared links show a card. Robots rules are not access control.

The [local application diagram](docs/diagrams/application.html) shows the browser, server, external services (Brevo, Google Workspace, Dynadot, Vercel), trust boundaries, the numbered contact/email path, and CI. Open the self-contained HTML in a browser; it makes no network requests. Keep it aligned with the contact components and server handlers when those boundaries change.

## Domain

The site is served at `https://www.motchi.ca`, the canonical origin in `src/lib/config/sites.ts`. Vercel's domain settings redirect `motchi.ca` permanently to it, keeping the path and query, so links to either host land on the same page. DNS is managed at Dynadot: the apex A record and the `www` CNAME point to Vercel; MX, SPF, DKIM and DMARC records serve Google Workspace and Brevo.

Every absolute URL derives from that origin: `metadataBase`, canonical links, Open Graph and X images (`opengraph-image.tsx` for the company, Websites and Consulting), the sitemap and robots, JSON-LD, and links and images in contact emails. A link shared as `motchi.ca` or `www.motchi.ca` therefore shows the same preview. The contact API accepts only POSTs whose Origin is this origin, and Turnstile tokens must report the `www.motchi.ca` hostname, so the Turnstile widget's hostname list includes it. Production leaves `SOLUTIONS_URL` unset. Host redirects live only in Vercel; a host rule in `next.config.ts` could loop against them.

## Environment and contact

`.env.example` is the reference for every variable: a table of where each one belongs (local, Vercel Production, Vercel Preview), then a local section to copy into `.env.local` and the production values to set in Vercel. Previews need no variables; the contact form there shows its email fallback. Never commit filled environment files. `SOLUTIONS_URL` optionally overrides the site origin for alternate local ports or staging. Use an origin without a path, credentials, query or fragment. Production requires HTTPS and rejects loopback addresses. Restart development after environment changes; statically rendered URLs require rebuilding too.

`BREVO_API_KEY`, `CONTACT_FROM_EMAIL` (verified sender), and `CONTACT_TO_EMAIL` configure transactional email. Production also requires a stable `CONTACT_FORM_SECRET` of at least 32 characters. Development can use a temporary process-wide signing key. Missing configuration shows an email fallback rather than claiming delivery.

Bot protection and rate limits (`src/lib/security`): a honeypot field, a signed form token with a minimum fill time, Cloudflare Turnstile (`TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`; a Managed widget shown only when Cloudflare asks for interaction, verified server-side), and fixed-window limits per IP (5 per 10 minutes, 20 per day), per email (3 per hour, shared by plus-tag variants), and site-wide (40 per hour, 110 per day: two emails per enquiry keep this site within 220 of the Brevo account's 300 free daily emails, leaving room for the other Motchi sites on the account). The email and site-wide limits count only submissions that passed Turnstile. Limits live in Upstash Redis when `KV_REST_API_URL`/`KV_REST_API_TOKEN` (added by the Vercel Marketplace integration) or `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` are set, otherwise in server memory; keys are HMAC-scrambled. The contact page checks Brevo, Turnstile and the form secret before rendering (`prepareContactForm`), so a misconfigured site shows the email fallback from the first step; `configuration` and `unavailable` results lock sending for the visit. Results are distinct statuses in `src/lib/email/feedback.ts`: `invalid`, `verification`, `expired`, `limited` (with minutes to wait), `busy`, `failed` (definitely not sent; safe to retry), `unavailable` (delivery unknown; email instead), and `configuration`. Server-side failures return a short reference that matches the server log. Contact requires a Node server, not static export. Build/runtime origins must agree because POSTs accept only the configured origin. In development, leave `SOLUTIONS_URL` unset (or set it to `http://localhost:3000`); pointing it at production makes local submissions fail the origin check, which the server logs as a warning.

Visitor statistics use Vercel Web Analytics (`src/lib/config/analytics.ts`). It loads only on Vercel Production deployments (`VERCEL_ENV`), so development, tests and previews send nothing; enable Web Analytics for the project in the Vercel dashboard. Page URLs are sent without query strings or fragments.

The free first call is set in `firstCall` in `src/lib/config/sites.ts`. Paste the Google Calendar appointment schedule booking link into `url` to show the "Book a free call" hero button and the Contact page link; while it is empty they stay hidden. It is a plain external link, so the CSP needs no change.

### Enquiry retention

The privacy policy promises that enquiries that don't become projects are deleted from the inbox and calendar within 12 months of the last exchange. A Google Apps Script does this outside the app. [`scripts/google/enquiry-retention.gs`](scripts/google/enquiry-retention.gs) is the versioned copy: edit it there, then paste it into the Apps Script project "Motchi Enquiries Retention", which runs in the Google Workspace account that receives enquiries and owns the booking calendar.

- Gmail labels: `Enquiries` (applied by filters) and `Clients` (applied by hand to any thread with someone who becomes a client; it protects their threads and bookings).
- Gmail filters, each set to apply the `Enquiries` label, never send to Spam, and include existing conversations:
  - `subject:("new enquiry - Motchi" OR "received your enquiry - Motchi" OR "your Motchi Solutions enquiry" OR "your Motchi Websites enquiry" OR "your Motchi Consulting enquiry")`: form notifications and replies to them or to the acknowledgement. It names this site's exact subjects so enquiries sent to other companies are not caught; keep it identical to `enquirySubject` in the script and to the subjects in `src/lib/email/templates.ts`.
  - `from:calendar-notification@google.com subject:"Free 30-Minute Intro Call"`: booking notifications.
  - Enquiries sent straight to the inbox with another subject get the label by hand.
- Apps Script settings: V8 runtime, time zone America/Toronto, Google Calendar API advanced service (identifier `Calendar`), a daily time-driven trigger for `cleanupOldEnquiries` with immediate failure notifications.
- `reportOnly: true` emails what would be deleted; `false` moves threads to Gmail Trash and deletes bookings without notifying guests (both trashes empty after 30 days). `previewAll`, run by hand, lists everything unprotected regardless of age, to confirm labels and filters. `bookingTitle` must match the appointment schedule's title exactly.

Keep the script, filters, and the privacy policy's retention section in step when any of them changes.

The four-step wizard lives in `src/components/ui/contact`; `contact-config.ts` owns choices, questions and topic aliases. `ContactPageContent` supplies signed tokens and results. The wizard requires JavaScript and offers direct email without it. Draft saving is opt-in and expires after three days. Preserve the full optional message for editing; validate its 2,000-character limit on blur/navigation. Failed requests retain answers; confirmed or partial delivery clears saved drafts. Mock email in UI/CI tests and use controlled inboxes for real delivery checks.

Project records live in `src/content/websites/projects.json`. Server-rendered pages and `GET /api/projects` share the async `getProjects()` data boundary; replace its file read to use a database.

Websites and Consulting reuse the wizard's service questions in their enquiry sections. Continue carries only allowlisted service choices in the URL and opens Contact at step two; personal contact details never belong in these links. The main form's first step explicitly asks Websites or Consulting; branch links preselect that choice. The selected type controls services and project questions, stays in the saved draft and review, and determines submission routing.

Edit approved project, service and process records in `src/content/websites` and `src/content/consulting`; company products live directly in `src/content`. Use actual image dimensions, useful alt text, approved URLs and original SVG marks. Next discovers icons, manifests and social images through app file conventions.

See [DEPENDENCIES.md](docs/DEPENDENCIES.md) for the direct inventory, [AUDIT.md](docs/AUDIT.md) for maintenance concerns, [AGENTS.md](AGENTS.md) for persistent agent constraints, [AGENT_SECURITY.md](docs/AGENT_SECURITY.md) for mandatory third-party executable review, [CONTRIBUTING.md](CONTRIBUTING.md) for contribution access and [SECURITY.md](SECURITY.md) for vulnerability reporting. The [license](LICENSE) applies to the repository.
