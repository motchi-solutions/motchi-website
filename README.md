# Motchi Solutions

Motchi makes technology accessible to businesses through practical advice, implementation, and continued support. This npm monorepo contains three related, independently deployed Next.js App Router sites.

| App                  | Domain                       | Local URL             |
| -------------------- | ---------------------------- | --------------------- |
| `@motchi/solutions`  | https://motchi.ca            | http://localhost:3000 |
| `@motchi/websites`   | https://websites.motchi.ca   | http://localhost:3001 |
| `@motchi/consulting` | https://consulting.motchi.ca | http://localhost:3002 |

```text
apps/{solutions,websites,consulting}/
  src/app/               Pages, metadata routes, contact POST endpoint
  src/components/        Branch-specific sections
  src/content/           Typed branch content where applicable
  public/brand/          Approved logo assets
packages/
  ui/src/                Shared shell, primitives, contact/privacy content
  brand/src/             Semantic CSS tokens and family configuration
  email/src/             Server-only delivery, pure validation and templates
  config/                TypeScript base, security headers, metadata helpers
tests/                   Node-native utility and submission tests
docs/                    Maintenance and launch guidance
.github/                 CI and repository templates
```

## Local setup

Use Node 26.12 or newer within Node 26 (`.nvmrc`) and npm 11 or newer. Run commands from the repository root. For a fresh clone with the committed lockfile:

```bash
npm ci
npm run dev:solutions
```

Open another terminal for each additional app:

```bash
npm run dev:websites
npm run dev:consulting
```

When package manifests change, run `npm install` to update the single root lockfile. Do not install independently inside apps. The root `npm run dev` starts Solutions.

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run format
```

A full build builds all three apps sequentially. `npm run build --workspace=@motchi/websites` builds just that app. `npm run start --workspace=@motchi/websites` serves its completed production build on port 3001. Type checking uses lightweight Next route type generation, without compiling production assets.

## Contact configuration

Copy `.env.example` to each app's `.env.local` and fill:

- `BREVO_API_KEY`: transactional-email API key, server only.
- `CONTACT_FROM_EMAIL`: Brevo-verified sender address.
- `CONTACT_TO_EMAIL`: business inbox receiving enquiries.
- `CONTACT_FORM_SECRET`: stable secret of at least 32 characters. Generate locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.

Do not put production secrets in Git. Without email configuration, forms report unavailability and direct email remains usable. In production, an absent/short form secret disables the online form. Development has a temporary process-shared fallback secret for local preview, including separate page/API bundles. Production always requires the configured secret. Actual submissions send real email when configured: test only with addresses you control.

## Deployment

Deploy each app as a separate Next.js project sharing this repository and lockfile; Vercel is a straightforward option. Set app roots and domains independently. Provide the four server environment variables to each environment. See [Deployment](docs/DEPLOYMENT.md). No hosting or email service has been configured by this implementation.

## Content and assets awaiting approval

- Approved MS/MW/MC SVG or PNG logos: current wordmarks are ordinary text; temporary geometric favicon is not a monogram.
- Approved portfolio screenshots, image alternative text, project URLs, and confirmed service descriptions; current visuals explicitly say “Screenshot placeholder”.
- Pop Tips and Motchi Verify / MTV names, status, descriptions, and launch URLs. Current records are planned, unavailable products.
- Consulting case studies only after completion and publication permission.
- Business contact address, privacy/retention practices, final copy, and legal review.
- License choice: the existing **GPLv3** license has been preserved. Public visibility does not change its obligations. Confirm the intended license before publishing new work.

## Developer documentation

- [Architecture](docs/ARCHITECTURE.md) · [Brand system](docs/BRAND_SYSTEM.md) · [Media assets](docs/MEDIA_ASSETS.md)
- [Development](docs/DEVELOPMENT.md) · [Deployment](docs/DEPLOYMENT.md)
- [Email](docs/EMAIL.md) · [Security](docs/SECURITY.md)
- [Accessibility](docs/ACCESSIBILITY.md) · [SEO](docs/SEO.md)
- [Contributing](docs/CONTRIBUTING.md) · [GitHub setup checklist](docs/GITHUB_SETUP.md)

Read [SECURITY.md](SECURITY.md) for reporting issues. Browser review has covered the current layout and progressive enhancements; screen-reader/zoom review, final-asset media checks, full production builds, provider delivery, and DNS/HTTPS verification remain launch requirements. See the review record in docs/ACCESSIBILITY.md; utility tests alone do not establish production readiness.

Configuration and environment setup: [docs/CONFIGURATION.md](docs/CONFIGURATION.md). All app `.env.local` files use the tracked root `.env.example`; public marketing content stays in source.
