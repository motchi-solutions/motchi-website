# Motchi Solutions surface colors

Solutions uses the original family palette. Shared tokens, approved logo paths,
and asset colors are unchanged.

| Role                                  | Value     | Token        |
| ------------------------------------- | --------- | ------------ |
| Primary action / brand graphic        | `#5B0202` | `--burgundy` |
| Secondary accent / graphic backing    | `#D4AF7C` | `--gold`     |
| Page foundation / inverse text        | `#F4F0E6` | `--cream`    |
| Body ink / dark card and section fill | `#171313` | `--charcoal` |

The palette source is [the shared brand tokens](../../packages/brand/src/tokens.css).
[Solutions surfaces](src/app/surfaces.css) maps `.ms-surface-dark` to the original
charcoal for its background and local `--background` / `--surface` roles. This
keeps the Consulting service card, Products section, and nested placeholder
surfaces consistent. Light action buttons retain cream fill and burgundy text.

## Contrast checks

Calculated WCAG relative-luminance contrast against brand charcoal:

| Foreground role       | Color     | Contrast |
| --------------------- | --------- | -------- |
| Cream text            | `#F4F0E6` | 16.20:1  |
| Muted text            | `#D4C9BA` | 11.29:1  |
| Gold labels and links | `#D4AF7C` | 8.98:1   |

These combinations exceed 4.5:1 for normal text. Cream action buttons with
burgundy text have 12.69:1 contrast. Decorative borders retain the existing warm
border color; they do not carry interactive state alone.

Use the semantic surface class for dark fills. Keep the core palette in shared
brand tokens and the Solutions composition rules in the app's surface stylesheet.
