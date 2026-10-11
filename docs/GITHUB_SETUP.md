# GitHub and production configuration checklist

## Repository

- [ ] Confirm public visibility and review history for secrets before publishing.
- [ ] Add repository description: “Motchi Solutions: shared Next.js platform for Solutions, Websites, and Consulting.”
- [ ] Add website URL: https://motchi.ca.
- [ ] Add relevant topics: nextjs, typescript, tailwindcss, monorepo, motchi.
- [ ] Confirm license choice; existing GPLv3 has been retained.
- [ ] Review README and issue/PR templates; configure real CODEOWNERS from the example if useful.

## Main branch rules

- [ ] Require a pull request before merging.
- [ ] Require approvals (choose a workable count for the actual team).
- [ ] Dismiss stale approvals after changes.
- [ ] Require CODEOWNERS review if configured.
- [ ] Require conversation resolution.
- [ ] Require the `quality` CI status after its first run establishes the check name.
- [ ] Require branch to be up to date, or use a merge queue if appropriate.
- [ ] Block force pushes and branch deletion.
- [ ] Restrict bypass permissions; review administrator exceptions.
- [ ] Consider requiring approval of the latest push and signed commits if practical.

## Security

- [ ] Enable Dependabot alerts and security updates.
- [ ] Enable secret scanning and push protection where available.
- [ ] Enable private vulnerability reporting and confirm the reporting inbox.
- [ ] Enable code scanning/default CodeQL setup if useful/available for this repository.
- [ ] Review collaborator access, enforce account 2FA, and remove unused tokens.
- [ ] Review Actions permissions; source validation does not need deployment secrets.

## Actions

- [ ] Keep workflow permissions least privilege (`contents: read`).
- [ ] Restrict third-party Actions if desired; current CI uses official GitHub Actions.
- [ ] Review/pin action references to approved full commit SHAs where your policy requires it; current v5 major tags are mutable and Dependabot monitors them.
- [ ] Keep CI checks on pull requests and main; do not add privileged `pull_request_target` execution of untrusted source.
- [ ] Require approval for workflows from outside contributors and review token access.

## Deployments

- [ ] Create separate production projects/environments for all three apps.
- [ ] Add environment protection/reviewer rules where needed.
- [ ] Store secrets only in GitHub/Vercel/hosting environment settings.
- [ ] Never commit filled `.env` files.
- [ ] Restrict or noindex previews; configure a deliberate preview contact policy if needed.
- [ ] Configure edge rate/body limits for contact POSTs and monitor delivery failures.
- [ ] Verify rollback and backups/retention for business mail.

## Domains

- [ ] Configure motchi.ca.
- [ ] Configure websites.motchi.ca.
- [ ] Configure consulting.motchi.ca.
- [ ] Verify HTTPS on every hostname.
- [ ] Verify permanent redirects and www policy.
- [ ] Enable HSTS only after reviewing affected subdomains.

## Brevo

- [ ] Verify sender/domain.
- [ ] Configure Brevo's required DNS records, SPF/DKIM, and an appropriate DMARC policy.
- [ ] Set all four production environment variables in every app.
- [ ] Test notification and acknowledgement delivery and reply-to addresses.
- [ ] Test mobile rendering and images-disabled rendering.
- [ ] Test plain-text fallback.
- [ ] Review partial/provider failure behavior and acknowledgement abuse limits.

## Final release

- [ ] Replace/approve logo and portfolio placeholders; confirm project URLs and product status.
- [ ] Review privacy notice and implement the actual retention/access process.
- [ ] Pass CI builds and real browser accessibility/responsiveness/no-JS tests.
- [ ] Verify metadata/schema/social cards; submit sitemaps and verify search ownership.
