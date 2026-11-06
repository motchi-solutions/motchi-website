# Contact graphic system

These geometric SVGs extend the Solutions homepage's S curve, paired burgundy/gold paths, and monogram geometry. They are decorative textures, not service icons or replacement logos. Use transparent backgrounds over Motchi cream (#F4F0E6).

| Asset                    | Meaning                                                                                                                                                                                          | Current use                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| guided-flow.svg          | A branch reconnects with an S-inspired route: exploration supported by guidance. A soft gold arch gives the route a clear silhouette; the gold offset echoes the homepage ribbon's second layer. | Upper-left form margin; a cropped corner on mobile.                              |
| structure-to-clarity.svg | Three curves settle into evenly spaced parallel lines: different starting points becoming a clear plan. An open rounded frame and softly filled square suggest structure.                        | Lower-right form margin on tablet/desktop.                                       |
| monogram-weave.svg       | M-inspired uprights and an S-inspired inner curve connect structure with conversation.                                                                                                           | Reserve concept; omitted to avoid competing with the header logo.                |
| supported-steps.svg      | Soft linked steps, supported by a parallel gold path, suggest progress from idea to delivery.                                                                                                    | Reserve concept; omitted to avoid repeating the form's existing step navigation. |

## Integration

`packages/ui/src/contact/contact-decorations.tsx` renders the first two concepts as shared inline SVGs on all three Contact pages. These exportable assets preserve the same geometry. Both concepts remain outside the readable form surface, use larger silhouettes, soft gold fills, and restrained opacity, preserve aspect ratio, and never affect layout or receive pointer/keyboard input. The draft prompt and active form share this layer. Small screens retain only the cropped guided-flow corner.

Keep use restrained: one or two motifs per composition. Do not tile all four or add generic icons, sparkles, particles, or decorative motion. Each SVG has a compact viewBox and explicit decorative accessibility attributes; rendered images also use empty alternative text.
