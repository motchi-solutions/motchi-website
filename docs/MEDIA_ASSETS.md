# Media assets

Use authentic, approved assets. No client screenshots, logos, project photography, or monograms have been invented. All four portfolio projects use supplied desktop/mobile screenshots and logos; approved favicon/app-icon assets are integrated separately. Assets belong to each deployed app's public folder; paths in configuration begin at `/`.

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

The final filenames under `kamanda/` illustrate the same optional files supported in every project folder. PNG/JPEG/SVG are also supported where appropriate; change the configured path to match. Keep all currently absent fields absent instead of pointing at missing files. Approved favicons are present in each app's `src/app/`; see [ICONS.md](ICONS.md).

## Logos

SVG is the canonical web format. Preserve the supplied artwork and intrinsic aspect ratio. All three approved marks are present in every app's `public/brand/` directory and configured in `packages/brand/src/index.ts`:

```ts
solutions: { src: "/brand/ms-logo.svg", width: 1095, height: 1095 }
// websites uses /brand/mw-logo.svg; consulting uses /brand/mc-logo.svg.
```

`BranchMark` preserves the page structure and gives the link its full branch name; the approved artwork is decorative within that labelled link. No replacement M is drawn in code.

## Introduction

One full-screen, decorative family overlay is mounted in each app root layout. It plays on each new document or reload, and persists without replay during in-app navigation. Approved SVG marks and a consistent MOTCHI/branch lockup are animated with CSS transforms, opacity, and an expanding radial mask over the page. Total duration is 2.6 seconds. CSS ends the overlay even without hydration; input dismisses it immediately and reduced motion skips it. No GIF/video, session-storage playback record, or loading-page route is used.

## Portfolio configuration

In `apps/websites/src/content/projects.ts`, fill only the assets approved for that project:

```ts
media: {
  desktop: { kind: "image", src: "/media/projects/vietbites/desktop.webp", alt: "Approved description of the VietBites desktop website", width: 1600, height: 1000 },
  mobile: { kind: "image", src: "/media/projects/vietbites/mobile.webp", alt: "Approved description of the VietBites mobile website", width: 430, height: 932 },
  logo: { kind: "image", src: "/media/projects/vietbites/logo.svg", alt: "VietBites", width: 320, height: 120 },
}
```

Dimensions above are recommendations, not claims about existing files. Always use the actual exported dimensions. Prefer desktop screenshots around 1600×1000 and mobile around 430×932. Crop deliberately to show useful parts of the site rather than loading a huge full-page capture. Aim for approximately 150-400KB per still where quality allows. Use WebP/AVIF for photos/screenshots; SVG for approved vector logos.

The primary preview selects `desktop`, then `hero`, then `motion`, then a supplied mobile-only image. A supplied mobile screenshot overlaps the primary preview. A client logo appears only if supplied. Static or photographic hero images use the image asset shape. The `motion` slot supports typed WebM/MP4+poster or GIF+poster assets; use a meaningful visual label. Portfolio video defaults to native controls with preload=none. A GIF shows its poster until the visitor deliberately plays it and can be paused. No giant animated media should load automatically below the fold.

A video asset uses `{ kind: "video", sources: [{ src: "/media/projects/vietbites/preview.webm", type: "video/webm" }], poster: { kind: "image", src: "/media/projects/vietbites/preview-poster.webp", alt: "", width: 1600, height: 1000 }, label: "Website preview" }`. Add an MP4 source for fallback. A GIF uses `{ kind: "gif", src: "/media/projects/vietbites/preview.gif", poster: { ... }, label: "Website preview" }`. Approved animated SVG can be implemented as decorative inline paths with CSS; essential information must stay in normal text and reduced motion must stop animation.

Confirm `url`, optional `caseStudyUrl`, services, description, optional technologies, and `featured`. Screenshots retain their original visual identity. Do not apply Motchi colour treatments or invent client palettes.

## Alt text and approval

Describe what the image helps a visitor understand. Do not repeat the heading or invent project results. Redundant decorative logos may use empty alt text. Meaningful video with audio/narration needs captions and a transcript before publication; the current preview components are intended for silent visual demonstrations. Supply approved project links and permission to use every client asset. Review real files at 320px, with reduced motion, images disabled/failed, and keyboard controls before launch.

## Approved project inventory

All four projects now have desktop and mobile PNG screenshots with measured intrinsic dimensions. VietBites, Vee's Nails, and Lai use `logo.png`; Kamanda uses `logo.svg` (1024-square viewBox). Configuration references these exact filenames. Screenshots retain the client's own colours, with desktop primary and a small mobile overlap. Client logos sit alongside project context and use empty alt text. No project video/GIF/poster is supplied. Public project URLs remain unset until confirmed.

## Product concept artwork

The Products gate reads preview cards from `apps/solutions/src/content/product-concepts.ts`. Each entry supplies a public image path, intrinsic dimensions, a caption, descriptive alternative text, and an optional restrained motion treatment. Images use square, uncropped artwork areas and adapt to the open gate. The album supports pointer/touch dragging, loaded next/previous previews, keyboard browsing, interruptible return motion, and reduced motion.

Pop Tips presents three cards: the user-supplied Hirono mystery image, the user-supplied Labubu silhouette with its yellow background edited to pink, and the existing full pink mystery-box logo. `/products/pop-tips/hirono-mystery.jpeg` is an unchanged copy of the supplied 383×399 JPEG. `/products/pop-tips/labubu-silhouette-pink.webp` is a 398×502 optimized background edit that preserves the black silhouette and original bottom-edge crop. The generated collectible character was removed from the album and public assets in favor of these supplied images.

The supplied logo remains `/products/pop-tips/logo.png`, unchanged, with a one-time gentle CSS wiggle after reveal. Reduced motion disables the wiggle. All active Pop Tips images live in `/products/pop-tips/` with lowercase, descriptive filenames. Unused teaser excerpts have been removed; private source sheets and brand kits are not published.

Our Next Chapter retains its static message and reveals no unconfirmed product features. Switching products or closing the gate cancels transient artwork immediately.
