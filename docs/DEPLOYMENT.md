# Deployment

## Suggested model

Create three Next.js projects in Vercel (or another host with a supported Node.js runtime). All use the same Git repository and root npm lockfile; they deploy independently.

| Project | Root directory | Production domain |
| --- | --- | --- |
| Solutions | `apps/solutions` | `motchi.ca` |
| Websites | `apps/websites` | `websites.motchi.ca` |
| Consulting | `apps/consulting` | `consulting.motchi.ca` |

On Vercel, select the Next.js preset, use the app root, and enable source files outside the root directory so shared packages are included. Let its npm workspace detection install from the root lockfile. Confirm install logs use the single root workspace. The app build is `npm run build` in that app, not the root aggregate script. If using your own pipeline, run `npm ci` at repository root followed by `npm run build --workspace=@motchi/<branch>`.

Use Node 24, and provide `BREVO_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, and `CONTACT_FORM_SECRET` separately for each deployed app. Keep production and preview credentials/secrets distinct. Production forms only accept the configured canonical branch origin. Preview forms intentionally reject preview-origin submissions; preview the UI using direct email fallback, or deliberately extend the allowlist with a verified preview policy before enabling test submissions. Do not accept arbitrary request Host headers as the production trust boundary.

This is not a static-export deployment: contact POST handlers require a server runtime. No deployment has been performed as part of source preparation.

## Domains

Add each domain in the host dashboard, then create exactly the DNS records it supplies. Preserve existing mail records. Decide whether `www.motchi.ca` redirects to `motchi.ca`; configure a permanent redirect at the platform. Redirect HTTP to HTTPS and noncanonical hosts to the chosen host. Set HSTS at the edge after HTTPS works everywhere; only include subdomains if every affected subdomain supports HTTPS. Do not preload before reviewing that commitment.

## Launch gates

- Install from the lockfile; pass lint, typecheck, tests, and all builds.
- Check CI and deployment logs, including shared-package bundling.
- Configure edge rate limits and request body limits for each `/api/contact` endpoint. In-memory limits alone are insufficient across serverless instances.
- Verify real Brevo delivery, sender authentication, notification reply-to, visitor acknowledgement, mobile rendering, and plain-text fallback.
- Check partial failures and unavailable forms; confirm no notification reports false success.
- Review authentic logos, portfolio images/links, product status, copyright/license, final contact address, and privacy/retention details.
- Test browser responsiveness, keyboard, zoom, contrast, reduced motion, and no-JavaScript functionality.
- Check canonicals, sitemap, robots, structured data, social cards, favicons, HTTPS, redirects, security headers, and CSP console violations.
- Keep staging/preview private or noindexed at the hosting layer. Current robots/sitemaps describe production; they are not preview access controls.
- Record a rollback procedure and restore the previous successful deployment if contact or navigation fails.

## Operations

Monitor form/provider failures without logging personal input or secrets. Review Brevo delivery events and sender reputation, especially as acknowledgement volume grows. A durable queue/shared rate limiter is the next infrastructure step if volume or reliability requires it. Establish a real data-retention policy and review the included privacy notice against actual operations.
