# Accessibility

The implementation follows WCAG 2.2 AA conventions; conformance requires real testing and content review, not just code checks.

## Conventions

One main landmark and h1 per page; semantic headings; a focusable main target and skip link; named navigation landmarks; native details/summary mobile menu with an enhanced two-line hamburger, mirrored aria-expanded, Escape handling, outside-focus dismissal, focus return, and restored body scrolling; minimum 44px primary controls; clear focus outlines; explicit field labels; required/optional labels; server-rendered field errors with aria-describedby/aria-invalid; controlled alert/status messages after redirect. No hover-only interaction or scroll-jacking. Decorative graphic SVG is aria-hidden; the process labels remain real text. Portfolio image alt text is supplied with approved assets.

Burgundy/charcoal provide reading/action contrast. Gold is an accent or text on dark burgundy, not small text on cream. Preserve contrast when replacing palette values. Focus is burgundy on light surfaces and gold on dark surfaces. Every motion enhancement respects prefers-reduced-motion. The short introduction is nonblocking and omitted without JavaScript.

## Required browser checks

- Keyboard: skip link, desktop/mobile navigation, details menu, all links, form fields, submit button; no traps.
- Screen reader: landmark names, heading order, labels, required state, field-specific errors, submission results, meaningful image descriptions.
- No JavaScript: mobile menu opens; all content is readable; form posts and displays a server result.
- Zoom/reflow: 200% text and 400% browser zoom; no clipped content or horizontal scrolling at 320 CSS pixels.
- Viewports: 320, 375, 430, 768, 1024, 1280, 1440, and 1920+. Inspect long names, labels, headings, URLs, and error messages.
- Reduced motion: no trace/entrance animations or smooth scrolling.
- Contrast: validate text, focus indicators, and controls using a contrast checker after final assets/content.
- Forms: invalid email, short/long message, missing interest, expired token, unavailable provider, partial acknowledgement failure, and successful no-JS submission.

Biome's accessibility rules catch some semantic mistakes. Add axe/Playwright when a browser testing stack is justified; automated tools do not replace keyboard and screen-reader review. Document unresolved findings before release. Form errors currently require re-entry and are not stored in a session; review usability with actual users as volume grows.

## Motion and media

Reveal wrappers start visible in server HTML. Only installed observers mark offscreen content pending, and focusing a nested link reveals every pending ancestor. Reduced motion reveals content immediately and suppresses the intro. Test changes to the preference while the page is open, not only on reload.

The mobile menu is a nonmodal disclosure rather than a focus-trapped dialog. Opening it leaves focus on its native control; Tab enters the navigation. Escape restores control focus. Moving focus outside or resizing to desktop closes it. Without JavaScript, native summary still works and no stale aria-expanded value is emitted. The scoped Biome suppression documents its incomplete handling of native summary semantics.

Project GIFs show static posters by default and require deliberate playback. Videos use native controls, no automatic sound, and posters. Optional autoplay is disabled for reduced motion and pauses offscreen/background playback. Current video support is for silent visual previews; add captions/transcripts when adding meaningful audio or narrative content. Decorative intros are aria-hidden and pointer-transparent.

## Media assets

Read [MEDIA_ASSETS.md](MEDIA_ASSETS.md) for meaningful alt text, poster requirements, and avoiding baked-in text or essential hover-only information. Verify client-supplied palettes and logos against final backgrounds.

## Earlier verification — 2026-10-11 (before route/feedback update)

Local Chrome checks covered all three applications at 320, 375, 430, 768, 1024, 1280, 1440, and 1920 CSS pixels without horizontal overflow. Desktop and mobile screenshots were reviewed. Checks passed for the keyboard skip link, menu Tab entry, Escape/focus return, expanded state and scroll restoration, reduced-motion visibility, and native no-JavaScript navigation and contact forms. Invalid native contact submissions returned accessible email errors. The introduction appeared on the first session visit, disappeared within its time limit, and stayed absent on repeat visits.

Lint, workspace type checking, and all 13 automated tests passed. Production builds, live Brevo delivery, screen-reader testing, 200%/400% zoom, and final approved logo/video/GIF assets remain to be verified before release. Placeholder media cannot establish final contrast or media accessibility.

## Submission and notifications

Native input constraints and server validation remain independent. The client form shell announces progress and discourages repeat submission without disabling inputs or changing their native payload. Contact outcomes remain on the page even after the success toast disappears. Toast timing pauses during hover and keyboard focus; its close control returns focus to the persistent result. Error boundaries provide retry/home/email actions without exposing internals. No loading skeletons are used on static pages.

## Reference decisions

The navigation uses disclosure semantics, not an application menu role: [WAI-ARIA navigation guidance](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/). Form enhancement observes a real submit event after native validation: [MDN submit event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event). Unexpected rendering failures follow [Next.js error handling](https://nextjs.org/docs/app/getting-started/error-handling). Formatting follows [Prettier's local installation guidance](https://prettier.io/docs/install).

## Process exploration

Every stage title and concise summary stays visible. Server HTML includes native details/summary for deeper information. After enhancement, desktop buttons use pressed state and control a common labelled panel; mouse hover and keyboard focus select stages. Mobile buttons expose expanded state and control a matching labelled inline region; Enter/Space and touch toggle details. Selection never traps focus. The full journey remains visible at every breakpoint, and reduced motion affects only presentation. Deep details contain text, so changing the selected stage cannot hide focused form fields or links.

Route navigation now uses Next Link where appropriate. Persistent layout effects re-evaluate current navigation and reveal targets on pathname changes. Native forms and server errors remain independent of client navigation.

## Second-pass verification — 2026-10-11

Local Chrome checks passed for all three process journeys: desktop keyboard selection, mobile keyboard expansion/collapse, matching control/panel relationships, reduced motion, native no-JavaScript details and contact validation, and internal route navigation. All eight widths listed above were checked without horizontal overflow. Desktop and mobile screenshots were reviewed. All 21 automated tests, lint, formatting, and workspace type checks passed. Production compilation, live Brevo delivery, screen-reader testing, zoom checks, and final approved media remain release checks.
