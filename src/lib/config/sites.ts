import type { Branch } from "../brand.ts";

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
    localUrl: "http://localhost:3000/websites",
    url: "https://motchi.ca/websites",
    description:
      "Website design and development shaped by your business. Distinct identities, clear customer journeys, booking, and connected digital workflows.",
  },
  consulting: {
    name: "Motchi Consulting",
    shortName: "Consulting",
    localUrl: "http://localhost:3000/consulting",
    url: "https://motchi.ca/consulting",
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

// The free first conversation. Paste the Google Calendar appointment schedule
// booking page link (https://calendar.app.google/...) into `url` to show
// "Book a Free Call" buttons; while it is empty they stay hidden.
export const firstCall = {
  url: "" as string,
  length: "30-minute",
} as const;

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
  includedSecurityUpdateYears: 1,
  description:
    "1-3 responsive pages using your supplied text and images, with accessibility-first design and a simple contact form.",
  terms: "We agree on scope, revisions, and your quote before work starts.",
} as const;

export const websiteBusiness = {
  price: "CAD $449",
  includedCareMonths: 3,
} as const;
