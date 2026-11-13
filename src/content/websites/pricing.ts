import { websiteBusiness, websiteStarter } from "../../lib/config/sites.ts";

// Website tiers, shown in the pricing section and described in structured
// data. Prices come from sites.ts so every mention stays in step.
export const tiers = [
  {
    name: "Starter",
    price: websiteStarter.price,
    description:
      "Introduce your business and give visitors a simple way to get in touch.",
    includes: "Built with your supplied text and images.",
    features: [
      "1-3 responsive pages",
      "Accessibility-first design",
      "A simple contact form",
      `${websiteStarter.includedSecurityUpdateYears} year of free security updates`,
    ],
    action: "Start a Project",
  },
  {
    name: "Business",
    price: websiteBusiness.price,
    description:
      "For a growing business ready to connect its website and tools.",
    includes: "Everything in Starter, plus:",
    features: [
      "Tailored page layouts",
      "Booking, reservations, or other tool integrations",
      `${websiteBusiness.includedCareMonths} months of free maintenance included`,
      "SEO setup",
    ],
    action: "Discuss Your Website",
  },
  {
    name: "Advanced",
    price: null,
    description:
      "For custom applications and the systems behind your business.",
    includes: "Everything in Business, plus custom scope:",
    features: [
      "Full-stack development and custom frontend design",
      "Admin pages to manage your platform",
      "Point-of-sale and other tool integrations",
      "Database design and built-in analytics",
      "AI setup, assistants, and chatbots",
    ],
    action: "Plan a Custom Build",
  },
];
