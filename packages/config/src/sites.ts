import type { Branch } from "@motchi/brand";

export const sites = {
  solutions: {
    name: "Motchi Solutions",
    shortName: "Solutions",
    localUrl: "http://localhost:3000",
    url: "https://motchi.ca",
    description:
      "Practical technology, from the first conversation to ongoing support. Websites, digital systems, AI, and data for your business.",
  },
  websites: {
    name: "Motchi Websites",
    shortName: "Websites",
    localUrl: "http://localhost:3001",
    url: "https://websites.motchi.ca",
    description:
      "Thoughtful websites built around your brand, your customers, and the way your business works.",
  },
  consulting: {
    name: "Motchi Consulting",
    shortName: "Consulting",
    localUrl: "http://localhost:3002",
    url: "https://consulting.motchi.ca",
    description:
      "Implementation-focused technology consulting across AI, Databricks, data, digital systems, and adoption.",
  },
} as const;
export const organization = {
  displayName: sites.solutions.name,
  contactEmail: "contact@motchi.ca",
  country: "Canada",
  countryCode: "CA",
  location: "Toronto",
  locationLabel: "Toronto, Canada",
  serviceRegion: "Working with businesses globally",
} as const;
export const contactEmail = organization.contactEmail;

export type SiteConfig = {
  name: string;
  shortName: string;
  url: string;
  localUrl: string;
  description: string;
};
export type Sites = Record<Branch, SiteConfig>;
