import type { Branch } from "@motchi/brand";

export const sites = {
  solutions: {
    name: "Motchi Solutions",
    shortName: "Solutions",
    localUrl: "http://localhost:3000",
    url: "https://motchi.ca",
    description:
      "Accessible, practical technology for businesses worldwide. Websites, consulting, and products in development, with support from planning to delivery.",
  },
  websites: {
    name: "Motchi Websites",
    shortName: "Websites",
    localUrl: "http://localhost:3001",
    url: "https://websites.motchi.ca",
    description:
      "Website design and development shaped by your business. Distinct identities, clear customer journeys, booking, and connected digital workflows.",
  },
  consulting: {
    name: "Motchi Consulting",
    shortName: "Consulting",
    localUrl: "http://localhost:3002",
    url: "https://consulting.motchi.ca",
    description:
      "AI, Databricks, data and analytics, and technology strategy. Practical consulting with implementation and adoption support.",
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

export const websiteStarter = {
  price: "CAD $149",
  description:
    "A focused one-page website using your supplied text and images, with responsive design and a simple contact link.",
  terms:
    "Final scope and revision allowance are agreed before work begins. Extra pages, booking, payments, and integrations are quoted separately. Applicable taxes, domain, hosting, and ongoing care are additional.",
} as const;
