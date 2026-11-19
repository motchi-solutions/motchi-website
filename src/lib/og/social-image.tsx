import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { type Branch, logos, palette } from "../brand.ts";
import { getSites } from "../config/env.ts";

/* Shared social preview card (Open Graph and X) for every service branch.
   One frame: the header lockup, the branch's hero headline, and the hero
   ribbon, which turns into a footer band carrying the address. The renderer
   needs TTF/OTF files, so Source Sans 3 (SIL OFL, see fonts/OFL.md) is
   bundled here; the site itself loads it through next/font. */

export const socialImageSize = { width: 1200, height: 630 };
export const socialImageType = "image/png";

// Approved hero headlines (src/components/**/hero.tsx). Explicit lines keep
// two-phrase headlines on two lines; longer ones wrap within the column.
const headlines: Record<Branch, string[]> = {
  solutions: ["Websites and smart systems for growing businesses"],
  websites: ["Websites built around your business"],
  consulting: ["Technology advice.", "Hands-on support."],
};

export function socialImageAlt(branch: Branch) {
  return `${getSites()[branch].name}: ${headlines[branch].join(" ")}`;
}

const root = process.cwd();
const font = (file: string) => readFile(join(root, "src/lib/og/fonts", file));

/* The homepage hero's ribbon (src/components/capability-thread.tsx), drawn in
   its own 1440x1000 artwork units and scaled evenly into the card so the S
   keeps the hero's exact curves. Measured from the hero at desktop sizes: the
   ribbon is about 126 units wide with the gold offset at (22, 16). */
const ribbon =
  "M1160 -160V100C1160 285 870 210 870 385S1240 505 1240 640S1000 780 760 780H-180";
// The first two-thirds of the opening sweep, where the hero's gold line rests.
const trace = "M1160 100C1160 224 1030 231 944 275";
const ribbonWidth = 126;
const ribbonScale = 0.845;
// Card position of artwork point (0, 0): the top of the opening sweep meets
// the card's top edge and the gold offset ends just inside the right edge.
const ribbonOrigin = { x: 68, y: -97 };
// The ribbon's final run becomes the footer band carrying the address.
const bandTop = ribbonOrigin.y + (780 - ribbonWidth / 2) * ribbonScale;
const bandHeight = ribbonWidth * ribbonScale;

export async function renderSocialImage(branch: Branch) {
  const site = getSites()[branch];
  const logo = logos[branch];
  const [medium, semibold, mark] = await Promise.all([
    font("SourceSans3-Medium.ttf"),
    font("SourceSans3-Semibold.ttf"),
    logo ? readFile(join(root, "public", logo.src)) : null,
  ]);
  const lines = headlines[branch];
  const address = site.url.replace(/^https?:\/\//, "");

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        background: palette.cream,
        color: palette.charcoal,
        fontFamily: "Source Sans 3",
      }}
    >
      <svg
        aria-hidden="true"
        width={socialImageSize.width}
        height={socialImageSize.height}
        viewBox={`0 0 ${socialImageSize.width} ${socialImageSize.height}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <g
          transform={`translate(${ribbonOrigin.x} ${ribbonOrigin.y}) scale(${ribbonScale})`}
        >
          <path
            d={ribbon}
            transform="translate(22 16)"
            fill="none"
            stroke={palette.gold}
            strokeWidth={ribbonWidth}
          />
          <path
            d={ribbon}
            fill="none"
            stroke={palette.burgundy}
            strokeWidth={ribbonWidth}
          />
          <path
            d={trace}
            fill="none"
            stroke={palette.gold}
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        </g>
      </svg>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: 64,
          left: 72,
          width: 640,
          // Lockup at the top; the headline centred in the space above the band.
          height: bandTop - 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {mark && (
            // biome-ignore lint/performance/noImgElement: rendered by next/og, not the page.
            <img
              src={`data:image/svg+xml;base64,${mark.toString("base64")}`}
              width={96}
              height={96}
              alt=""
            />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 50,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              MOTCHI
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 12,
                paddingLeft: 14,
                borderLeft: `3px solid ${palette.gold}`,
                fontSize: 30,
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                color: palette.burgundy,
              }}
            >
              {site.shortName}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: 8,
            fontSize: 76,
            fontWeight: 500,
            lineHeight: 1.04,
            letterSpacing: "-0.045em",
            color: palette.burgundy,
          }}
        >
          {lines.map((line) => (
            <div key={line} style={{ display: "flex" }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          left: 72,
          top: bandTop,
          height: bandHeight,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: "0.01em",
          color: palette.cream,
        }}
      >
        {address}
      </div>
    </div>,
    {
      ...socialImageSize,
      fonts: [
        { name: "Source Sans 3", data: medium, weight: 500, style: "normal" },
        { name: "Source Sans 3", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
