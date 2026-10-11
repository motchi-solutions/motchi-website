# Contributing

## Contribution access

For now, [**websites-admin**](https://github.com/orgs/motchi-solutions/teams/websites-admin) is the only team authorized to contribute directly. Only its members may push branches or commits to this repository and merge changes.

Everyone else may create issues, fork the repository, and submit pull requests from their forks. External pull requests require review and approval by `websites-admin` and do not grant direct repository access. Repository permissions and branch protection must enforce this policy in GitHub; this document does not change those settings.

## Workflow

Use short focused branches from main (for example `feat/websites-work` or `fix/contact-validation`). External contributors should create those branches in their forks. Describe the business problem and final behavior in the pull request; include actual verification and note incomplete browser/provider checks.

Use concise imperative commits. Avoid secrets, generated Next output, dependency folders, and per-app lockfiles. Update the root lockfile with reviewed manifest changes. Respect the existing license until an explicit repository-wide decision is made.

Before requesting review: lint, typecheck, tests, and production builds. Test visual changes with keyboard, narrow layouts, reduced motion, and JavaScript disabled. New contact/provider changes need tests for meaningful failure paths and must not send mail in CI. New content must not fabricate clients, quotes, metrics, or approvals. Document new environment variables and deployment responsibilities.

The root CONTRIBUTING.md points here. Review GitHub templates and settings in GITHUB_SETUP.md. Maintainers should configure real CODEOWNERS handles before enabling mandatory ownership reviews; a sample is supplied without inventing an account.
