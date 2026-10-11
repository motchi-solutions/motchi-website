# Media assets

Use authentic, approved assets. No client screenshots, logos, project photography, or monograms have been invented. Current portfolio imagery and favicon remain placeholders. Assets belong to each deployed app's public folder; paths in configuration begin at `/`.

## Exact locations

```text
apps/solutions/public/brand/ms-logo.svg
apps/websites/public/brand/mw-logo.svg
apps/consulting/public/brand/mc-logo.svg

# For the family intro, copy all three approved marks into EVERY app:
apps/<branch>/public/brand/ms-logo.svg
apps/<branch>/public/brand/mw-logo.svg
apps/<branch>/public/brand/mc-logo.svg

apps/websites/public/media/projects/
  vietbites/
  vee-nails/
  lai-project/
  kamanda/
    desktop.webp
    mobile.webp
    logo.svg
    hero.webp
    preview.webm
    preview.mp4
    preview-poster.webp
    preview.gif
```

The final filenames under `kamanda/` illustrate the same optional files supported in every project folder. PNG/JPEG/SVG are also supported where appropriate; change the configured path to match. Keep all currently absent fields absent instead of pointing at missing files. Approved favicons replace each app's `src/app/icon.svg`; do not use the temporary circle as finalized brand artwork.

## Logos

Use clean SVG with a correct viewBox, no scripts, embedded credentials, or external references. A transparent PNG at 256×256 or larger is a fallback for a square monogram. Preserve intrinsic aspect ratio. In `packages/brand/src/index.ts`, replace the matching null slot:

```ts
solutions: { src: "/brand/ms-logo.svg", width: 64, height: 64 }
// websites uses /brand/mw-logo.svg; consulting uses /brand/mc-logo.svg.
```

`BranchMark` preserves the page structure and gives the link its full branch name; the approved artwork is decorative within that labelled link. No replacement M is drawn in code.

## Introduction

The intro uses CSS transforms, opacity, and a clipping reveal. No GIF or video is needed. It shows the three family identities, lets the current branch grow toward the centre, then reveals the existing page underneath. It never owns or delays the actual page content. Pointer, keyboard, and scroll input dismiss it immediately; reduced motion, unavailable session storage, late hydration, and repeat visits skip it. Its maximum duration is 1.6 seconds.

Set `introLogos` in `packages/brand/src/index.ts` to the three approved SVG/PNG assets. Each app must contain all three files at the same public paths because each deploys independently. `logos` controls header/footer identity separately. Until assets arrive, the introduction uses plain Motchi wordmarks with branch names, not invented MS/MW/MC artwork. The same-origin, per-tab session policy remains intentional; there is no cross-domain tracking cookie.

## Portfolio configuration

In `apps/websites/src/content/projects.ts`, fill only the assets approved for that project:

```ts
media: {
  desktop: { kind: "image", src: "/media/projects/vietbites/desktop.webp", alt: "Approved description of the VietBites desktop website", width: 1600, height: 1000 },
  mobile: { kind: "image", src: "/media/projects/vietbites/mobile.webp", alt: "Approved description of the VietBites mobile website", width: 430, height: 932 },
  logo: { kind: "image", src: "/media/projects/vietbites/logo.svg", alt: "VietBites", width: 320, height: 120 },
}
```

Dimensions above are recommendations, not claims about existing files. Always use the actual exported dimensions. Prefer desktop screenshots around 1600×1000 and mobile around 430×932. Crop deliberately to show useful parts of the site rather than loading a huge full-page capture. Aim for approximately 150–400KB per still where quality allows. Use WebP/AVIF for photos/screenshots; SVG for approved vector logos.

The primary preview selects `hero`, then `desktop`, then `motion`. A supplied mobile screenshot overlaps the primary preview. A client logo appears only if supplied. Static or photographic hero images use the image asset shape. The `motion` slot supports typed WebM/MP4+poster or GIF+poster assets; use a meaningful visual label. Portfolio video defaults to native controls with preload=none. A GIF shows its poster until the visitor deliberately plays it and can be paused. No giant animated media should load automatically below the fold.

A video asset uses `{ kind: "video", sources: [{ src: "/media/projects/vietbites/preview.webm", type: "video/webm" }], poster: { kind: "image", src: "/media/projects/vietbites/preview-poster.webp", alt: "", width: 1600, height: 1000 }, label: "Website preview" }`. Add an MP4 source for fallback. A GIF uses `{ kind: "gif", src: "/media/projects/vietbites/preview.gif", poster: { ... }, label: "Website preview" }`. Approved animated SVG can be implemented as decorative inline paths with CSS; essential information must stay in normal text and reduced motion must stop animation.

Confirm `url`, optional `caseStudyUrl`, services, description, optional technologies, and `featured`. Current family treatments are `paper`, `burgundy`, or `ink`. Optional `colors: { background, foreground }` must be the client's approved colours with verified contrast; never infer them from an unapproved placeholder.

## Alt text and approval

Describe what the image helps a visitor understand. Do not repeat the heading or invent project results. Redundant decorative logos may use empty alt text. Meaningful video with audio/narration needs captions and a transcript before publication; the current preview components are intended for silent visual demonstrations. Supply approved project links and permission to use every client asset. Review real files at 320px, with reduced motion, images disabled/failed, and keyboard controls before launch.
