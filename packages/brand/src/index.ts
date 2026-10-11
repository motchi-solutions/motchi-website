export type Branch = "solutions" | "websites" | "consulting";
export const family = {
  solutions: {
    name: "Motchi Solutions",
    domain: "https://motchi.ca",
    description:
      "Practical technology, from the first conversation to ongoing support. Websites, digital systems, AI, and data for your business.",
  },
  websites: {
    name: "Motchi Websites",
    domain: "https://websites.motchi.ca",
    description:
      "Thoughtful websites built around your brand, your customers, and the way your business works.",
  },
  consulting: {
    name: "Motchi Consulting",
    domain: "https://consulting.motchi.ca",
    description:
      "Implementation-focused technology consulting across AI, Databricks, data, digital systems, and adoption.",
  },
} as const;
export const contactEmail = "contact@motchi.ca";
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

export { navigation, publicRoutes } from "./navigation.ts";
