type ProductBase = {
  name: string;
  description: string;
  logo?: { src: string; width: number; height: number };
};
export type Product = ProductBase &
  (
    | { status: "Coming soon" | "In development"; url?: never }
    | { status: "Available"; url: string }
  );
// Planned entries supplied by Motchi. No public availability or capabilities are claimed.
export const products: Product[] = [
  {
    name: "Pop Tips",
    logo: { src: "/products/pop-tips/logo.png", width: 1254, height: 1254 },
    description:
      "A little curiosity, a splash of colour, and something fun on the way. Explore a few hints while we bring Pop Tips to life.",
    status: "Coming soon",
  },
  {
    name: "Our Next Chapter",
    description:
      "A new idea for our community is taking shape behind the scenes. We're keeping the details close for now, but we can't wait to share more.",
    status: "Coming soon",
  },
];
