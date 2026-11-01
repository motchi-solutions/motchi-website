# Motchi Solutions spacing

This contract applies to Motchi Solutions only. The implementation is
[src/app/spacing.css](src/app/spacing.css), imported after the shared brand tokens.
Do not change shared MW/MC styles to adjust Solutions density.

## Principles

Follow the existing [brand spacing contract](../../docs/BRAND_SYSTEM.md#spacing-contract)
and the installed design-systems-frontend-architecture and frontend-design skills:

- Proximity communicates relationships. Copy belongs closer to its heading than to the next topic.
- Name recurring spaces by purpose. Reuse the semantic token instead of adding a local clamp.
- One element owns each gap. A parent grid gap and its child's margin must not both separate the same content.
- Use the four-pixel scale for small fixed spaces. Fluid tokens interpolate between those endpoints.
- Keep content in natural flow. Use width-based responsive spacing, not viewport height or fixed content heights.
- A consistent rhythm does not require identical compositions. Preserve the S artwork, product gate, and editorial layouts.

## Roles and values

Values assume the default 16px root size; rem-based values remain responsive to text settings.

| Relationship                                  | Token                     | Range                |
| --------------------------------------------- | ------------------------- | -------------------- |
| Section edge                                  | `--ms-space-section`      | 32-48px              |
| Homepage hero edge                            | `--ms-space-hero`         | Same as section edge |
| Compact Services / Products / About hero edge | `--ms-space-exploration`  | 24px                 |
| Eyebrow to heading                            | `--space-eyebrow`         | 16px                 |
| Major heading to copy; paragraph stack        | `--space-copy`            | 16-24px              |
| Small feature heading to detail               | `--space-related`         | 12px                 |
| Copy to action group                          | `--space-action`          | 24px                 |
| Introduction to content group                 | `--space-section-heading` | 28-40px              |
| Split layout columns / rows                   | `--space-layout`          | 24-32px              |
| Peer cards and action-group columns           | `--space-card`            | 20-32px              |
| Surface / card padding                        | `--space-inset`           | 20-32px              |
| Interactive preview grouping                  | `--space-preview`         | 20px                 |
| Adjacent controls / wrapping actions          | `--space-control-gap`     | 8px                  |

Solutions deliberately uses more compact section edges than the family's original
56-104px defaults. This is a product density choice, not a change to family branding.
Each section owns its top and bottom edge. Two adjacent sections therefore contribute
64-96px between their content groups. Do not add another transition margin.

## Ownership

- `Section` and `.py-section` / `.py-content` consume the section edge token, including Contact, Privacy, the closing CTA, and the footer.
- The homepage hero's content container owns its edge spacing; its full-width artwork owns no document space. The headline owns the 16px identity gap, so the wordmark's default bottom margin is cleared.
- `SectionHeading` owns the following group gap. In a split `.section-layout`, the grid owns it instead.
- Homepage Products uses a block introduction and owns its following group gap once.
- The About summary uses top-aligned grid columns. On desktop, the right-hand copy is offset by `--space-eyebrow + --space-section-heading` so the headline leads; stacked layouts remove the offset. Copy-to-action spacing remains owned by the content.
- Branch cards use inset padding, heading/copy proximity, and one gap before the CTA. Their `margin-top: auto` aligns actions without inventing a fixed card height.
- The capability selector uses one ivory feature surface for its prompt, controls, description, and action row. A divider groups the response below the controls without a second background. Details share a grid cell so switching selections does not move the next section. Inactive options remain hidden and inert.
- Inner hero introductions own the gap to tabs. Tabs-to-preview uses the preview token. Split previews use the layout token horizontally.
- Homepage branch cards share the same top and bottom edges on desktop. Grid stretch and flexible content align their actions; mobile stacks them with the peer-card gap and no extra offsets.

## Homepage composition

Reuse a small set of patterns rather than making every section identical:

- `.ms-surface-feature` uses `--ms-radius-feature`: a restrained 20-40px curved top-right corner with square remaining corners. This connects the hero explorer and both service cards.
- `.ms-surface-dark` supplies the same original brand charcoal surface, cream text, muted copy, and borders to Consulting and Products. Light buttons retain burgundy ink; headings and links use explicit inverse/accent roles.
- Standard introductions align to the main `Container`. About uses the same two-column `section-layout` pattern as other editorial content, balancing the heading with readable copy instead of leaving a large empty right side.

The responsive feature corner and dark-surface roles are defined once in
[src/app/surfaces.css](src/app/surfaces.css). Artwork overlaps are confined to the
hero. Peer service cards remain aligned at the same level.
Pills remain circular controls. These are intentional variants, not independent
styles or arbitrary percentage offsets.

The original charcoal fill and contrast roles are documented in [COLORS.md](COLORS.md).
About uses the eyebrow About Motchi and the heading A Little About Us. Its short
summary introduces people-first work, accessible pricing, and community products.
The About page expands the mission and vision in two peer cards within one
section, reusing the light/dark service surfaces and shared feature corner. Paragraph and action gaps use their existing tokens.
Products keeps the descriptive heading Products We're Building.

The homepage sequence is positioning and the Our Expertise capability selector,
the two working branch websites, the delivery process, products
in development, the company philosophy, and contact. The existing branches and
product statuses provide concrete evidence without invented case studies or metrics.
The hero's contextual discussion/exploration links replace duplicate generic CTA
buttons. The selector introduces our expertise and explains how each area helps a
business; do not repeat the same categories in a separate overview section. The
product summary always links to Products, including when individual products are
not yet available.

The full-width S is the homepage's signature graphic. Its gold trace follows both
curves, starting at the first bend rather than the vertical stem. Each selection
advances 19 points along the normalized path; the 20-point segment reaches 96% on
the final option. This gives the interaction a broad sweep, with part of the final
segment remaining exposed beside the selector as its tail passes behind it.
The dash does not wrap or loop. Keep the shared smooth transition and omit spatial
movement under reduced motion.
The active capability uses a minus beside its label; other options use a plus. Both strokes stay mounted so the vertical stroke rotates and fades smoothly between states, including interrupted selections. Reduced motion switches immediately.
`aria-pressed` remains the source of selection state.
The shared Solutions contact section restores a cropped gold curve behind its content, using the same decorative rule across routes.
Discussion and external exploration links use the same burgundy and weight; their
labels and arrow direction explain the different destinations without dimming either.

The hero-to-services transition uses the existing thin border role to separate two
cream sections without introducing extra padding. The label is Our Services: it
describes the visitor's next choices without implying a legal company structure
or multiple dedicated teams.

## Intro optical sizing

The shared intro separates the tile frame from its image. Tile size, border,
padding, label size, and animation timing stay identical for all three marks.
The Solutions text label has a separate weight correction documented below.
On the Solutions intro only, the approved MS image receives a 1.04 scale and a
small centering adjustment inside that frame. This compensates for its lower
painted area without changing SVG paths, colors, or dimensions in the assets.
The rule is scoped by `data-intro-branch="solutions"` and `data-intro-mark="solutions"`;
other branch intros retain their existing presentation.

## Exceptions and safeguards

Artwork coordinates, aspect ratios, connector offsets, product-gate clearances, and
intentional overlapping preview margins describe geometry, not reading rhythm. Keep
them local. The About story connector derives its position from the inset and icon
size so token changes do not disconnect the line.

Keep native link/button semantics, visible focus, reduced-motion behavior, and 44px
minimum action targets (48px capability pills). Compact spacing must not shrink targets.
The header keeps its established navigation and sticky-header clearances.

For a new spacing requirement, first use a role above or a four-pixel micro value.
Only add a token for a recurring semantic role; document it here with its owner.

## Validation

Check Home, Services, Products, About, Contact, and Privacy at narrow mobile, tablet,
and desktop widths. Check all capability/tab states and the open product gate.
Verify no horizontal overflow, no doubled introduction gaps, consistent section
edges, stable selection height, readable enlarged About copy, and focus outlines
that remain visible around rounded surfaces. Check effective desktop zoom separately
from actual browser zoom; do not describe viewport simulation as a browser-menu test.

## Homepage guidelines audit

Reviewed against the [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).
Repository ASCII punctuation rules and the approved Motchi palette take precedence
where editorial recommendations differ.

- `src/components/hero.tsx:14` - supplied business positioning; one semantic H1; duplicate generic buttons removed in favor of contextual selection actions.
- `src/components/hero.module.css:89` - one selection surface, visible focus, 48px controls, bounded full-width artwork, and reduced-motion behavior.
- `src/components/capability-thread.tsx:77` - persistent SVG group for interruptible plus/minus transforms; decorative icon hidden from assistive technology.
- `src/components/capability-thread.tsx:86` - live response, stable intrinsic sizing, and inactive content hidden and inert.
- `src/components/products.tsx:70` - visible Products-page CTA alongside accurate in-development status labels.

Browser validation covered eight widths from 320px to 1920px, effective desktop
zoom from 80% to 125%, all five capability selections, keyboard focus/activation,
reduced motion, and the Products destination. Contrast retains the established
burgundy-on-cream, charcoal-on-ivory, and cream/gold-on-charcoal roles. No new
fonts, media, dependencies, or page-wide client boundary were introduced.

### Hero overlap and people-first copy

The hero explorer keeps the shared feature corner, an opaque ivory surface, and
its gold top edge. A local 6px by 8px shadow with a 20px blur at 10% charcoal
separates it from the S without a cream clearance. This is a deliberate overlap
exception, not a general card shadow.

Process labels are Define Your Goals, Set Project Scope, Build & Test, and
Ongoing Support. Scope includes transparent pricing, ongoing costs, timelines,
responsibilities, and review points. Below 1024px, each process stage owns the
surface and border so its bullet list expands inside the same box. Bullets use
a modest 2rem left inset and one column; the existing grid disclosure animation
and reduced-motion behavior are retained. Desktop keeps its side detail panel.

The homepage About summary stays brief. The About page uses Mission and Vision
sections to explain client-first service, community-minded pricing, and products
built with care for users. Accessibility of pricing means focused scope and clear
costs, not reduced quality. Product safeguards are expressed as the brand's vision,
rather than claims of independently verified security.

### Consistent contact headings and intro label weight

Homepage ContactCTA uses the shared component's heading scale without a homepage
font-size or width override. Its graphic remains unchanged.

The Solutions intro label uses weight 700 as an optical correction; Websites and
Consulting remain at 600. This corrects the perceived weight of the shorter word
without changing label sizes, spacing, animation, or other branch intros. The
previous image sizing correction concerns the monogram, not this text label.

Mission and Vision share one section with two equal-height cards from 768px and
stack below that breakpoint. They reuse the service cards' ivory/charcoal surfaces,
feature corner, inset, and gap. Their headings use the service-card title scale.
