# Maintenance audit

## Code and system boundaries

- One Next.js application owns company and service routes in src/app. Keep reusable controls, styles and server utilities separate from branch-specific page composition without introducing workspace/package indirection.
- Keep navigation, real route lists, canonical metadata and sitemap coverage aligned when adding pages. Indexing is currently blocked; review that policy before publication.
- Project media has one owner in public/media/projects. Update the typed records in src/content/websites with actual dimensions and approved content.

## Design, accessibility, and performance

- Approved content, real project media and the MS/MW/MC identities are the source of truth. Work, pricing, capabilities and approach pages serve different purposes; preserve their distinct compositions and shared controls.
- Use shared semantic tokens and original SVG marks. Solutions' compact spacing and dark/feature surfaces live in its app styles; one element should own each gap. Keep gold text on appropriately dark surfaces, with burgundy/charcoal for text on light surfaces.
- Maintain native semantics, visible keyboard focus, readable selected/hover states, minimum comfortable targets and reduced-motion alternatives. The guided contact form requires JavaScript; its email alternative must remain visible without it.
- Seven-stage process headings wrap tightly around 1024px. Review the breakpoint/composition if refining tablet layouts.
- Screen-reader/VoiceOver, forced-colors, physical mobile devices, 200% text and 400% browser zoom need dedicated manual review. Automated tests and viewport emulation do not establish accessibility conformance.
- Keep marketing server-rendered and state in small client islands. Preserve image dimensions, lazy loading, native media controls and reduced-motion checks. Avoid adding an animation framework for small interactions. Fonts are self-hosted by Next after build-time retrieval; allow the required network access in clean builds.
- No bundle-size, Lighthouse or field Core Web Vitals improvement is assumed. Measure before optimizing. No analytics tracker is installed; keep privacy copy consistent if adding one.

## Security and contact reliability

- Trusted environment access and delivery remain server-only. Keep keys, submitted messages and raw provider responses out of logs and public error output. Same-origin checks must use validated configuration rather than arbitrary Host or forwarding headers.
- Contact protection includes authoritative validation, duplicate-field rejection, a 24KB body limit, signed tokens, a honeypot, and bounded rate/replay records. Process-memory records reset on restart and are not shared between instances. Add hosting edge limits before exposing email publicly; durable shared storage/queues are appropriate when volume or reliability requires them.
- Provider timeouts can leave delivery uncertain. Never promise exactly-once delivery or retry automatically without durable coordination. Partial acknowledgement failure must still confirm that the enquiry arrived and discourage resubmission. Verify real Brevo sender authentication, reply-to, notification and acknowledgement behavior using controlled inboxes.
- The shared CSP permits inline scripts/styles for current Next rendering. A stricter nonce policy requires request-specific nonces and compatible dynamic rendering; test hydration/navigation before enforcing it. Keep HTTPS, body limits, timeout limits and least-privilege environment access in hosting configuration. Review every subdomain before HSTS includeSubDomains/preload.
- Review actual privacy/retention practices, approved product status, asset permissions and monitored security reporting before publication. Do not invent legal facts or product availability. Robots/noindex is not authentication.

## Tooling

Use the locked toolchain and configured CI checks. Keep dependency purposes, runtime constraints and advisory findings in [DEPENDENCIES.md](DEPENDENCIES.md).
