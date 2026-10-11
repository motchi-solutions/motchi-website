import { getSites } from "@motchi/config/env";
import { palette } from "@motchi/brand";
import { ImageResponse } from "next/og";
export const alt = "Solutions by Motchi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function SocialImage() {
  const family = getSites();
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 80,
        background: palette.cream,
        color: palette.charcoal,
        borderTop: `12px solid ${palette.gold}`,
      }}
    >
      <div style={{ display: "flex", fontSize: 30, color: palette.burgundy }}>
        {family.solutions.name}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          letterSpacing: -3,
          maxWidth: 950,
        }}
      >
        {"Technology without the complexity."}
      </div>
      <div style={{ display: "flex", fontSize: 24 }}>
        {family.solutions.url.replace(/^https?:\/\//, "")}
      </div>
    </div>,
    size,
  );
}
