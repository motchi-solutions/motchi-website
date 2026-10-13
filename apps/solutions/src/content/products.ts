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
    logo: { src: "/products/pop-tips-logo.png", width: 1254, height: 1254 },
    description:
      "A planned Motchi product. Details will be shared when there is more to explore.",
    status: "Coming soon",
  },
  {
    name: "Age Verification",
    description:
      "An age-verification feature planned under its own independent brand. The name and launch details are still to be confirmed.",
    status: "Coming soon",
  },
];
