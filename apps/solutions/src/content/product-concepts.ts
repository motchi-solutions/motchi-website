export type ProductSketch = {
  title: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  motion?: "wiggle";
  tone?: "blush" | "lavender" | "cream";
};
// User-supplied mystery artwork and the complete product mark; no availability claims.
export const productSketches: Record<string, readonly ProductSketch[]> = {
  "Pop Tips": [
    {
      title: "Meet Pop Tips",
      src: "/products/pop-tips/logo.png",
      width: 1254,
      height: 1254,
      alt: "The complete Pop Tips pink mystery-box logo with its white question mark",
      motion: "wiggle",
      tone: "cream",
    },
    {
      title: "A friend for sad times",
      src: "/products/pop-tips/hirono-mystery.jpeg",
      width: 383,
      height: 399,
      alt: "Mystery artwork with a red question mark, a black frame, and the word FRIEND",
      tone: "cream",
    },
    {
      title: "A familiar shadow",
      src: "/products/pop-tips/labubu-silhouette-pink.webp",
      width: 398,
      height: 502,
      alt: "A black bunny-eared Labubu silhouette on a soft pink background",
      tone: "blush",
    },
  ],
  "Our Next Chapter": [],
};
