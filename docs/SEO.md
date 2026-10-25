# SEO

Each app uses a distinct family name, domain, description, metadataBase, Open Graph defaults, and Twitter/X summary card. Home, focused content routes, contact, and privacy define their own canonicals. Focused routes use `pageMetadata` for matching page/social titles, descriptions, and canonical URLs. Contact result query strings are noindexed and canonicalize to `/contact`. Never use a blanket home canonical in the root layout for every route.

`robots.ts` allows production content and disallows API crawling. `sitemap.ts` lists real page routes only. It omits fake modification dates. New public pages must be added deliberately. Robots is not access control; use hosting restrictions/noindex headers for previews.

`opengraph-image.tsx` generates a branded 1200×630 PNG using Next ImageResponse and family palette, without downloading fonts. Approved per-app favicon, SVG, and Apple touch assets are discovered by Next file conventions. Typed manifests reference the supplied 192px/512px PNGs with ordinary icon purpose. See [ICONS.md](ICONS.md). Set explicit image alternative text when adding portfolio screenshots.

Solutions emits Organization JSON-LD. Branches emit ProfessionalService with a parent Organization reference. No ratings, awards, address, certifications, reviews, or client outcomes are invented. If the business does not fit a schema type after operational review, change it rather than retaining misleading data. Approved branch logo URLs resolve from each site origin. Application names, publisher/creator identity, compact Apple home-screen titles, and burgundy viewport theme are configured centrally.

Before launch: inspect rendered title/description/canonical, robots, sitemap, social image routes, icon, and JSON-LD. Validate structured data, verify Google Search Console/Bing site ownership, and submit each sitemap. Confirm permanent canonical-domain redirects and HTTPS. Review actual performance in a browser and collect field Core Web Vitals after sufficient traffic; do not publish unmeasured scores.

Official metadata documentation: https://nextjs.org/docs/app/api-reference/functions/generate-metadata

All URL-bearing metadata now resolves through `getSites()`. Production defaults live in `packages/config/src/sites.ts`; server-only origin overrides cover staging/local deployments. Noncanonical origins are noindexed and disallowed in robots. Set overrides consistently at build and runtime, since marketing HTML can be statically generated. Do not use noindex as authentication.
