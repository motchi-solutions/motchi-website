export type ProductSketch = {
  title: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  tone?: "blush" | "lavender" | "cream";
};
// Public teasers contain only selected details, never the original brand sheets.
export const productSketches: Record<string, readonly ProductSketch[]> = {
  "Pop Tips": [
    {
      title: "A little sparkle",
      src: "/products/pop-tips-teasers/sparkle.png",
      width: 198,
      height: 171,
      alt: "Two glossy pink sparkles from the Pop Tips artwork",
      tone: "blush",
    },
    {
      title: "A playful hello",
      src: "/products/pop-tips-teasers/hello.png",
      width: 264,
      height: 194,
      alt: "A soft pink chat bubble with three dots",
      tone: "lavender",
    },
    {
      title: "Just a hint",
      src: "/products/pop-tips-teasers/wordmark.png",
      width: 440,
      height: 164,
      alt: "The word POP, a small detail from the Pop Tips wordmark",
      tone: "cream",
    },
  ],
  "Our Next Chapter": [],
};
