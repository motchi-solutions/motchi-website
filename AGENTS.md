# Agent instructions

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
- Use the shared shell-width token for outer containers on all three websites, including navigation and footer. Keep paragraph and legal-copy reading widths bounded independently.

- Disclosures and expandable sections must open and close smoothly with interruptible 300ms ease-in-out motion; keep collapsed controls out of keyboard navigation, preserve answers, expose expanded state, and respect reduced motion. Do not animate focus indicators or delay input. Avoid abrupt interactive changes; choose restrained feedback rather than adding decorative movement everywhere.
- Apply the 300ms ease-in-out link contract to underline pseudo-elements and arrow icons as well as link text. Brand lockups are identity elements: preserve their home link and keyboard focus, but do not add ordinary text-link hover underlines to their brand name.
- Render logos from original vector assets at their intended CSS dimensions. Avoid rasterizing filters/transforms on brand marks; inspect monitor sizes, browser zoom, and pixel density before changing artwork.

- Selectable cards use the shared selection tokens: warm #F1DFC2 surface, gold border, charcoal text, and restrained burgundy check/number/disclosure accents. Avoid thick edge stripes and heavy outlines. Keep selection recognizable through native checkmarks or disclosure indicators, with keyboard focus visually distinct from selection.

- Validate compound fields as one logical group. Moving between their inputs must not trigger missing-part errors. Defer incomplete optional groups until the user tries to continue; validate malformed entered values on group blur, keep errors stable while editing, and clear them after valid blur. Use concise field-specific error text.

- Reuse the shared InfoTip for supplementary field help. Use labeled buttons outside form labels, support hover/focus/tap and Escape/outside dismissal, allow hovering the help bubble, honor reduced motion, and constrain/reposition help within the viewport. Keep essential instructions and validation messages visible.

## Dependency inventory

- Whenever dependencies are added, removed, or updated, refresh `docs/DEPENDENCIES.md` immediately using `npm run dependencies:inventory`. Resolve any discrepancy between the inventory and the current dependency manifests or lockfile as soon as it is found, and report any issue that prevents the inventory or audit from being refreshed.

## Consistency across all three websites

- Apply shared design-system changes across Motchi Solutions, Motchi Websites, and Motchi Consulting. This includes responsive behavior, container widths, typography scaling, button format, hover/selected/focus colors and behavior, motion, and overall theme rules. Do not leave these changes on only one website unless the user explicitly limits their scope.
- Implement shared patterns in packages/brand or packages/ui where practical, using one source of truth rather than copying app-specific overrides. Equivalent controls should follow the same interaction and responsive contracts on all three sites.
- The four-step Contact wizard lives in packages/ui/src/contact. Keep page layout, controls, review, counter, drafts, validation, and motion shared; customize each site's services and questions through contact-config.ts. Preserve over-limit messages for editing, validate the 2,000-character limit on blur or navigation, and place the counter below the textarea.
- Use the shared ContactResultPanel for confirmed submission results and future result states. Show a reference ID only when the backend provides one, keep success copy truthful for partial delivery, and respect reduced motion. Keep the message counter outside the textarea so it cannot overlap text or its resize handle.
- Preserve intentional brand identities and content. Apply shared rules through existing semantic brand tokens; do not duplicate site-specific features or force unrelated page layouts to match.
- Treat laptop widths (1280/1366/1440/1536px) separately from large-monitor widths (1920px and up). Scale headings, copy, and spacing proportionally without global zoom or premature monitor-size jumps; preserve approved sizes outside the target range.
- Check all three websites after a shared change: relevant desktop and mobile sizes, large monitor sizes, zoom/text resizing, keyboard focus, hover/selected states, and reduced motion as applicable. Report which checks actually ran.
- An explicit user instruction limiting a task to one website takes precedence over this cross-site consistency rule. Existing authorization to update all three is sufficient; do not ask for confirmation again.
- Keep help icons immediately beside field names, grouped with their labels but outside the clickable label itself. Preserve the bubble position until its closing transition completes.
- Mark required inputs with the shared RequiredMark and include RequiredNotice at the start of the form/step. Do not rely on red alone: retain native required semantics and screen-reader text. Leave optional field labels unmarked. Placeholders may provide nonessential format examples, never replace labels or essential instructions, and should not merely repeat a field name.

## Interface copy

- Use courteous wording for form instructions, such as "Please select..." or "We recommend...". Describe services as help we can offer rather than orders to the user.
- Keep copy friendly, clean, concise, and actionable across all three websites. Say what the user can do in familiar language, using consistent names for fields, options, and actions.
- State selection rules explicitly: say "Select all" for multiple choices and "Choose one" for a single choice. Explain what the choices are for and offer a clear path when users are unsure.
- Use short, polite validation messages such as "Please enter your name." Keep detailed guidance near the relevant field or in supplementary help rather than repeating it in errors or summaries.
- Place inline validation after the field label/legend and any visible helper text, before the input or option list. Apply this order to text fields, selects, textareas, and compound fields across all three sites; preserve aria-describedby associations.
- Filter clearly invalid characters using the shared field-specific contact-input handlers, including paste/autofill and composition completion. Preserve international names, normal punctuation/numbers in free-text descriptions, caret position, and incomplete values while typing. Never replace server validation with input filtering.
- Show new validation errors on blur or an attempt to continue/submit. Once an error is visible, refresh it while the user edits or autofills, and clear it immediately when valid, including in the focused field. Do not show a new error again until blur or continue/submit.

## Typography at native zoom

- Use the shared reading, UI, and form-option tokens in packages/brand/src/responsive.css across all three sites. Keep body text steady through laptop widths; grow gradually above 1536px with bounded rem-based values.
- Treat 100% browser zoom as the default composition. Do not use CSS zoom, shrink the root font size, or scale whole sections to compensate for oversized typography.
- Selection labels stay subordinate to their question headings. Use --form-option-size, preserve comfortable hit targets, and avoid local viewport formulas that compete with the shared scale.
- Verify small phones, tablets, 1280/1366/1440/1536px laptops, and 1920/2560px monitors. Check reflow and text enlargement separately; never prevent browser zoom.

## Design skills

- Refer to `docs/DESIGN_SKILLS.md` for the purpose, limits, and recommended workflow for the repository design and UX skills.
