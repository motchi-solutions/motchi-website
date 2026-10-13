# Icons and App Metadata

Every app owns its supplied assets. No artwork is recreated or shared across app identities.

| Location in each app                  | Role                                          |
| ------------------------------------- | --------------------------------------------- |
| `src/app/favicon.ico`                 | Browser fallback with 16, 32, and 48px images |
| `src/app/icon.svg`                    | Primary scalable icon                         |
| `src/app/apple-icon.png`              | 180×180 Apple touch icon                      |
| `public/web-app-manifest-192x192.png` | 192×192 manifest icon                         |
| `public/web-app-manifest-512x512.png` | 512×512 manifest icon                         |
| `src/app/manifest.ts`                 | Typed manifest at `/manifest.webmanifest`     |
| `src/app/opengraph-image.tsx`         | Server-generated 1200×630 social preview      |

Next discovers icons and social images through file conventions; layouts do not add duplicate icon links. Both manifest PNGs use `purpose: "any"`. No supplied file is identified as maskable, so none is labelled maskable. Add a separately approved maskable asset if needed; do not relabel the existing artwork.

Manifest names are Motchi Solutions / Motchi Websites / Motchi Consulting; short names are Motchi / Websites / Consulting. All use `/` as identity, scope, and start URL, standalone display, cream background, and burgundy theme. A manifest does not provide offline functionality; no service worker is installed.

Replace assets in place using the same names and correct dimensions. Recheck browser tabs and home-screen icons; cached installed icons may require removing and adding the shortcut again. Header logos in `public/brand/` are intentionally separate assets.

Metadata domains come from the existing server-resolved site configuration. Public sitemaps include canonical pages, not `/businesses`, which redirects to `/services`. No invented modification dates, reviews, addresses, or ratings are emitted.

References: [Next icon conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons), [Next manifests](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest).
