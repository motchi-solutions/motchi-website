# Brand system

The Motchi family shares a foundation: gold `#D4AF7C`, burgundy `#5B0202`, cream `#F4F0E6`, and charcoal `#171313`. The approved MS/MW/MC monograms are supplied SVG assets. Do not construct replacement monograms in CSS, text, or SVG.

## Identity and visual rhythm

Solutions is the neutral company identity: an accessible cream foundation and a connected path from understanding the business to Websites, Consulting, Products, and continued support. The path is functional navigation, not a fake technical diagram. Websites uses lighter surfaces and alternating editorial project presentations. Consulting is more restrained, with a burgundy opening, problem-led capability rows, and a connected implementation lifecycle.

Use gold for selected paths, indicators, and approved artwork. Use burgundy/charcoal for reading text on cream; gold on cream is not suitable for small text. Branch colour balance comes from `data-branch` overrides in `packages/brand/src/tokens.css`. Components use semantic tokens (`primary`, `secondary`, `accent`, `background`, `foreground`, `muted`, `border`, `surface`, `inverse`) rather than hardcoded colours.

Project presentation treatments are Motchi family colours, not claims about a client's approved visual identity. Project data can supply approved background/foreground overrides later. Verify their contrast before publication.

## Typography and spacing

Source Sans 3 is the reading and technical face. Source Serif 4 is an occasional italic editorial accent. They are open-source fonts loaded centrally through `next/font/google` in `packages/ui/src/fonts.ts`. All app layouts attach the shared font variables. Next self-hosts the resulting fonts; browsers do not call Google Fonts. Font retrieval requires build-time network access. Arial/Georgia remain fallbacks. Serif preload is disabled because it is an accent, not the main reading face.

Fluid hero type ranges from 2.625rem to 5.5rem; section headings from 2rem to 3.5rem. Reading and shell widths remain 42rem and 80rem. Gutters and spacing expand with the screen. Mobile heroes use smaller top/bottom padding and compact supporting graphics; portfolio previews stay before project descriptions on mobile.

### Spacing contract

Use proximity to show relationships. The shared tokens define 16px from eyebrow to heading, 16-24px from a major heading to its description, 28-40px from an introduction to section content, and 24px before an action. Card groups use 20-32px gaps; interactive Services and Products previews use a tighter 20px rhythm. Small card headings and their supporting copy can use the existing 12-16px scale. Major section padding and portfolio separation remain larger so topic changes are clear.

`SectionHeading` owns the following content gap. For split compositions, use `section-layout` and `section-introduction`: the parent owns the row gap, so do not add another bottom margin to its introduction. Use `section-cards` for peer cards, `content-action` for an action after copy, and `section-action` for an action after a content group. Do not retain invisible hints or inactive descriptions solely to reserve space between an introduction and its content. The hero's stable detail area is an intentional interaction exception.

## Shared motion

The token system defines `--motion-fast` (140ms), `--motion-base` (240ms), `--motion-slow` (750ms), `--motion-intro` (2600ms), `--ease-standard`, and `--ease-emphasized`. Use these for changes in colour, underline, arrows, media, and entrances; do not add arbitrary durations across branches.

`Section` wraps a shared server-rendered `Reveal`. HTML is visible initially. A single `MotionEnhancements` observer marks only offscreen blocks pending, reveals them on entry, and reveals focused content together with its ancestors. No-JavaScript or unsupported observers leave content visible. The reduced-motion override disables all animations/transitions, clears pending visual states, and stops smooth scrolling. Do not animate every paragraph.

The full-screen entry shows all three approved identities, emphasizes and centres the current branch, then expands it into a radial reveal of the server-rendered page. It uses `intro.css`, lasts 2.6 seconds, and immediately yields to pointer, keyboard, wheel, or scroll input. Reduced motion skips it. Each new document or reload plays it; root-layout persistence prevents replay during same-app navigation. There is no playback storage record. CSS ends the overlay independently of hydration. No monograms are recreated.

## Editorial rules

Use Title Case for navigation, page and section titles, capabilities, feature names, buttons, and short labels. Keep articles, short prepositions, and conjunctions lowercase within a title; preserve acronyms and proper brand names. Body paragraphs, feedback, validation errors, and longer explanatory sentences use sentence case. Do not apply CSS `capitalize` to prose or user input.

## Type and spacing tokens

`display` is the large homepage headline; `h1` is the inner-page headline; `h2` and `h3` handle section and feature hierarchy. `body-lg`, `body`, `small`, `eyebrow`, `button`, and `caption` cover reading and UI roles. The older `hero`/`section` sizes remain token aliases. Source Sans 3 provides variable weights and a readable x-height; Source Serif 4 adds restrained editorial contrast. Both use Latin subsets for current English content. Add the necessary subsets when adding another language, rather than implying every script is loaded today.

Use Tailwind's regular four-pixel spacing scale. `py-hero` ranges 3-6rem, `py-content` 3-5rem, and `py-section` 3.5-6.5rem. Hero-to-content spacing is tighter than major topic transitions. Reading columns remain narrow; portfolios use wider image compositions. The fine architectural grid belongs only on selected hero/approach surfaces; it is not a background for every section.

## Media assets

See [MEDIA_ASSETS.md](MEDIA_ASSETS.md) for exact logo, intro, screenshot, client-logo, and optional animation locations, dimensions, and typed configuration examples. Approved assets are configured without changing page structure.

## Family identity and approved assets

The master wordmark is MOTCHI, followed by a visually secondary, readable branch name. Header and footer branch labels all use burgundy text and the same thin gold left separator. The header combines the supplied monogram with this text; homepage heroes explicitly identify the branch. Solutions uses a connected toolkit with restrained geometric personality; Websites and Consulting retain their quieter treatments.

SVG is the canonical logo format. Every app contains `ms-logo.svg`, `mw-logo.svg`, and `mc-logo.svg` in `public/brand/`. The single configuration lives in `packages/brand/src/index.ts`. Local copies support the shared family intro without cross-origin asset dependencies. Preserve the approved artwork.

## Navigation and route motion

Solutions navigation consistently leads to pages: Home, Services, Products, About, and Contact. Homepage branch previews remain useful shortcuts and use the approved logos. Capability hover/focus highlights a tool; clicking or activating its button reveals details.

Each app uses a server-rendered route template for a brief content entrance. The shared branded loading fallback appears only while Next is actually loading a route, with a short visual delay to avoid flashes on quick visits. There is no artificial navigation delay or minimum display time; the fallback disappears as soon as content is ready. Reduced motion shows static states. These changes do not extend the existing first-visit intro.

## Solutions motion refinement

The hero toolkit enters as one group instead of animating each capability box independently. Its curved connectors trace in the same brief sequence. The Solutions process allows one stage or none selected, changes only on deliberate activation, and measures the step positions so the connector stays aligned between the opaque stage rows. Reduced motion uses immediate state changes.

## Mobile controls

The toolkit retains a circular layout from 360px upward; narrower screens use a two-column list with its description first in both visual and keyboard order. Detail panels have a separate surface and spacing. A named button covers each whole process stage, including its number and summary; clicking the active stage collapses it. The native disclosure menu uses three lines, a restrained panel reveal, and a clear current-page surface, with reduced-motion alternatives.

## Shared motion policy

Controls use the fast/base tokens; menu entry uses 280ms and shared reveals use 560ms (420ms for Consulting). Entrances use shared easing, small translations, and opacity. The mobile menu is a fixed overlay with stable header height and reserved scrollbar space. It sits directly below the header, with a distinct Contact CTA. Its links enter as one group; closing the disclosure animates briefly, while navigation and Escape close promptly.

Avoid overlapping animations, animated layout dimensions, clipping reveals, and replaying completed section entrances. Reveal enhancement waits for hydration and respects changes to reduced-motion preferences. Content is visible without JavaScript. No navigation is held for an animation. See [web.dev's animation guidance](https://web.dev/articles/animations-guide).

## Responsive rhythm and affordances

Shared section padding scales from 3.5rem to 6.5rem; hero padding scales from 3rem to 6rem. Controls use a 4px corner radius; framed surfaces use 6px. Keep circular identity marks circular. Footer groups stack on phones, use two columns on tablets, and three on desktop, with 44px minimum link targets. A static capability instruction identifies the next action; selected details reveal briefly without flashing, and reduced motion suppresses the reveal.

All layouts declare `data-scroll-behavior="smooth"`, allowing Next to manage route scrolling independently of smooth in-page anchors. Anchor offsets clear the sticky header.

The entry holds the family long enough to recognise it, fades the unselected identities completely before centring the selected branch, briefly holds the centred lockup, then enlarges the monogram while the text dissolves and the radial aperture reveals the page. Total duration remains below three seconds. Solutions' process uses a quiet pointer hint above the steps until the first deliberate selection; the hint reserves its space when dismissed.

## Polish pass - 2026-10-25

Homepage wordmarks stack MOTCHI above the branch, with the same parent typography across all three sites. Keep approved monograms unchanged. Preserve Solutions' connected toolkit, Websites' authentic client imagery, and Consulting's restrained burgundy introduction.

`--space-section-heading` controls the gap after section introductions. `--space-project` controls both project separation and divider spacing. Portfolio rows allocate eight of twelve desktop columns to client media and four to the description; alternate the media side without changing the mobile reading order. Desktop screenshots are primary, with optional mobile overlap. Missing media receives a plain caption rather than fabricated artwork. Existing image/video/GIF handling remains shared.

`ContactCTA` accepts an optional `action` label alongside `title`. Use Contact Us for Solutions, Start a Project for Websites, and Start a Conversation for Consulting. Keep one dominant action in each CTA area. Consulting navigation and capability links consistently use Capabilities.

Hover/focus arrows move once through CSS and return from their current position; they never loop. Buttons give brief press feedback. The mobile menu samples its displayed opacity/transform before reversing an animation. Solutions' explorer accepts a different selection during entry instead of discarding input. Reduced motion continues to use immediate state changes.

Do not add client-side page boundaries or dependencies for visual polish. Revisit final Solutions contact layout and copy once form requirements are complete. Optional portfolio hero photography and motion previews should be added only when supplied and approved; all four current projects already have desktop/mobile screenshots and logos.

## Live interaction timing and boundaries

Read CSS duration tokens through `motionMilliseconds`; optimized styles can serialize `2600ms` as `2.6s`. JavaScript Web Animations and timers require milliseconds. Keep the intro reveal mask on the curtain, with the selected logo above it. The Solutions toolkit reserves its overview height during the outgoing zoom, then releases that minimum height as the compact detail grid enters; container width changes reset the measurement.

Copy, actions, and larger groups use `--space-copy`, `--space-action`, and `--space-layout`. Buttons use a 360ms eased hover/return and 80ms press response. Native document scrolling owns momentum and supported boundary elasticity; do not add wheel/touch interception to imitate a specific operating system. The mobile menu contains its own overscroll. Reduced motion suppresses spatial hover, press, zoom, and entry effects.

## Disclosure affordances

Hero area controls show a trailing chevron when closed and a minus when open; the open choice has a persistent selected surface and `aria-expanded`. Solutions process rows use one plain plus/minus cue, without duplicate action links, toggle circles, or a travelling highlight. The connector sits behind the rows and is visible between them. Resting controls must communicate clickability without hover. Use a stationary hitbox, native Enter/Space activation, visible focus, and pointer targeting on the control rather than its text/icon children. Button-like labels are not selectable; ordinary reading text and text links retain their usual behavior.

The hero Back to areas action follows its area list in DOM and visual order. Named container grid areas keep it adjacent to that list without a stretched top row. Keep the detail grid content-sized and top-aligned.

## Products and Services refinement - 2026-10-26

On narrow screens, product context comes before the interactive gate, and the enquiry action follows the preview. Desktop keeps the preview beside the summary/action. Render only the selected product's summary so inactive text does not reserve an oversized gap. Product names, descriptions, availability, and supplied artwork remain sourced from product content.

Gate hover is a held partial-open preview, with no indefinite breathing loop. Re-entry retargets an in-progress close immediately. Opening, closing, and peek durations share `productGateTiming`; preview visibility uses the same closing duration. A new carousel arrival refreshes the gate's pointer hit test so stationary hover remains responsive after product switching. Keyboard focus and reduced-motion behavior remain supported.

The Services explorer has an even page surface. Its previous right-weighted radial wash was removed; selected tabs and the contained service illustration retain their own meaningful styling.

## Hero selection layout and motion - 2026-10-26

When the control group stacks above its detail panel, the active choice comes first and spans the full row; the remaining four form a 2×2 grid. The keyed DOM order follows that visual order. Where the container has enough room for the narrow desktop rail and adjacent detail, keep the rail order and one-column controls stable. The CSS container query exposes `--capability-layout`, which the controller reads rather than duplicating a pixel breakpoint.

Selection changes capture the displayed positions and local widths before cancelling any previous motion. Controls move to their new positions in 340ms; local width changes preserve crisp label text. The newly selected row stays above its peers as they move. The detail copy enters as a single 220ms group, with a short measured-height adjustment when needed. There is only one detail copy in the DOM, so old text never overlaps new text. The first overview zoom retains its separate handoff.

Preserve focus on the same native button through reordering, resizing, and text-size changes. Reduced motion switches directly without spatial animation. A focused detail action immediately reveals its content and height; its ordinary hover/focus feedback remains independent. Do not lock input while motion runs.
