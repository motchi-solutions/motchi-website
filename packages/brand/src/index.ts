export type Branch = "solutions" | "websites" | "consulting";
export type ImageAsset = {
  kind: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
};
export type VideoAsset = {
  kind: "video";
  sources: { src: string; type: "video/webm" | "video/mp4" }[];
  poster: ImageAsset;
  label: string;
};
export type GifAsset = {
  kind: "gif";
  src: string;
  poster: ImageAsset;
  label: string;
};
export type MediaAsset = ImageAsset | VideoAsset | GifAsset;
export type LogoAsset = { src: string; width: number; height: number };
// Approved SVGs resolve locally in every app.
export const logos: Record<Branch, LogoAsset | null> = {
  solutions: { src: "/brand/ms-logo.svg", width: 1095, height: 1095 },
  websites: { src: "/brand/mw-logo.svg", width: 1095, height: 1095 },
  consulting: { src: "/brand/mc-logo.svg", width: 1095, height: 1095 },
};
// The same family assets are available for the existing intro.
export const introLogos = logos;
export const palette = {
  gold: "#D4AF7C",
  burgundy: "#5B0202",
  cream: "#F6F2E9",
  charcoal: "#171313",
} as const;
