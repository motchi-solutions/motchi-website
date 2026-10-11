# Accessibility

The implementation follows WCAG 2.2 AA conventions; conformance requires real testing and content review, not just code checks.

## Conventions

One main landmark and h1 per page; semantic headings; a focusable main target and skip link; named navigation landmarks; native details/summary mobile menu; minimum 44px primary controls; clear focus outlines; explicit field labels; required/optional labels; server-rendered field errors with aria-describedby/aria-invalid; controlled alert/status messages after redirect. No hover-only interaction or scroll-jacking. Decorative graphic SVG is aria-hidden; the process labels remain real text. Portfolio image alt text is supplied with approved assets.

Burgundy/charcoal provide reading/action contrast. Gold is an accent or text on dark burgundy, not small text on cream. Preserve contrast when replacing palette values. Focus is burgundy on light surfaces and gold on dark surfaces. Every motion enhancement respects prefers-reduced-motion. The short introduction is nonblocking and omitted without JavaScript.

## Required browser checks

- Keyboard: skip link, desktop/mobile navigation, details menu, all links, form fields, submit button; no traps.
- Screen reader: landmark names, heading order, labels, required state, field-specific errors, submission results, meaningful image descriptions.
- No JavaScript: mobile menu opens; all content is readable; form posts and displays a server result.
- Zoom/reflow: 200% text and 400% browser zoom; no clipped content or horizontal scrolling at 320 CSS pixels.
- Viewports: 320, 375, 768, 1024, 1440, and large desktop. Inspect long names, labels, headings, URLs, and error messages.
- Reduced motion: no trace/entrance animations or smooth scrolling.
- Contrast: validate text, focus indicators, and controls using a contrast checker after final assets/content.
- Forms: invalid email, short/long message, missing interest, expired token, unavailable provider, partial acknowledgement failure, and successful no-JS submission.

Biome's accessibility rules catch some semantic mistakes. Add axe/Playwright when a browser testing stack is justified; automated tools do not replace keyboard and screen-reader review. Document unresolved findings before release. Form errors currently require re-entry and are not stored in a session; review usability with actual users as volume grows.
