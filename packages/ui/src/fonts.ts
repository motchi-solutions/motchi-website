import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
export const sans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-motchi-sans",
});
export const serif = Source_Serif_4({
  subsets: ["latin"],
  style: "italic",
  display: "swap",
  variable: "--font-motchi-serif",
  preload: false,
});
export const fontVariables = `${sans.variable} ${serif.variable}`;
