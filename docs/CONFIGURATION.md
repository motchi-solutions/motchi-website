# Configuration

Environment variables describe a deployment or hold a secret. They are not a CMS. Public facts and ordinary marketing content remain typed, reviewed source files.

## Authoritative sources

| Kind                      | Location                               | Examples                                                                                               |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Application configuration | `packages/config/src/sites.ts`         | Branch names, production/local origins, public contact email, organization location and service region |
| Navigation                | `packages/config/src/navigation.ts`    | Shared desktop/mobile labels, routes, intentional anchors, sitemap route lists                         |
| Brand identity            | `packages/brand/src/`                  | Palette, fonts, motion/spacing tokens, approved logos and media types                                  |
| Business content          | Each app's `src/content/`              | Processes, capabilities, services, projects, product status                                            |
| Deployment configuration  | `packages/config/src/env.ts`           | Site-origin overrides, email sender/inbox                                                              |
| Secrets                   | App environment, read only by `env.ts` | Brevo API key and form-signing secret                                                                  |

Project URLs belong in Websites' typed project records. Empty social-link placeholders and hypothetical feature flags have not been added. Product status stays in source; unfinished products are not presented as launched. No legal entity name beyond the supplied display name is invented.

## Environment files

The tracked root `.env.example` is the template. Copy it to **each app's** `.env.local`, since Next loads from the app directory. Filled `.env` files are ignored; never commit them. Deployment platforms should provide the same variables at build and runtime. Static metadata and rendered links reflect build-time resolution; native contact handlers read runtime configuration.

| Variable              | Requirement                          | Purpose                                      |
| --------------------- | ------------------------------------ | -------------------------------------------- |
| `SOLUTIONS_URL`       | Optional                             | Override the Solutions origin                |
| `WEBSITES_URL`        | Optional                             | Override the Websites origin                 |
| `CONSULTING_URL`      | Optional                             | Override the Consulting origin               |
| `CONTACT_FROM_EMAIL`  | Required for email delivery          | Brevo-verified sender                        |
| `CONTACT_TO_EMAIL`    | Required for email delivery          | Business enquiry inbox                       |
| `BREVO_API_KEY`       | Required server secret for delivery  | Server-to-server Brevo access                |
| `CONTACT_FORM_SECRET` | Required server secret in production | Stable signing key of at least 32 characters |

There are **no `NEXT_PUBLIC_*` environment variables**. Browser code needs only rendered links and nonsecret identity/content props. `sites.ts` is browser-safe source configuration; `env.ts` is guarded by `server-only` and must never be imported into a Client Component. Framework `NODE_ENV` also controls development defaults and security headers; it is set by Next, not an additional user setting.

## Defaults and overrides

Development defaults:

- Solutions: `http://localhost:3000`
- Websites: `http://localhost:3001`
- Consulting: `http://localhost:3002`

Production defaults:

- Solutions: `https://motchi.ca`
- Websites: `https://websites.motchi.ca`
- Consulting: `https://consulting.motchi.ca`

Blank overrides use defaults. For alternate ports, set all three variables in each app, for example `SOLUTIONS_URL=http://localhost:3100`, `WEBSITES_URL=http://localhost:3101`, `CONSULTING_URL=http://localhost:3102`. Staging uses the same variables with its actual HTTPS origins. Origins cannot contain credentials, paths, query strings, or fragments. Production rejects HTTP and loopback/localhost origins, so acknowledgement emails cannot accidentally link to a local server.

The resolved origin drives sister-site links, canonical metadata, Open Graph, sitemaps, structured data, email footer links, and the contact endpoint's origin check. Requests from another origin are rejected. A custom local port must be configured explicitly. Noncanonical staging/local origins receive noindex metadata and disallow crawling; this is not access control.

## Validation and safe failures

`getSites()` validates URLs without requiring email configuration. Marketing pages remain usable when email is not configured. `getFormSecret()` rejects an explicitly invalid secret and requires one in production. Development alone may generate a process-wide temporary key shared by page/API bundles.

`getServerEnv()` lazily validates email sender, inbox, API key, and signing key before delivery. Configuration errors contain variable names, never values. Public pages show controlled guidance; logs identify the branch and failure category without keys, submitted messages, or raw provider payloads. A malformed site override fails clearly rather than silently sending visitors elsewhere.

The contact flow stays a native route handler: bounded body → same-origin and signed-token checks → authoritative validation → anti-abuse limits → escaped templates → Brevo → 303 result. Server Actions would not improve this tested no-JavaScript contract. Browser sending state does not validate delivery or access credentials. Failure/ambiguous delivery guidance discourages duplicate sends; partial acknowledgement failure still confirms that the enquiry was received.

`packages/email/src/validation.ts` owns contact limits, field messages, interest choices, normalization, and validation. Native form constraints use those same limits. Generic email-address syntax lives in `packages/config/src/validation.ts`, shared with environment validation. Server validation rejects duplicate input fields and validates regardless of browser constraints.

## Adding or changing settings

Change normal content in source. Add an environment variable only for a real deployment requirement or secret, then update validation, `.env.example`, this document, and focused tests together. Do not put credentials in `sites.ts`, `NEXT_PUBLIC_*`, client props, or email links. Confirm build/runtime values agree before release. Supply approved project URLs and media separately from email credentials.

## References

The environment boundary follows [Next.js environment-variable guidance](https://nextjs.org/docs/app/guides/environment-variables). Internal navigation uses [Next.js Link](https://nextjs.org/docs/app/api-reference/components/link); expandable regions follow the [WAI-ARIA disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).
