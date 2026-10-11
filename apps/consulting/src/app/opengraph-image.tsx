import { family, palette } from "@motchi/brand";
import { ImageResponse } from "next/og";
export const alt = "Consulting by Motchi";
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
        {family.consulting.name}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          letterSpacing: -3,
          maxWidth: 950,
        }}
      >
        {"From business problem to working solution."}
      </div>
      <div style={{ display: "flex", fontSize: 24 }}>
        {family.consulting.domain.replace("https://", "")}
      </div>
    </div>,
    size,
  );
}
