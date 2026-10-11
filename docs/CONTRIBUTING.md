# Contributing

Use short focused branches from main (for example `feat/websites-work` or `fix/contact-validation`). Describe the business problem and final behavior in the pull request; include actual verification and note incomplete browser/provider checks.

Use concise imperative commits. Avoid secrets, generated Next output, dependency folders, and per-app lockfiles. Update the root lockfile with reviewed manifest changes. Respect the existing license until an explicit repository-wide decision is made.

Before requesting review: lint, typecheck, tests, and production builds. Test visual changes with keyboard, narrow layouts, reduced motion, and JavaScript disabled. New contact/provider changes need tests for meaningful failure paths and must not send mail in CI. New content must not fabricate clients, quotes, metrics, or approvals. Document new environment variables and deployment responsibilities.

The root CONTRIBUTING.md points here. Review GitHub templates and settings in GITHUB_SETUP.md. Maintainers should configure real CODEOWNERS handles before enabling mandatory ownership reviews; a sample is supplied without inventing an account.
