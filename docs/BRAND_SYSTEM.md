# Brand system

The Motchi family shares a foundation: gold `#D4AF7C`, burgundy `#5B0202`, cream `#F4F0E6`, and charcoal `#171313`. The approved MS/MW/MC monograms will share a recognizable gold M. Do not construct replacement monograms in CSS, text, or SVG. Until supplied, the sites use ordinary Motchi wordmarks and an explicitly temporary geometric favicon.

## Identity and visual rhythm

Solutions is the neutral company identity: an accessible cream foundation and a connected path from understanding the business to Websites, Consulting, Products, and continued support. The path is functional navigation, not a fake technical diagram. Websites uses lighter surfaces and alternating editorial project presentations. Consulting is more restrained, with a burgundy opening, problem-led capability rows, and a connected implementation lifecycle.

Use gold for selected paths, indicators, and approved artwork. Use burgundy/charcoal for reading text on cream; gold on cream is not suitable for small text. Branch colour balance comes from `data-branch` overrides in `packages/brand/src/tokens.css`. Components use semantic tokens (`primary`, `secondary`, `accent`, `background`, `foreground`, `muted`, `border`, `surface`, `inverse`) rather than hardcoded colours.

Project presentation treatments are Motchi family colours, not claims about a client's approved visual identity. Project data can supply approved background/foreground overrides later. Verify their contrast before publication.

## Typography and spacing

Source Sans 3 is the reading and technical face. Source Serif 4 is an occasional italic editorial accent. They are open-source fonts loaded centrally through `next/font/google` in `packages/ui/src/fonts.ts`. All app layouts attach the shared font variables. Next self-hosts the resulting fonts; browsers do not call Google Fonts. Font retrieval requires build-time network access. Arial/Georgia remain fallbacks. Serif preload is disabled because it is an accent, not the main reading face.

Fluid hero type ranges from 2.625rem to 5.5rem; section headings from 2rem to 3.5rem. Reading and shell widths remain 42rem and 80rem. Gutters and spacing expand with the screen. Mobile heroes use smaller top/bottom padding and compact supporting graphics; portfolio previews stay before project descriptions on mobile.

## Shared motion

The token system defines `--motion-fast` (180ms), `--motion-base` (260ms), `--motion-slow` (600ms), `--motion-intro` (1600ms), `--ease-standard`, and `--ease-emphasized`. Use these for changes in colour, underline, arrows, media, and entrances; do not add arbitrary durations across branches.

`Section` wraps a shared server-rendered `Reveal`. HTML is visible initially. A single `MotionEnhancements` observer marks only offscreen blocks pending, reveals them on entry, and reveals focused content together with its ancestors. No-JavaScript or unsupported observers leave content visible. The reduced-motion override disables all animations/transitions, clears pending visual states, and stops smooth scrolling. Do not animate every paragraph.

The introduction shows all three branches, selects the current branch, and opens into the existing hero. It uses `intro.css`, no media download. It lasts at most 1.6 seconds and immediately yields to pointer, keyboard, or scroll input. Reduced motion, restricted storage, late hydration, and repeat visits skip it. Session storage is scoped to each origin and tab. Approved logo slots replace plain wordmarks; no monograms are invented.

## Editorial rules

Use Title Case for navigation, page and section titles, capabilities, feature names, buttons, and short labels. Keep articles, short prepositions, and conjunctions lowercase within a title; preserve acronyms and proper brand names. Body paragraphs, feedback, validation errors, and longer explanatory sentences use sentence case. Do not apply CSS `capitalize` to prose or user input.

## Type and spacing tokens

`display` is the large homepage headline; `h1` is the inner-page headline; `h2` and `h3` handle section and feature hierarchy. `body-lg`, `body`, `small`, `eyebrow`, `button`, and `caption` cover reading and UI roles. The older `hero`/`section` sizes remain token aliases. Source Sans 3 provides variable weights and a readable x-height; Source Serif 4 adds restrained editorial contrast. Both use Latin subsets for current English content. Add the necessary subsets when adding another language, rather than implying every script is loaded today.

Use Tailwind's regular four-pixel spacing scale. `py-hero` ranges 3–6rem, `py-content` 3–5rem, and `py-section` 4–8rem. Hero-to-content spacing is tighter than major topic transitions. Reading columns remain narrow; portfolios use wider image compositions. The fine architectural grid belongs only on selected hero/approach surfaces; it is not a background for every section.

## Media assets

See [MEDIA_ASSETS.md](MEDIA_ASSETS.md) for exact logo, intro, screenshot, client-logo, and optional animation locations, dimensions, and typed configuration examples. Approved assets are configured without changing page structure.

## Family identity and approved assets

The master wordmark is MOTCHI, followed by a visually secondary, readable branch name. The header combines the supplied monogram with this text; homepage heroes explicitly identify the branch. Solutions uses a connected toolkit with restrained geometric personality; Websites and Consulting retain their quieter treatments.

SVG is the canonical logo format. Every app contains `ms-logo.svg`, `mw-logo.svg`, and `mc-logo.svg` in `public/brand/`. The single configuration lives in `packages/brand/src/index.ts`. Local copies support the shared family intro without cross-origin asset dependencies. Preserve the approved artwork.

## Navigation and route motion

Solutions navigation consistently leads to pages: Home, Services, Products, About, and Contact. Homepage branch previews remain useful shortcuts and use the approved logos. Capability hover/focus highlights a tool; clicking or activating its button reveals details.

Each app uses a server-rendered route template for a brief content entrance. The shared branded loading fallback appears only while Next is actually loading a route, with a short visual delay to avoid flashes on quick visits. There is no artificial navigation delay or minimum display time; the fallback disappears as soon as content is ready. Reduced motion shows static states. These changes do not extend the existing first-visit intro.

## Solutions motion refinement

The hero toolkit enters as one group instead of animating each capability box independently. Its curved connectors trace in the same brief sequence. The Solutions process allows one stage or none selected, changes only on deliberate activation, and measures the step positions so its travelling marker follows both horizontal and stacked layouts. Reduced motion uses immediate state changes.

## Mobile controls

The toolkit retains a circular layout from 360px upward; narrower screens use a two-column list with its description first in both visual and keyboard order. Detail panels have a separate surface and spacing. A named button covers each whole process stage, including its number and summary; clicking the active stage collapses it. The native disclosure menu uses three lines, a restrained panel reveal, and a clear current-page surface, with reduced-motion alternatives.

## Shared motion policy

Controls use the fast/base tokens; menu entry uses 320ms and shared reveals use 480ms. Entrances use shared easing, small translations, and opacity. The mobile menu is a fixed overlay with stable header height and reserved scrollbar space. It sits directly below the header, with a distinct Contact CTA. Its links enter as one group; closing the disclosure animates briefly, while navigation and Escape close promptly.

Avoid overlapping animations, animated layout dimensions, clipping reveals, and replaying completed section entrances. Reveal enhancement waits for hydration and respects changes to reduced-motion preferences. Content is visible without JavaScript. No navigation is held for an animation. See [web.dev's animation guidance](https://web.dev/articles/animations-guide).

## Responsive rhythm and affordances

Shared section/hero spacing scales from 3rem to 6rem. Controls use a 4px corner radius; framed surfaces use 6px. Keep circular identity marks circular. Footer groups stack on phones, use two columns on tablets, and three on desktop, with 44px minimum link targets. A static capability instruction identifies the next action; selected details reveal briefly without flashing, and reduced motion suppresses the reveal.

All layouts declare `data-scroll-behavior="smooth"`, allowing Next to manage route scrolling independently of smooth in-page anchors. Anchor offsets clear the sticky header.
