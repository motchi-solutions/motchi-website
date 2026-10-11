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
// Replace null with an approved file in the relevant app's public/brand directory.
export const logos: Record<Branch, string | null> = {
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
