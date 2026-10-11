# Security engineering

## Secrets and dependencies

Environment values are server-only. `@motchi/email` imports `server-only` to prevent accidental client use. `.env*` is ignored except the empty example. Never log a key or submitted contact data. Rotate leaked keys and inspect history; deleting a current file is not sufficient. Enable secret scanning and push protection on the public repository.

Use the root lockfile, npm CI, Dependabot, and reviewed updates. `npm audit fix --force` can downgrade or introduce incompatible dependencies. Biome replaced the setup's vulnerable ESLint toolchain; re-audit installed packages to verify current status rather than assuming that zero findings persist. Install scripts are not blanket-approved. Review a specific script and need before changing npm's policy.

## HTTP defaults

Shared Next configuration supplies CSP, `nosniff`, frame denial, referrer policy, and permissions policy. CSP restricts resources and native forms to the current origin, prohibits objects and framing, and upgrades insecure requests in production. Brevo calls are server-to-server and do not need browser `connect-src` permission. Development adds eval/WebSocket support required by the tooling.

The baseline permits inline scripts because statically generated Next hydration uses them, and inline styles for framework rendering. This is a deliberate limitation, not a strict XSS-resistant CSP. The structured-data payload contains controlled business data and escapes less-than signs before insertion. To use a strict nonce policy, add request-specific nonces in the current Next proxy mechanism, propagate the nonce to rendering, and accept dynamic rendering for affected routes; follow the official Next CSP guidance and test navigation/hydration before enforcement. Hash-based policies must track build-specific framework scripts.

At hosting: configure HTTPS redirects, HSTS after domain review, preview privacy/indexing controls, trusted proxy behavior, edge contact rate limits, body limits, timeout limits, and least-privilege environment access. Do not set HSTS includeSubDomains/preload without checking every subdomain.

## Contact protection

Input lengths, control characters, email structure, controlled interest values, and http(s) website URLs are validated server-side. Website values are never fetched. Body reading is bounded to 24KB even without Content-Length. Same-origin POST, signed short-lived tokens, a honeypot, elapsed time, bounded email/global limits, and local replay tracking provide a baseline.

Limitations: records are in process memory and reset across instances/restarts; signed tokens can be harvested; arbitrary-email acknowledgements can be abused; provider timeout outcomes may be ambiguous. Set edge limits before launch. For greater volume, add shared durable rate/replay storage and delivery queuing. Do not claim exactly-once delivery or reliable automatic retry.

No personal form values are included in redirect URLs. Error output is controlled; HTML email values are escaped. Native navigation opens outbound links in the same tab. If adding `_blank`, use `rel="noopener noreferrer"`.

## Disclosure

See root SECURITY.md for the private reporting route. Confirm the monitored address and enable GitHub private vulnerability reporting before public launch. Do not use public issues for exploitable details or credentials.
