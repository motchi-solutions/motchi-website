# Brand system

Motchi's eventual MS, MW, and MC monograms share a gold M. Do not reconstruct them using text, CSS, or SVG paths. Until approved assets are supplied, the shell uses an ordinary Motchi wordmark. Drop assets into each app's `public/brand/`, then update `logos` in `packages/brand/src/index.ts`. The current circle favicon is a temporary geometric marker, not approved identity artwork.

## Palette and roles

| Family colour | Value | Role |
| --- | --- | --- |
| Gold | `#D4AF7C` | Recognizable accent, graphic paths, gold M in supplied logos |
| Burgundy | `#5B0202` | Primary actions, key headings, Consulting hero |
| Cream | `#F4F0E6` | Shared foundation and inverse text |
| Charcoal | `#171313` | Reading text and dark surfaces |

`tokens.css` maps these to `--brand-primary`, `--brand-secondary`, `--brand-accent`, `--background`, `--foreground`, `--inverse`, `--muted`, `--border`, and `--surface`. Tailwind semantic utilities derive from these variables. Branch adjustments live in the same token file using `data-branch`. Email and generated social images have their own rendering requirements; email's small palette is isolated in its template module.

Solutions uses balanced cream/charcoal with a purposeful idea-to-support graphic. Websites has a lighter background, more visual space for work, and client-specific imagery when approved. Consulting has deeper burgundy and restrained serif emphasis, with technical substance and readable capability lists.

## Typography and composition

Arial/Helvetica/system sans is the reading and technical font. Georgia is a limited display accent, used in a few italic phrases rather than every heading. Both are web-safe; this avoids a font-fetch dependency and keeps a reliable fallback without JavaScript. If replacing them with open-source fonts, use local licensed files with `next/font/local` and preserve the centralized font tokens.

Hero and section sizes use fluid tokens; reading width is 42rem and shell width is 80rem. Gutters expand from mobile to desktop. Section spacing is fluid from 4rem to 8rem. Use the spacing scale before arbitrary values. Rectangular actions, editorial dividers, and generous gaps tie the branches together; do not turn every section into the same card grid.

Gold is not used as body text on cream because that pairing lacks contrast. Use burgundy or charcoal for small text. Motion is brief and optional; reduced-motion overrides always win. The introduction is an 850ms header trace, skipped after one browser session visit per origin and never gates content.

Portfolio placeholders are labels and typographic treatments, not claimed client screenshots or approved brand identities. Replace them with authentic imagery before a portfolio-led launch.
