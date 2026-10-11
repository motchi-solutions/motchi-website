import { family, palette } from "@motchi/brand";
import { ImageResponse } from "next/og";
export const alt = "Websites by Motchi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function SocialImage() {
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
        {family.websites.name}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          letterSpacing: -3,
          maxWidth: 950,
        }}
      >
        {"Websites with your business in mind."}
      </div>
      <div style={{ display: "flex", fontSize: 24 }}>
        {family.websites.domain.replace("https://", "")}
      </div>
    </div>,
    size,
  );
}
