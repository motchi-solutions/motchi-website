type ProductBase = { name: string; description: string };
export type Product = ProductBase &
  (
    | { status: "Coming soon" | "In development"; url?: never }
    | { status: "Available"; url: string }
  );
// Planned entries supplied by Motchi. No public availability or capabilities are claimed.
export const products: Product[] = [
  {
    name: "Pop Tips",
    description:
      "A planned Motchi product. Details will be shared when there is more to explore.",
    status: "Coming soon",
  },
  {
    name: "Motchi Verify / MTV",
    description:
      "Part of our future product direction. Scope and launch details are still to be confirmed.",
    status: "Coming soon",
  },
];
