# Approved Motchi Logos

SVG is the canonical web format. Each app contains all three supplied family marks in `public/brand/`:

- `ms-logo.svg` — Motchi Solutions
- `mw-logo.svg` — Motchi Websites
- `mc-logo.svg` — Motchi Consulting

Configure dimensions and local URLs in `packages/brand/src/index.ts`. Keeping the complete family in every app allows local public asset resolution and the shared family intro without cross-origin dependencies between sister sites. Use the supplied SVGs; do not redraw them. Header marks have empty alt text because the adjacent wordmark and home-link label already identify the branch.
