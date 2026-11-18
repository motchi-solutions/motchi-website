# Third-Party Skill and Executable Security Policy

Third-party skills, plugins, copied components, scripts, CLIs, browser automation, and agent tooling must never be assumed safe merely because they are installed or referenced by this repository.

## Instruction-only content

Plain-text files such as:

- `SKILL.md`
- Markdown references
- design guidance
- prompt documentation

may be read without executing bundled code.

Reading documentation does NOT authorize execution of scripts included with the same skill.

## Before executing third-party code

Before running any executable supplied by or referenced through a third-party skill, including:

- Python
- JavaScript
- TypeScript
- shell scripts
- binaries
- downloaded CLIs
- Playwright/Chromium automation
- preinstall/postinstall scripts
- generated shell commands
- copied executable components with new dependencies

perform a security review first.

Identify:

1. exact executable/file
2. source repository/provider
3. version or commit when available
4. files/directories read and written
5. network access
6. expected network destinations
7. subprocess/browser usage
8. environment-variable or credential access
9. upload/publication behavior
10. new dependencies

## Security checks

Before execution:

- inspect source code
- inspect package manifests
- inspect install scripts
- inspect new dependencies
- check for unexpected obfuscated/minified code
- check for suspicious shell execution
- check for credential harvesting
- check for broad filesystem access
- check for persistence/startup changes
- check for unexplained telemetry
- check for uploads or public publishing
- run available dependency/security audit tooling where appropriate

Do not bypass a security warning merely to complete the task.

## Least privilege

Use only the permissions required for the current task.

Do NOT grant access to unrelated resources such as:

- Apple Music
- Contacts
- Photos
- Calendar
- Messages
- unrelated application data
- browser profiles
- password stores/keychains
- Full Disk Access

unless the task explicitly and legitimately requires that access.

If macOS or another operating system requests an unrelated permission:

1. deny it
2. identify which process triggered it
3. review the process before proceeding

## Network access

Network access must be limited to destinations genuinely required by the tool.

Examples:

- downloading official public vendor logos for a diagram may be allowed
- public publishing is NOT automatically allowed

Do NOT automatically permit:

- source-code upload
- diagram publishing
- repository upload
- public galleries
- telemetry containing project data
- sending prompts or infrastructure details externally

Optional public sharing/publishing features must remain disabled unless explicitly requested by the user.

## Repository and secret protection

Never expose:

- `.env` values
- API keys
- access tokens
- certificates
- deployment credentials
- GitHub credentials
- cloud credentials
- customer information
- private infrastructure details

to third-party services unless explicitly authorized and necessary.

Architecture diagrams containing private infrastructure remain local by default.

## Dependency installation

Before adding a package or CLI:

- confirm it is necessary
- inspect its repository/package
- review install scripts
- prefer controlled/pinned versions where appropriate
- avoid unnecessary global installation
- document meaningful direct dependencies in existing dependency documentation

Do not create separate documentation for every tool invocation.

## Generated/copied code

Code copied from external sources, including UI component libraries, becomes repository code only after review.

Before retaining it:

- inspect the source
- verify dependencies
- review accessibility/security implications
- remove unused behavior
- adapt it to project conventions
- run normal lint/typecheck/tests/build/security checks

## Skills with bundled scripts

A skill may contain both:

- safe instructions
- executable helpers

Permission to use the skill means permission to READ the instructions.

It does NOT automatically authorize executing every bundled helper.

Only execute a bundled helper after determining that it is necessary and reasonably safe.

## When uncertain

STOP execution if a tool:

- requests unrelated OS permissions
- contacts unexplained hosts
- accesses credentials unexpectedly
- attempts public publishing
- executes unexplained subprocesses
- contains suspicious/unclear behavior

Continue using instruction-only guidance where possible.

Do not weaken operating-system or repository security settings to make a skill work.

## After execution

After third-party tooling runs:

- review changed files
- review added dependencies
- inspect generated artifacts
- verify no secrets were added
- verify no unwanted background processes/configuration were introduced
- run dependency/security checks where applicable
- run lint/typecheck/tests/build as relevant

Security review should be proportional to the tool's capabilities, but third-party executable code must never be treated as automatically trusted.

### Stack Diagram

For `caru-ini/stack-diagram`:

Allowed after review:

- Read its instructions.
- Local Python execution.
- Public logo retrieval from expected logo sources.
- Local Playwright/Chromium rendering without weakening browser or OS security.
- Local HTML/PNG/React generation when useful.

Not allowed without explicit user authorization:

- Public gallery publishing, including `stacks.caru.moe`.
- Authentication to its gallery service.
- Uploading diagrams or repository/infrastructure data.
- Unexpected network destinations.

Generated architecture information remains local by default. The gallery path is disabled for this repository; do not run `share.py` or offer publishing as a routine next step. During diagram generation, network access is limited to required public logo retrieval from reviewed sources. Do not send project prompts or metadata to logo services.

Before the first run, inspect installed instructions, scripts, dependency declarations, logo destinations/redirects, browser flags, and output paths. Confirm publishing is opt-in and unused. Repeat the review after skill updates. Prefer the network-free `build.py` with reviewed local assets. The reviewed `render_png.py` passes `--no-sandbox`; do not run that helper unchanged. Use a local renderer with browser sandboxing enabled and external requests blocked instead.
