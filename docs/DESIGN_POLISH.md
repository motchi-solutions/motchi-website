# Design polish - 2026-10-25

Implemented on `develop`; contact finalization remains a separate follow-up.

The main issues were a long entry sequence, repeating arrow motion, menu transitions that could not reverse smoothly, an inline hero wordmark, a cream token that differed from the approved palette, and portfolio layouts that gave too little space to client imagery.

Solutions retains its original headline and interactive connected toolkit. Supporting copy is shorter, selection responds during entry, and the existing geometry remains the supporting visual. Websites allocates more desktop width to authentic project media and uses a shared project spacing token. Consulting uses consistent capability terminology, removes numbering from nonsequential capabilities/outcomes, and has quieter entry timing. All branches share stacked hero identities, an optional action label on `ContactCTA`, press feedback, and visible invalid-field treatment.

No fonts, monograms, backend behavior, dependencies, or client-side page boundaries were added. Gold, burgundy, and charcoal are unchanged; cream now matches the approved `#F4F0E6`. Branch surface variants remain intentional.

## Validation

- `npm run typecheck`: passed for all three apps.
- `npm test`: passed, 26 tests.
- `npm run format:check`: failed on 23 pre-existing untracked skill files under `.agents/`; no application formatting failures were reported.
- `npm run lint`: failed on five errors in the pre-existing `.agents/skills/ux-writing/index.html` demo, with ten warnings. The skill files were left unchanged.
- `npx biome lint apps packages`: passed, 170 files.
- `npx prettier apps packages tests docs '*.json' '*.md' --check`: passed.
- `npm run build`: attempted; Consulting's Turbopack CSS worker failed with a local port permission error. Solutions and Websites completed successfully on retry.
- `npm run build --workspaces --if-present -- --webpack`: passed for all three final apps. No build configuration was changed.
- `git diff --check`: passed.
- Local Chrome: 96 route/viewport combinations, with no horizontal overflow or visible content extending beyond the viewport. Checked home, services/capabilities, work, process/approach, about, contact, and Solutions products at 320, 375, 430, 768, 1024, and 1440px.
- Scripted browser interactions: menu open/close reversal, Escape closing and focus return, and a second Solutions selection during entry passed. No infinite arrow animations remained.
- Reduced-motion check on Websites work: intro hidden, zero active animations. JavaScript-disabled homepages remained visible without overflow at 320px on all three branches.
- Reviewed desktop/mobile homepage screenshots and a desktop project composition. Temporary screenshots and the audit scripts/results are under `/private/tmp/motchi-polish-*`.

These checks do not establish screen-reader or full WCAG conformance. Live email delivery and final form workflows were outside this polish pass.

## Live-session animation correction

The first follow-up restored keyframes but missed the live timing failure. The actual localhost:3000 page serialized `--motion-intro` as `2.6s`; parsing it with `parseFloat` made the React controller remove the intro after roughly 2.6 milliseconds. The mobile menu used the same incorrect conversion. A shared, unit-aware `motionMilliseconds` helper now handles optimized seconds, authored milliseconds, zero, whitespace, and malformed values. Two regression tests cover the conversion.

The intro now masks only its background curtain. The selected logo stays above that curtain while it centres and zooms, rather than being cut out by the aperture. Skip preserves the current aperture before fading. Intro completion also signals the page entrance, keeping fallback and skipped paths connected.

The MS hero again has a visible zoom (1.45× on desktop, 1.22× on narrow layouts), with a shared 800ms duration and unit-aware fallback. Its overview height is reserved when details open; the title and hero height no longer jump. Width changes release that reservation for responsive reflow. Another selection can interrupt entry, and Escape cancels entry/details and returns focus.

Shared copy/action/layout spacing is explicit. Buttons use a smooth hover lift, a quiet shadow, immediate press compression, and a smooth return from a cancelled press. Keyboard focus remains visible. Reduced motion omits the spatial effects. Document scrolling uses the browser's momentum and native boundary elasticity; menu scroll is contained. Elastic overscroll is browser/OS-dependent, and no wheel/touch interception or simulated document scrolling was added.

Validation used the user's existing server on localhost:3000, with actual pointer and keyboard input and the real hydrated/minified CSS:

- Family display, selected-brand centering, visible zoom above the curtain, and natural handoff passed at desktop and mobile sizes; screenshots were reviewed.
- Hero zoom, detail/back transitions, interruption by another selection, and Escape cancellation passed.
- Desktop hero height stayed at 765.39px and heading top at 244.5px before and after selecting details, at the checked 1440px viewport.
- Hover lift, press compression, cancelled press return, 280ms menu timing, menu reversal, Escape focus return, and restored body scrolling passed.
- No horizontal overflow at 320, 375, 430, 768, 1024, or 1440px on the checked MS landing page.
- Initial reduced motion and changing the preference during a hero transition passed. No uncaught application runtime errors were observed.
- Workspace typechecking and all 28 tests passed. Application/package/test lint and formatting passed. Root lint/format commands still fail only on the existing untracked skill files described above.
- No production build was rerun during this correction; validation used the active development session as requested. Native rubber-banding cannot be established by a headless screenshot; it remains controlled by browser/OS support and user settings.

## Remaining content

All four projects already have supplied desktop/mobile screenshots and logos under `apps/websites/public/media/projects/`. Optional photography, hero images, videos, and GIF previews still require supplied, approved assets; absent media receives a plain caption. No fake media or case studies were created.

Final Solutions contact-form layout, business logic, success/error flow refinements, and deeper content edits should follow the final form/content requirements. Existing form semantics and delivery behavior are preserved.

## Changed files

- `apps/solutions/src/components/hero.tsx`
- `apps/websites/src/app/page.tsx`
- `apps/websites/src/components/hero.tsx`
- `apps/websites/src/components/work.tsx`
- `apps/websites/src/components/project-preview.tsx`
- `apps/consulting/src/app/page.tsx`
- `apps/consulting/src/components/hero.tsx`
- `apps/consulting/src/components/capabilities.tsx`
- `packages/brand/src/tokens.css`
- `packages/brand/src/intro.css`
- `packages/config/src/navigation.ts`
- `packages/ui/src/motion-timing.ts`
- `tests/motion-timing.test.mjs`
- `packages/ui/src/intro.tsx`
- `packages/ui/src/page-entry.tsx`
- `packages/ui/src/mobile-menu.tsx`
- `packages/ui/src/motion.tsx`
- `packages/ui/src/primitives.tsx`
- `packages/ui/src/system-capabilities.tsx`
- `docs/BRAND_SYSTEM.md`
- `docs/ACCESSIBILITY.md`
- `docs/MEDIA_ASSETS.md`
- `docs/DESIGN_POLISH.md`

- `packages/ui/src/page-hero.tsx`

- `apps/websites/src/app/about/page.tsx`

- `apps/websites/src/app/services/page.tsx`

- `apps/websites/src/app/process/page.tsx`

- `apps/websites/src/app/work/page.tsx`

- `apps/consulting/src/app/about/page.tsx`

- `apps/consulting/src/app/capabilities/page.tsx`

- `apps/consulting/src/app/approach/page.tsx`

## Label timing refinement

The intro skip hint now finishes fading at 72% of the sequence, and the selected brand labels at 74%; the page reveal begins at 77%. Explicit skipping clears labels immediately. The MS toolkit zoom now lasts 800ms with a gentler ease-in/out, while its centre labels fade within the first 18% (144ms) so they do not enlarge over surrounding content. The logo and zoom remain visible.

## Zoom handoff and spacing/copy review

The selected intro identity now fades continuously during the zoom and reaches zero opacity at 88%, instead of remaining almost opaque until that point. Its labels and skip hint still clear before the page reveal.

The toolkit's old desktop anchor and paths are hidden immediately when the detail layout replaces the outgoing overview. This prevents them from flashing back at their unzoomed position. The zoom is clipped to its own region. Back, menu, and detail panels then enter as peer regions in one synchronized 320ms fade/lift, without nested scaling, delayed child cascades, or an old-logo opacity transition.

Live localhost:3000 frame samples at 375px and 1440px confirmed: the intro logo fades progressively and clears early; details stay hidden throughout the outgoing zoom; the old anchor remains hidden throughout the incoming reveal; menu/detail opacity stays synchronized; detail children have no competing animations; reduced motion has no running animations. Typechecking and all 28 tests passed. Scoped lint/format and diff whitespace checks passed.

The source review covered homepage and inner-page introductions, section/type/spacing primitives, branch CTA labels, service/capability/process copy, project presentation, and custom Solutions layouts. It found and corrected:

- Websites inner-page CTAs now consistently say Start a Project; Consulting says Start a Conversation. Consulting capability labels and metadata use Capabilities consistently.
- Shared inner heroes use the same copy and action spacing tokens as the homepages. Section introductions no longer carry redundant conflicting margin declarations.
- Portfolio copy names event catering rather than vague project work; Websites About metadata now names its subject directly.

The reviewed system follows the brief: shared Motchi identity and approved palette/fonts, restrained decoration, purposeful hierarchy, distinct branch personalities, actual client media, readable copy, and server-first pages. Compact MS exploration layouts intentionally use smaller local grouping than editorial sections. This is not a claim that every content-dependent detail is finished: final Solutions form/content and later supplied-media refinements remain pending. This follow-up validated animations live on MS and reviewed MW/MC source; it did not repeat the earlier full visual viewport sweep of every route on the other two apps.

## MS control affordances and compact detail layout

Hero choices now have a persistent disclosure chevron, stronger default border/surface treatment, and a burgundy selected state. They use `aria-expanded` with their controlled detail region, and activating the open choice returns to the overview. Process stages in the Solutions single-selection variant have bordered rows, visible View details/Hide details labels, and framed plus/minus cues. These are functional disclosure controls rather than decorative content cards; other branch process variants are unchanged.

Back to areas is grouped immediately below the area choices. The detail grid uses named areas and start alignment instead of stretching an empty top row. The temporary overview minimum height releases through a short transition when details open. In the checked 1440px layout, the detail region reduced from 485px to 348px high, and Back sits 12px below the list. The hero title stays top-aligned. Container queries preserve the compact one-column layout on narrow widths. Redundant process-stage dividers and top padding were removed from the enhanced Solutions variant.

The old controls already computed to a pointer cursor, so the native multi-monitor caret symptom was not directly reproduced. Their labels were selectable and their small hover hitboxes moved. Labels/icons now pass pointer targeting to their native control, button-like controls suppress text selection, and small hero controls keep their hitbox stationary on hover. Main CTA links receive the same button-like pointer targeting; ordinary reading copy remains selectable. No global forced-cursor or window-focus workaround was added.

Validation on the existing localhost:3000 server:

- Hero overview/details/return: no horizontal overflow at 320, 375, 430, 768, 1024, and 1440px; return action remains close to the area list and restores focus.
- Pointer-over-label hit testing lands on the button; computed pointer cursor and hitbox remain correct after switching to another tab and reactivating Motchi.
- Native Enter/Space activation opens and closes hero choices and process stages. Process action labels and expanded states agree.
- MS hero zoom and the separated handoff remain intact. Desktop/mobile screenshots were reviewed.
- Workspace typechecks and all 28 tests passed. Scoped lint/format and diff whitespace checks passed. Root lint/format retain the unrelated untracked skill-file failures recorded earlier.
- Native cross-monitor cursor rendering itself cannot be observed by this headless check; only the tab-focus and DOM hit-testing behavior was verified.

## Products, process, and Services refinement - 2026-10-26

- Mobile/tablet Products now shows the selected name, status, and description above the gate, with its enquiry action after the preview. Desktop keeps the gate beside the product context/action. Only the selected summary is rendered, removing the extra height previously reserved by invisible product copy. Existing product content and artwork are unchanged.
- Gate hover was not intentionally limited to the first entry: a closing-state guard discarded entry events during a 1400ms close. Preview now retargets immediately from its current transform/opacity and holds a consistent 6-degree peek, without an infinite pulse. A carousel arrival refreshes the current pointer hit test, covering a new gate sliding under a stationary pointer. Shared gate timing keeps preview visibility aligned with closing.
- Solutions process controls now use plain plus/minus signs with no circle, extra View/Hide details link, tinted selected fill, or travelling marker. The connector stays behind opaque rows, so it appears in the gaps rather than crossing the controls. Native buttons, expanded state, focus, and selected-border feedback remain.
- Removed the Services explorer's right-weighted radial background, which caused the uneven surface behind Other Needs. The desktop tab bar and contained illustration remain.

Validated against the existing localhost:3000 server: Products ordering and overflow at 320/375/430/768/1024/1440px; repeated hover and close interruption at 375/1024/1440px; stationary hover after product switching; opening, closing, and immediate re-entry; reduced-motion doors; touch and native Enter/Space gate input; simplified process controls at mobile/desktop, connector layering, and native keyboard operation; even Services background and no overflow at all six widths. Desktop/mobile screenshots were reviewed. Workspace typechecks, all 28 tests, scoped lint/format, and diff whitespace checks passed. Root lint/format retain the existing untracked skill-file failures.

Additional implementation files: `apps/solutions/src/components/products-hero.tsx`, `products-hero.module.css`, `use-product-gate.ts`, `services-explorer.module.css`, and `packages/ui/src/interactive-steps.tsx`.

## Hero minus cue and option switching - 2026-10-26

The active MS hero option now displays a minus to match its collapse action; closed options retain their chevron. In the stacked control layout, the active option leads at full width and the other four form a 2×2 grid. The wide rail stays compact and keeps its fixed order so labels remain readable beside the detail panel.

Switching options measures each control's currently displayed geometry, cancels any earlier movement, and animates into the next layout. Local width interpolation avoids stretching text. Detail content enters as one short group, with a measured height transition rather than an oversized fixed panel. No outgoing text clone is retained. Reordering preserves native focus and source/visual keyboard order. The controller follows the CSS container layout flag, including text-size changes, and reduced motion bypasses animation. The Automation category also uses its intended workflow icon.

Live localhost:3000 validation passed for all five options at 320, 375, 430, 768, 1024, and 1440px: minus/chevron state, focus preservation, no overflow, full-width active + 2×2 remaining controls wherever stacked, and collapse on a repeated activation. Additional checks passed for actual in-progress position/width movement, one incoming detail group, rapid interruption and latest-selection settlement, reduced-motion changes mid-animation, Enter/Space and visual Tab order, resizing back to the rail, fixed-width text scaling, the original first zoom and its handoff, immediate reveal when a new CTA receives focus, and Escape focus return. Desktop/mobile screenshots were reviewed. Workspace typechecks and 28 tests passed; scoped lint/format passed. Root checks retain the unrelated untracked skill-file failures documented earlier.

## Calmer switching and animation interruption - 2026-10-26

- MS process connectors are measured between adjacent steps. Selecting step 3 colors the connectors from 1 to 2 and 2 to 3 burgundy; closing the selection clears the path. Geometry follows the expanded mobile layout, with reduced motion respected.
- Hero option changes retain fully visible text instead of replaying an opacity reset. Layout movement takes 480ms, height and subtle text movement 420ms, and selected colors blend over 420ms. Inputs still retarget immediately; hover/press feedback keeps its existing timing.
- Services preserves its icon arrival and globe detail animation through the page-entry lifecycle. Cleanup pauses owned CSS animations so effect restarts can rewind them, instead of canceling them permanently.
- Products settles the album before copying an outgoing gate. Cancellation removes the temporary photo immediately and invalidates the asynchronous second stage. Gate exits are also tracked and canceled on another selection.

Validated against localhost:3000 in a separate headless browser: all five hero options at six viewport widths, rapid switching, keyboard/focus, reduced motion, Services icon/globe playback, burgundy connectors through step 3 and their mobile geometry, and gate switching 160ms and 760ms into the photo sequence. Both photo interruption stages remove transient cards immediately and cannot restart later; rapid product switching leaves one live panel. Workspace typechecks, 28 tests, scoped lint/format, and whitespace checks passed. Existing root lint/format failures in untracked skill files remain as recorded above.

## Expand hero options in place - 2026-10-26

Hero options now retain their original DOM and visual sequence. In the stacked layout, flex wrapping gives the selected option a full row at its existing position; surrounding options share the remaining rows without empty grid cells. The wide rail retains its compact layout. Measured transitions move each stable slot and resize its button independently, avoiding text scaling or repeated layout changes during wrapping. The calm timing, persistent text, minus cue, and interruptible motion remain.

Live localhost validation passed for all five options at 320, 375, 430, 768, 1024, and 1440px, including full-width expansion, overflow, reduced motion, rapid selection changes, native Enter/Space, stable Tab order, focus, and resizing. Mobile screenshot reviewed; workspace typechecks, scoped lint, and whitespace checks passed.

## Calmer inline process disclosures - 2026-10-26

Mobile and tablet process details now expand and collapse over 560ms through an intrinsic grid row, replacing the immediate hidden/display switch and short entrance animation. Padding collapses with the content, surrounding steps move continuously, and switching or reversing mid-transition follows the current layout. Closed details are inert and hidden from assistive technology; reduced motion changes immediately. Number and card color transitions take 420ms on inline layouts.

Validated on localhost:3000 at 320, 375, and 768px: frame-by-frame intermediate heights, collapse reversal, rapid selection settlement, closed accessibility state, no horizontal overflow, and reduced motion. Workspace typechecks, scoped lint/format, and whitespace checks passed.

## Mobile navigation, Services order, and static hero - 2026-10-26

- Shared mobile navigation now uses a wider, viewport-bounded panel with comfortable link rows, quieter arrows, a clear current-page surface, and a distinct Contact action. The trigger has a visible boundary and changes from Menu to Close. Native disclosure fallback, Escape/focus restoration, outside dismissal, scrolling, and reduced motion remain supported.
- Services now follows the narrow-screen Products order: selected summary, illustration, then a centered enquiry action with a 20px row gap. Only the selected summary is rendered, avoiding space reserved by invisible descriptions. Desktop groups the summary and action beside the illustration.
- Mobile hero options retain a fixed grid and their original order. Switching no longer expands or reflows controls: the current detail fades out over 180ms and its replacement fades in over 360ms. Intrinsic overlapping grid cells reserve the tallest mobile detail height while inactive content is invisible and inert. Desktop displays only its selected detail. Fade reversals use current opacity, rapid choices settle on the latest selection, and reduced motion bypasses fading.

Validated on localhost:3000: four Services tabs at six viewport widths; navigation fit and 44px-or-larger targets at four widths; current-page feedback, scroll lock, Escape and restored focus; five hero choices at four narrow widths with unchanged control geometry; sequential opacity changes with fixed panel height; rapid switching, reversal and reduced-motion changes; original hero zoom/handoff, CTA focus, and Escape. Mobile navigation and mobile/desktop Services screenshots reviewed. Workspace typechecks, all 28 tests, scoped lint/format, and whitespace checks passed. Existing unrelated root lint/format failures in untracked skill files remain documented above.

## Connector tracking and immediate menu feedback - 2026-10-26

- Process connectors now observe each row as well as the track. They write shared SVG endpoints directly before paint, including when two expanding/collapsing rows trade space without changing total track height. The SVG clips to the process track, preventing a stale endpoint from painting into the following section.
- Menu visual state updates when a transition starts rather than waiting for the native details close event. Menu/Close labels crossfade in a fixed-width slot, the hamburger responds to the same immediate state, and repeated outside dismissal cannot restart the exit. Closing links become inert immediately; native disclosure fallback, interruption and reduced motion remain.
- The centered Automation option uses the exact half-column width of its peers. The mobile return action follows the detail in both document and visual order, centered beneath it.

Live localhost:3000 checks passed: connector endpoints matched their row centers within 1px through 58-59 transition frames at 320, 375, and 768px, with no overshoot; menu state changed during the exit, labels crossfaded, trigger width stayed fixed, scroll settled, and rapid reversal returned cleanly to open. Hero option widths matched and the back action followed the detail for multiple selections at 320, 375, 430, and 768px. Workspace typechecks, scoped lint/format, and whitespace checks passed.

## Consistent spacing across all pages - 2026-10-26

Introductions now follow a shared proximity scale: eyebrow to heading 16px, major heading to description 16-24px, introduction to section content 28-40px, and copy to action 24px. Peer cards use 20-32px gaps; the interactive Services and Products previews retain their intentional 20px spacing. Major section padding and portfolio separation remain larger than internal content spacing.

Shared primitives and tokens own the rhythm. Stacked SectionHeading components own their following margin; section-layout owns the gap in split compositions without a second margin on its introduction. Applied these rules to all three homepages, service/product summaries, work and capability sections, about pages, process pages, contact layouts, privacy notices, and common actions. Removed contradictory local margins and the mobile-only About section padding exception.

The process section's disappearing hint previously retained its line height and bottom margin, leaving an invisible extra gap after interaction. Removed that redundant hint now that whole-card buttons and plus/minus cues clearly communicate the interaction.

Live validation covered all 20 public pages across ports 3000, 3001, and 3002 at 375, 768, and 1440px. Measured eyebrow, title/copy, stacked heading/content, split layout, and hero/action gaps against resolved token values, with no horizontal overflow. Reviewed screenshots from Solutions process, Websites service content, and Consulting capabilities. Connector geometry, menu feedback/reversal, equal hero option widths, and integrated return placement also passed regression checks. All workspace typechecks, 28 tests, scoped lint/format, and whitespace checks passed. Temporary branch dev servers were used only for review; the user's localhost:3000 session remains running.

## Services navigation warning investigation - 2026-10-26

Reported warning: React's "This library called use() to suspend in a previous render but did not call use() when it finished", intermittently while navigating to Services.

Removed usePathname and the pathname-keyed child div from PageEntry. Each app already renders PageEntry inside its root template, whose framework-owned route key remounts it when the first route segment changes. The wrapper now initializes once per template mount and reads the committed pathname in its layout effect only for the inner-page styling flag. This avoids an extra pathname-driven subtree reset while route content streams.

The exact warning did not reproduce before the change, so its root cause remains unconfirmed. No warnings or uncaught errors appeared in 140 post-change client navigation attempts: 48 desktop, 20 delayed/interrupted route requests, and 72 through the mobile menu, including transitions from Contact. Normal-motion checks also confirmed Services' icon entry, correct page styling, and returning home without replaying the brand intro. Workspace typechecks, 28 tests, scoped lint/format, and whitespace checks passed. If the warning recurs, capture its component stack before attributing it to this wrapper or another library.

## Soft background trial - 2026-10-26

The Solutions About page's Better Together section (#partnership) is a reversible visual trial: replaced its charcoal background with a warm beige made from 18% brand gold and the page background. Changed inverse text to foreground/muted text and the gold link/eyebrow treatment to readable burgundy. The isolated partnershipTrial module class keeps this experiment separate from the rest of the palette. This is a trial, while the upright landing identity and matching beige/gold mission-card top border are permanent user preferences.

Reviewed at 375px and 1440px on localhost:3000; measured minimum text contrast is 6.8:1, with no overflow. Workspace typechecks, scoped lint/format, and whitespace checks passed.

The warm-background trial was reverted at the user's request. Better Together again uses the original warm charcoal (#171313), cream text, and gold accents. Minimum rendered text contrast, including composited 85% cream body text, measured 9.0:1 at mobile and desktop sizes. The upright landing identity and beige/gold mission-card border remain permanent. The charcoal section is retained as an intentional high-emphasis break within the predominantly cream page.

## Real album previews and softer returns - 2026-10-26

The Products gate album now contains a real upcoming image/caption beneath its front card instead of an empty decorative sheet. Drag direction selects the next or previous artwork; both adjacent images load eagerly so reversing direction does not reveal an unloaded square. Preview depth follows drag distance and the same preview is promoted when a swipe completes.

Short releases use a sampled critically damped return from the displayed position and recent pointer velocity. Regrabbing preserves the current presentation rather than snapping to rest. Completed turns move outward for 480ms and settle behind the stack along a curved, eased 760ms path; the incoming image rises from its preview depth over 520ms. New interactions can interrupt recycling. The existing generation guard and gate-reset contract prevent canceled temporary cards from restarting or lingering. Vertical-scroll intent, keyboard browsing, inactive-gate controls and reduced motion remain supported.

Live localhost validation passed for mouse and touch dragging, loaded preview artwork, preview promotion, reverse direction, intermediate return positions, regrabbing both release and recycling motion, vertical-scroll cancellation, native Enter activation, reduced-motion changes mid-flight, close cleanup, and gate switching during a turn. Desktop drag screenshot reviewed. Workspace typechecks, 28 tests, scoped lint/format, and whitespace checks passed.

## Full Pop Tips preview imagery - 2026-10-26

Replaced the three cropped decorative fragments with two complete, more tangible cards: an original generated collectible-character concept with a question mark, and the approved full Pop Tips mystery-box logo. The character is explicitly captioned "Collectible concept"; no product photography, availability, or feature claims are implied. The generated 768×768 WebP is approximately 41KB and is stored in the project's public assets. The existing logo artwork is unchanged.

Cards now use a square artwork area with object-fit: contain and a larger album width. Narrow layouts cap the card at 13rem to preserve space for the return control; desktop cards use more of the gate. Removed the redundant Behind the scenes label that crowded the taller artwork. The logo plays one gentle 900ms wiggle after a 600ms reveal delay; it does not loop and respects reduced motion.

Validated both cards at 320, 375, 430, 768, 1024, 1440, and 1920px for loaded full artwork, square proportions, no cropping, no horizontal overflow, and return-control clearance. Confirmed one-shot logo motion, quiet settlement and reduced-motion suppression. Re-ran mouse/touch drag, next-image promotion, reverse previews, damped return/regrab, keyboard labels, vertical scrolling, gate close/switch cancellation, and reduced-motion interruption. Mobile/desktop screenshots reviewed. Workspace typechecks, all 28 tests, scoped lint/format, and whitespace checks passed.

## Supplied mystery images - 2026-10-29

Replaced the generated collectible concept with the supplied Hirono image and added the supplied Labubu silhouette as a second artwork card, followed by the existing Pop Tips logo. Hirono is a byte-for-byte copy of the original JPEG. The Labubu edit changes yellow to pink while retaining the silhouette, placement, portrait proportions, and supplied bottom crop; optimized output is 398×502 WebP, approximately 7KB. The previous generated character was removed from the public folder.

The image layer is now positioned inside its square artwork area so portrait assets do not force a taller card; object-fit: contain keeps the full supplied image visible. Mobile/tablet/desktop checks passed for all three cards, including load readiness, card proportions, control clearance, reduced motion and the logo's one-shot effect. Mouse drag, next/previous previews, promotion, smooth returns/regrabs and gate-switch cleanup also passed. Hirono file integrity was verified, and black-mask overlap between original and recolored silhouette measured 99.6%. Workspace typechecks, scoped lint/format, and whitespace checks passed. The temporary preview server was stopped after review because the user's port 3000 session was not running.

## Imported skill coverage - 2026-10-29

Reviewed all three apps against the imported `apple-design`, `design-systems-frontend-architecture`, `frontend-design`, and `ux-writing` skills. Shared tokens and UI apply consistent spacing, typography, press/focus feedback, reversible menu transitions, and reduced-motion behavior to Solutions, Websites, and Consulting. Each root layout consumes the shared UI and each app template uses `PageEntry`.

Solutions keeps its interactive toolkit and product album, Websites prioritizes supplied project imagery, and Consulting uses capability disclosures without misleading sequence numbers. Copy and hierarchy changes cover each site's homepage and inner pages. Existing brand choices are retained where more general skill defaults differ.

Imported skill resources retain upstream formatting and are excluded from application lint/format checks. Contact workflow finalization and live email delivery remain outside this pass. Earlier browser-validation entries above describe their original review sessions, not new browser checks on this date.

Current verification: `npm run lint`, `npm run format:check`, workspace typechecks, all 28 tests, and webpack production builds for all three apps passed. The default Turbopack build encountered local font-network and worker-port restrictions; webpack validation used the existing build command with `--webpack`, without changing production build configuration.
