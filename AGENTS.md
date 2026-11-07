# Agent instructions

## Third-Party Skills and Executables

Before executing any third-party skill script, CLI, browser automation, copied executable code, install script, or binary, read and follow [docs/AGENT_SECURITY.md](docs/AGENT_SECURITY.md). This policy is mandatory for all agent work in this repository.

Reading a skill's instructions does not authorize executing its bundled code. If a tool requests unrelated permissions, unexplained network access, credential access, broad filesystem access, or public publishing, stop the executable and continue only with safe instruction-only guidance unless explicitly authorized.

## External skill and network-call policy

- **Authorization first:** Never automatically invoke network-capable skills, plugins, tools, scripts, CLIs, or helpers. This covers web/API/network requests, uploads, downloads, telemetry, and browser automation reaching external sites, including remote subresources and redirects. Local instruction reading is allowed; it does not authorize executable or external-call paths.
- **Task-scoped permission:** Require explicit user authorization in the current task, or explicit approval after explaining the need. A clear request to search the web, call an API, inspect an online service, download an external resource, or use an online-connected skill authorizes only the access necessary for that purpose. Installation, available credentials, and unrelated past tasks do not grant permission. Preserve authorization already given within the current task; do not ask again for the same authorized access.
- **Unapproved access:** Prefer a local path. If external access is necessary but not clearly authorized, explain why it is needed, the destination, and the data involved; ask for permission and do not make the call while approval is pending. Do not silently broaden an approved destination, purpose, payload, or operation.
- **Mandatory pre-call review:** Use `security-audit` in focused/guidance mode. Before any external web/API/network call through a skill, plugin, tool, or executable, identify the skill/tool and helper, necessity, expected destination/service, and data leaving the local environment. Inspect the installed source/version, required external-call dependencies, and network path. Check current known security advisories affecting those components and determine applicability to the installed versions and intended operation. Keep enough internal evidence to justify the decision; one call does not require a full repository audit.
- **Vulnerability block:** Do not use the external-call path if a known relevant, unmitigated vulnerability affects the installed skill, required executable helper, required external-call dependency, or communication path. Stop and report it; do not bypass the issue merely to finish the task. A historical issue fixed in the installed version does not automatically block use.
- **No recursive approval bypass:** Start with local source/version/advisory metadata. External advisory research itself requires current-task authorization; otherwise ask before researching. Never make an unapproved call to decide whether another call is safe. If the necessary advisory evidence cannot be obtained safely, report the pre-call review as incomplete and do not run the intended path.
- **Minimum data:** For approved calls, send only the minimum necessary data. Never send secrets, `.env` values, credentials, or tokens, or include them in reports. Do not upload private source code unless explicitly requested. Customer/private infrastructure data requires explicit necessity and approval. Public publishing requires a separate explicit request; never enable it or telemetry implicitly.
- **Existing safeguards remain:** This gate supplements [docs/AGENT_SECURITY.md](docs/AGENT_SECURITY.md), including executable/dependency review, OS permissions, secret handling, browser isolation, and Stack Diagram restrictions. Authorization does not waive security review or the vulnerability block. Inspect only the relevant skill, helper, dependencies, communication path, and advisory information; stay in guidance mode unless full-audit scope is warranted under Security review.

## Quotes and punctuation

- Use straight ASCII apostrophes and single quotes (`'`), never curly apostrophes or single quotes.
- Use straight ASCII double quotes (`"`), never curly double quotes or guillemets.
- Use ASCII equivalents for similar typographic punctuation: hyphens (`-`) instead of en or em dashes, and three periods (`...`) instead of the ellipsis character.
- Apply this rule to text you write or edit, including UI copy, documentation, comments, commit messages, and responses about this repo.
- Preserve characters when required for accurate source quotations, external data, or functional code behavior.

## Interactive controls

- Every enabled clickable control, including native checkboxes/radios and their labels, must show a pointer cursor. Preserve text cursors for editable fields and unavailable cursors for disabled controls.
- Every enabled selectable control needs intentional rest, hover, pressed, selected, keyboard-focus, and disabled states. Use native controls and existing Motchi components/tokens before introducing a new treatment.
- Keep text/icon contrast readable in every state, preserve comfortable hit targets (normally at least 44px for buttons and clickable option labels), and do not make static content look selectable.
- Keep hover subtle: a small surface/border/color change, 300ms ease-in-out using the shared --motion-hover and --ease-hover tokens. Never use `transition: all`, change dimensions/border thickness, or introduce layout shift on hover.
- Apply pointer hover treatments within `@media (hover: hover) and (pointer: fine)`. Touch and keyboard users must be able to understand and operate the control without hover.
- Preserve selected state during hover and after pointer exit. Use native checked state or `aria-selected`, `aria-pressed`, or `aria-current` as appropriate; communicate selection beyond color. Do not replace selected fills with an unselected hover treatment.
- Provide one immediate, persistent, high-contrast `:focus-visible` indicator. Prefer a 2px solid outline with spacing from the control, sufficient contrast, and forced-colors support. For a native input inside a selectable label/card, suppress its separate outline only when the whole card supplies an equally visible replacement.
- Press feedback should respond immediately through `:active`, with short feedback around 80-120ms where a transition is useful. Do not lock out input while animations finish.
- Exclude disabled and `aria-disabled="true"` controls from interactive hover/press effects, and explain unavailable actions where needed. Respect `prefers-reduced-motion`; remove decorative movement and use immediate state changes when appropriate.
- Verify actual styles in the browser: inactive/selected hover, pointer exit, keyboard focus, disabled state, touch emulation, and reduced motion. Watch selector specificity so later selected styles do not accidentally erase hover feedback.

- Disclosures and expandable sections must open and close smoothly with interruptible 300ms ease-in-out motion; keep collapsed controls out of keyboard navigation, preserve answers, expose expanded state, and respect reduced motion. Do not animate focus indicators or delay input. Avoid abrupt interactive changes; choose restrained feedback rather than adding decorative movement everywhere.
- Apply the 300ms ease-in-out link contract to underline pseudo-elements and arrow icons as well as link text. Brand lockups are identity elements: preserve their home link and keyboard focus, but do not add ordinary text-link hover underlines to their brand name.
- Render logos from original vector assets at their intended CSS dimensions. Avoid rasterizing filters/transforms on brand marks; inspect monitor sizes, browser zoom, and pixel density before changing artwork.

- Selectable cards use the shared selection tokens: warm #F1DFC2 surface, gold border, charcoal text, and restrained burgundy check/number/disclosure accents. Avoid thick edge stripes and heavy outlines. Keep selection recognizable through native checkmarks or disclosure indicators, with keyboard focus visually distinct from selection.

- Validate compound fields as one logical group. Moving between their inputs must not trigger missing-part errors. Defer incomplete optional groups until the user tries to continue; validate malformed entered values on group blur, keep errors stable while editing, and clear them after valid blur. Use concise field-specific error text.

- Reuse the shared InfoTip for supplementary field help. Use labeled buttons outside form labels, support hover/focus/tap and Escape/outside dismissal, allow hovering the help bubble, honor reduced motion, and constrain/reposition help within the viewport. Keep essential instructions and validation messages visible.
- Native Popover API: prefer core `popover="auto"` or `popover="manual"` only when they simplify behavior without reducing accessibility or browser reliability. Treat `popover="hint"` as progressive enhancement, with a fallback for essential content and interactions.
- Before replacing InfoTip or another overlay, verify current Chrome, Firefox, Edge, Safari, and mobile Safari support. Preserve keyboard/touch access, accessible names, focus, positioning, and essential help without hover; retain the existing component if native behavior regresses these.

## Dependency inventory

- Whenever dependencies are added, removed, or updated, refresh `docs/DEPENDENCIES.md` immediately using `npm run dependencies:inventory`. Resolve any discrepancy between the inventory and the current dependency manifests or lockfile as soon as it is found, and report any issue that prevents the inventory or audit from being refreshed.

## Consistency across service branches

- Apply shared design-system changes across Motchi Solutions, Motchi Websites, and Motchi Consulting. This includes responsive behavior, container widths, typography scaling, button format, hover/selected/focus colors and behavior, motion, and overall theme rules. Do not leave these changes on only one branch unless the user explicitly limits their scope.
- Implement shared patterns in src/styles or src/components/ui where practical, using one source of truth rather than copying app-specific overrides. Equivalent controls should follow the same interaction and responsive contracts on all service branches.
- The four-step Contact wizard lives in src/components/ui/contact. Keep page layout, controls, review, counter, drafts, validation, and motion shared; customize each site's services and questions through contact-config.ts. Preserve over-limit messages for editing, validate the 2,000-character limit on blur or navigation, and place the counter below the textarea.
- Use the shared ContactResultPanel for confirmed submission results and future result states. Show a reference ID only when the backend provides one, keep success copy truthful for partial delivery, and respect reduced motion. Keep the message counter outside the textarea so it cannot overlap text or its resize handle.
- Preserve intentional brand identities and content. Apply shared rules through existing semantic brand tokens; do not duplicate site-specific features or force unrelated page layouts to match.
- Check all service branches after a shared change: relevant desktop and mobile sizes, large monitor sizes, zoom/text resizing, keyboard focus, hover/selected states, and reduced motion as applicable. Report which checks actually ran.
- An explicit user instruction limiting a task to one website takes precedence over this cross-site consistency rule. Existing authorization to update all branches is sufficient; do not ask for confirmation again.
- Keep help icons immediately beside field names, grouped with their labels but outside the clickable label itself. Preserve the bubble position until its closing transition completes.
- Mark required inputs with the shared RequiredMark and include RequiredNotice at the start of the form/step. Do not rely on red alone: retain native required semantics and screen-reader text. Leave optional field labels unmarked. Placeholders may provide nonessential format examples, never replace labels or essential instructions, and should not merely repeat a field name.

## Interface copy

- Use courteous wording for form instructions, such as "Please select..." or "We recommend...". Describe services as help we can offer rather than orders to the user.
- Keep copy friendly, clean, concise, and actionable across all service branches. Say what the user can do in familiar language, using consistent names for fields, options, and actions.
- State selection rules explicitly: say "Select all" for multiple choices and "Choose one" for a single choice. Explain what the choices are for and offer a clear path when users are unsure.
- Use short, polite validation messages such as "Please enter your name." Keep detailed guidance near the relevant field or in supplementary help rather than repeating it in errors or summaries.
- Place inline validation after the field label/legend and any visible helper text, before the input or option list. Apply this order to text fields, selects, textareas, and compound fields across all service branches; preserve aria-describedby associations.
- Filter clearly invalid characters using the shared field-specific contact-input handlers, including paste/autofill and composition completion. Preserve international names, normal punctuation/numbers in free-text descriptions, caret position, and incomplete values while typing. Never replace server validation with input filtering.
- Show new validation errors on blur or an attempt to continue/submit. Once an error is visible, refresh it while the user edits or autofills, and clear it immediately when valid, including in the focused field. Do not show a new error again until blur or continue/submit.

## Typography at native zoom

- Use the shared reading, UI, and form-option tokens in src/styles/responsive.css across all service branches. Keep body text steady through laptop widths; grow gradually above 1536px with bounded rem-based values.
- Treat 100% browser zoom as the default composition. Do not use CSS zoom, shrink the root font size, or scale whole sections to compensate for oversized typography.
- Selection labels stay subordinate to their question headings. Use --form-option-size, preserve comfortable hit targets, and avoid local viewport formulas that compete with the shared scale.
- Check reflow and text enlargement separately; never prevent browser zoom. Use the viewport coverage in Visual Design Quality Gate.

## Design skills

- Installed skill purposes, modes, provenance, executable helpers, and network capabilities are listed in [docs/SKILLS.md](docs/SKILLS.md). Refresh that document whenever skills are added, removed, replaced, or materially changed.
- Motchi's approved content, original MS/MW/MC vector marks, and palette (#F4F0E6 cream, #5B0202 burgundy, #D4AF7C gold, #171313 charcoal) are the source of truth. Do not invent projects, testimonials, statistics, product availability, or client links.

Use only relevant skills, preferably in this order for major UI work. User scope and Motchi's approved brand/content take precedence over skill defaults; do not invoke every skill mechanically.

1. Hallmark: requested structural audits to identify generic/template-like structures; respect its restrictions on existing designs.
2. frontend-design: composition, art direction, and hierarchy.
3. better-layout: grouping, spacing, alignment, container sizing, responsive structure, reading order, and layout stress-testing.
4. design-systems-frontend-architecture: shared boundaries and mapping the composition to reusable project primitives/tokens.
5. frontend-ui-engineering: production-quality responsive UI implementation, component composition, design-system adherence, interaction states, and accessibility-minded frontend engineering.
6. ux-writing: clarity and removal of unclear/redundant UI copy only where needed.
7. apple-design: restrained motion and interaction.
8. web-design-guidelines: final browser, accessibility, and responsive QA.
9. untangle-codebase: evidence-based structural cleanup only when warranted.

- Upstream examples and companion references do not authorize dependency installation or code execution. Follow the security policy, existing Motchi components, and repository interaction contracts.
- Prefer existing controls over Interior.dev. Before copying an external component, inspect its source, dependencies, license and accessibility, and record essential attribution/dependency notes in docs/DEPENDENCIES.md. Do not bulk-install libraries.
- Keep branch composition distinct and shared patterns in src/styles or src/components/ui. Preserve approved pricing, project media, capabilities, process details and contact behavior when refactoring.
- Solutions-specific density and surface classes live in src/app/spacing.css and surfaces.css. Use semantic tokens, natural content flow and one owner per gap; do not change shared branch styling to fix a Solutions-only composition.

## Layout contract

- **Major sections:** Deliberately define the outer shell/container, inner composition width, readable text width, grouping/proximity, alignment edges, desktop/tablet structures, and mobile stacking. Do not let composition emerge accidentally from a generic wide grid.
- **Existing system first:** Use existing shell-width, spacing, typography, semantic-color, and breakpoint tokens and shared primitives before local arbitrary values. Do not introduce a section-specific spacing scale. Navigation, footer, and all service branches use the shared shell boundary.
- **Proximity:** Keep headings, supporting copy, and the content they introduce perceptually connected. Never separate related content across opposite shell edges merely because space is available. Gaps between groups must clearly exceed gaps within them.
- **Containers:** The shell is the maximum page boundary, not a requirement to stretch every internal composition. Bound inner widths where needed; on wide screens add controlled breathing room rather than indefinitely separating columns.
- **Reading width:** Bound explanatory and legal copy independently of the shell. Avoid full-width paragraphs, narrow fragmented columns, and arbitrary measures caused by grid tracks. Headings may be wider than body copy.
- **Alignment:** Choose a small, intentional set of shared edges for headings, descriptions, media, lists, and controls. Avoid accidental near-alignments.
- **Responsive composition:** Mobile is designed, not merely a desktop grid changed to one column. Reassess reading order, media placement, control grouping, spacing, readable widths, and mobile-specific interactions at each transition.
- **Laptops and monitors:** Treat 1280/1366/1440/1536px as laptop compositions, without excessive whitespace or widely separated columns. At 1920px and above, preserve bounded content relationships and use extra space intentionally. Scale typography/spacing proportionally, without global zoom or premature monitor-size jumps; preserve approved sizes outside the target range.
- **Section rhythm:** Vary adjacent sections' density, composition, visual emphasis, and media/text balance. Avoid repeating heading-copy-three-card layouts. Shared design rules do not require identical section layouts.
- **Grouping and cards:** Group with whitespace first, surfaces/backgrounds second, separator lines last. Do not use borders everywhere. Cards suit genuinely bounded, selectable, or comparable units; consider lists, editorial groups, timelines, split compositions, or media-led layouts otherwise.
- **Hierarchy:** Give each major section one primary focal point; headings, descriptions, metadata, images, labels, and controls must not have equal weight. Let real content and project media carry emphasis; avoid excessive eyebrows, arbitrary gradients, floating decorative cards, and large undifferentiated rectangles.
- **Interaction:** Define rest, hover, pressed, focus, selected/open, disabled where applicable, and reduced-motion states using the Interactive controls contract. Interaction supports hierarchy rather than compensating for weak layout.

### Section build workflow

For significant new or redesigned sections:

1. Identify the section's job.
2. Establish the content hierarchy.
3. Choose the outer container.
4. Choose internal composition and readable widths.
5. Define alignment and grouping.
6. Define desktop, tablet, and mobile compositions.
7. Define interaction states where applicable.
8. Implement with existing tokens and components.
9. Render and inspect in the browser where supported.
10. Refine at least once if the result remains generic, awkward, or poorly grouped.

## Visual Design Quality Gate

- Compilation alone is insufficient. For significant layout work, actual browser/render review is required when the environment supports it, at native 100% zoom. If unavailable, state that explicitly; never claim visual verification without rendering.
- Inspect representative sizes: 375, 430, 768, 1024, 1280 or 1366, 1440, and 1920px at minimum. Include 1536px laptops, 2560px monitors, and smaller supported phones where relevant. Check grouping, whitespace, text wrapping, alignment, overflow, hierarchy, interaction states, focus, touch behavior, reduced motion, and separate zoom/text resizing. Report checks actually run.
- Recommended pricing needs deliberate hierarchy, CTA emphasis, and restrained depth rather than only a different background. A technically correct but visually weak page is unfinished.

## Repository hygiene

- Do not commit, push, or deploy unless explicitly asked.
- Mock contact delivery in UI/CI tests; do not send real mail as routine QA.
- Keep setup and architecture in README.md, dependency information in docs/DEPENDENCIES.md, the skill inventory in docs/SKILLS.md, and meaningful findings/debt in docs/AUDIT.md. Keep persistent agent constraints here. Do not add task reports, decision logs, parity checklists or migration runbooks.
- Before keeping documentation, ask whether a developer will need it six months from now to understand, run, maintain or safely change the project. Merge durable information into the existing documents.

## Security review

- Use the repository-local [security-audit](.agents/skills/security-audit/SKILL.md) for security-sensitive work, third-party skills, and external-call helpers. Default to focused/guidance review of the relevant changes; do not automatically run the full workflow, scanners, or audit artifact generation.
- Focused review applies to authentication/authorization, APIs/server actions, contact forms, uploads, payments, webhooks, database access, secrets, sessions/tokens, CORS/CSP/security headers, infrastructure/network exposure, MCP endpoints, and important dependency/security changes. Normal styling, copy, layout, and low-risk UI changes do not require a full audit.
- Reserve full audits for explicit user requests, pre-production/pre-launch reviews, major releases, major auth/backend/infrastructure changes, security incidents, or significant trust-boundary changes. The upstream `quick` full-audit profile is not the focused default.
- Classify review findings as `confirmed`, `needs validation`, `informational`, or `rejected`. Verify exploitability, trust boundaries, existing validation, framework protections, prerequisites, and impact before reporting a vulnerability; keep informational hardening advice separate from vulnerability claims. Do not assign vulnerability severity to an unvalidated hypothesis.
- Never expose secrets in reports or upload source code, findings, credentials, or architecture information externally without explicit authorization. Apply the stricter data-minimization and authorization gate in External skill and network-call policy. Do not probe deployed endpoints or shared infrastructure merely to validate a claim.
- Third-party scanners and executable helpers remain subject to [docs/AGENT_SECURITY.md](docs/AGENT_SECURITY.md). Review source, license, network/filesystem access, subprocesses, and credential/environment access before execution. Do not run unexpected external scanners or grant unrelated OS permissions.
- During security review, suspicious, untrusted, or target-controlled code requires OS-enforced isolation: no external network or credentials, an explicitly allowlisted environment, read-only source/toolchain, scratch-only writes, and resource/time limits. If those controls are unavailable, stay read-only, mark the behavior as needing validation, and provide a safe validation plan.
- Keep documentation minimal: no one-off audit reports or setup docs. Record only durable findings in an existing `docs/AUDIT.md`; do not create it merely to record an invocation.
- The installed security-audit source, version, license, and helper capabilities are recorded in [docs/SKILLS.md](docs/SKILLS.md). Installation or instruction reading does not authorize running bundled validators/tests; their temporary writes and Node/`mkfifo` subprocesses require review and isolation.

### Stack-specific focus (when present)

- **Web/API/Next.js:** server/client boundaries, route handlers/server actions, XSS, CSRF/same-origin assumptions, SSRF, open redirects, client-side secret leaks, contact/email abuse, rate limiting, CSP/security headers, and dependency advisories.
- **Java/Spring:** Spring Security, `@PreAuthorize`, exposed controllers/MCP endpoints, SQL/query construction, SSRF, CORS, Actuator, secrets, and dependency advisories.
- **Terraform/cloud:** IAM, public exposure, security groups, secret handling, encryption, public buckets/databases, and least privilege.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
