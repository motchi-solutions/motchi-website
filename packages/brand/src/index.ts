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
// Approved assets only. Configure these slots after placing files in public/brand/.
export const logos: Record<Branch, LogoAsset | null> = {
  solutions: null,
  websites: null,
  consulting: null,
};
// All three approved marks must be copied into each app's public/brand folder.
export const introLogos: Record<Branch, LogoAsset | null> = {
  solutions: null,
  websites: null,
  consulting: null,
};
export const palette = {
  gold: "#D4AF7C",
  burgundy: "#5B0202",
  cream: "#F4F0E6",
  charcoal: "#171313",
} as const;
