# Project context: Motchi website

Read this with [AGENTS.md](AGENTS.md) before every task. This file holds the rules that apply only to this project.

## Project

- Public website for Motchi Solutions and its two service branches, Motchi Websites (`/websites`) and Motchi Consulting (`/consulting`). Live at `https://www.motchi.ca`.
- Next.js 16 App Router, React 19, TypeScript 7, Tailwind CSS 4, Biome (lint), Prettier (format), Playwright + axe (browser tests). Node 26 (`.nvmrc`).
- Hosted on Vercel. Contact form sends mail through Brevo and is protected by Turnstile. Vercel Web Analytics runs on Production only.
- Branch model: develop flow. `develop` deploys to Preview, `main` to Production.

## Commands

| Task                | Command                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Install             | `npm ci`                                                                                                         |
| Dev server          | `npm run dev`                                                                                                    |
| Lint / format check | `npm run lint`, `npm run format:check`                                                                           |
| Type check          | `npm run typecheck`                                                                                              |
| Unit tests          | `npm test`                                                                                                       |
| Browser tests       | `npm run test:e2e`                                                                                               |
| Build               | `npm run build`                                                                                                  |
| Dependency tracker  | `npm run dependencies:inventory` (this repo's own generator; it also needs a Purpose entry for each new package) |

## Project-specific rules

- Third-party executables and skill helpers follow [docs/AGENT_SECURITY.md](docs/AGENT_SECURITY.md), which is stricter than AGENTS.md. Read it before running any of them.
- The skill tracker is the hand-written [docs/SKILLS.md](docs/SKILLS.md). Update it by hand when skills change.
- Environment variables used here include `BREVO_API_KEY`, `CONTACT_FORM_SECRET`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` and `SOLUTIONS_URL`. Follow the secrets rules in AGENTS.md. Check that config works through app behavior, such as the contact form showing "Send enquiry" rather than its fallback.
- `.claude/settings.json` denies Claude Code access to secret files, and `.gitignore` ignores them. Keep both lists in step.
- Mock contact delivery in UI and CI tests. Never send real mail as routine QA.
- Inbound links from client sites use `utm_source=<client>&utm_medium=referral&utm_campaign=client-footer`. `src/lib/config/analytics.ts` strips all query strings before sending page views, so these tags are not counted yet. To track them, allow the `utm_*` keys through there and update the privacy policy.
- Keep findings and debt in [docs/AUDIT.md](docs/AUDIT.md).

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

- Selected and open states use the shared active tokens in src/styles/tokens.css (--active, --active-foreground, --active-detail, --active-hover, --active-tint, --active-tint-strong). Selected tabs, options, and selectable cards take a burgundy #5B0202 fill with cream text and gold #D4AF7C details; open disclosures become a raised light surface with a burgundy title and a filled burgundy indicator; unselected controls use subtle 5-11% burgundy tints for hover and press. Do not use pale tan or other low-contrast tints that barely differ from the cream page as the selected state. Avoid thick edge stripes and heavy outlines. Keep selection recognizable beyond color through native checkmarks, arrows, or disclosure indicators, with keyboard focus visually distinct from selection.

- Validate compound fields as one logical group. Moving between their inputs must not trigger missing-part errors. Defer incomplete optional groups until the user tries to continue; validate malformed entered values on group blur, keep errors stable while editing, and clear them after valid blur. Use concise field-specific error text.

- Reuse the shared InfoTip for supplementary field help. Use labeled buttons outside form labels, support hover/focus/tap and Escape/outside dismissal, allow hovering the help bubble, honor reduced motion, and constrain/reposition help within the viewport. Keep essential instructions and validation messages visible.
- Native Popover API: prefer core `popover="auto"` or `popover="manual"` only when they simplify behavior without reducing accessibility or browser reliability. Treat `popover="hint"` as progressive enhancement, with a fallback for essential content and interactions.
- Before replacing InfoTip or another overlay, verify current Chrome, Firefox, Edge, Safari, and mobile Safari support. Preserve keyboard/touch access, accessible names, focus, positioning, and essential help without hover; retain the existing component if native behavior regresses these.

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

## Domain and canonical host

- The canonical origin is `https://www.motchi.ca`, set once in `src/lib/config/sites.ts`. Vercel's domain settings permanently redirect `motchi.ca` to it, keeping the path and query.
- Anything domain-specific uses the www origin: canonical links, `metadataBase`, Open Graph and X images, the sitemap and robots, JSON-LD, email links and images, the contact form's origin check, Turnstile's hostname check, test fixtures, and examples in documentation. Derive URLs from `getSites()` or `sites.ts`; never hard-code a host in components or content.
- Keep host redirects in Vercel's domain settings only. A host rule in `next.config.ts` could loop against them.
- Email addresses stay `@motchi.ca`. Plain-text mentions of the site in prose may say "motchi.ca", because the apex redirects.
- When the domain changes, update `sites.ts`, Vercel's domains, the Turnstile widget's hostnames and Brevo's sender settings together, then run the unit tests and the SEO browser tests.

## Interface copy

- Use courteous wording for form instructions, such as "Please select..." or "We recommend...". Describe services as help we can offer rather than orders to the user.
- Use sentence case for headings, buttons, links, navigation and page titles; capitalize only proper nouns (Motchi and its branch names, product names, AI, Databricks, places). Service and tier names that the contact form sends as values (contact-config.ts) and consulting capability names keep their title case as named offerings. Headings take no end period, except a headline made of two short phrases ("Technology advice. Hands-on support."); questions keep their question mark. Short uppercase eyebrows come from CSS text-transform, never typed capitals.
- Keep copy friendly, clean, concise, and actionable across all service branches. Say what the user can do in familiar language, using consistent names for fields, options, and actions.
- State selection rules explicitly: say "Select all" for multiple choices and "Choose one" for a single choice. Explain what the choices are for and offer a clear path when users are unsure.
- Use short, polite validation messages such as "Please enter your name." Keep detailed guidance near the relevant field or in supplementary help rather than repeating it in errors or summaries.
- Place inline validation after the field label/legend and any visible helper text, before the input or option list. Apply this order to text fields, selects, textareas, and compound fields across all service branches; preserve aria-describedby associations.
- Filter clearly invalid characters using the shared field-specific contact-input handlers, including paste/autofill and composition completion. Preserve international names, normal punctuation/numbers in free-text descriptions, caret position, and incomplete values while typing. Never replace server validation with input filtering.
- Show new validation errors for entered values on blur, and for missing required answers only when the user tries to continue/submit. Never flag an untouched field because focus passed through it, a link scrolled to the form, or the page loaded. Once an error is visible, refresh it while the user edits or autofills, and clear it immediately when valid, including in the focused field. Do not show a new error again until blur or continue/submit.
- Keep Continue and Submit buttons enabled. Do not disable them until required fields are filled or hide the reason in a tooltip; on activation, show the errors inline and move focus to the first field that needs attention or to an error summary that links to it.

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
6. modern-web-guidance: native browser API, modern CSS, forms, accessibility, and fallback choices where a platform decision is involved.
7. ux-writing: clarity and removal of unclear/redundant UI copy only where needed.
8. apple-design: restrained motion and interaction.
9. unslop: final anti-generic visual critique and polish.
10. web-design-guidelines: final browser, accessibility, and responsive QA.
11. untangle-codebase: evidence-based structural cleanup only when warranted.

- **Modern Web Guidance:** Use only for relevant web-platform questions, through targeted `search` then `retrieve` with the local `.agents/skills/modern-web-guidance/mwg` wrapper; never `npx`/`pnpx modern-web-guidance` or bulk-loading guides. It does not override Next.js docs, Motchi design rules, or verified browser support. The wrapper keeps telemetry disabled and is offline; stop and ask if it ever attempts network access.
- **Unslop:** Use primarily as a final critique/polish pass (its polish mode). Findings do not authorize redesigning approved sections. Preserve Motchi's brand, typography direction, content, palette, and design system; do not adopt its tokens or type where they conflict. Live-site `snapshot.mjs`, story/video generation, image generation, publishing, and external-image workflows need explicit current-task authorization.
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
