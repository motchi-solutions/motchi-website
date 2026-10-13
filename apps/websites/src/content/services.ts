export type WebsiteService = {
  id: string;
  title: string;
  summary: string;
  details: readonly string[];
};
export const services = [
  {
    id: "design-development",
    title: "Design & Development",
    summary:
      "A new website or a redesign that reflects your business and helps customers find what they need.",
    details: [
      "Page structure, content planning, and responsive visual design.",
      "Development and review of the agreed pages and customer journeys.",
    ],
  },
  {
    id: "booking-integrations",
    title: "Booking & Integrations",
    summary:
      "Connect booking, enquiries, and purchases with the tools behind your business.",
    details: [
      "Plan the steps customers take and how booking or enquiry details reach your team.",
      "Implement the agreed integrations with clear ownership and access requirements.",
    ],
  },
  {
    id: "continued-support",
    title: "Performance & Support",
    summary:
      "Accessibility, performance, and SEO foundations, with support after launch.",
    details: [
      "Review agreed accessibility, performance, and search foundations before launch.",
      "Agree on hosting, maintenance, and what support is included after launch.",
    ],
  },
] satisfies WebsiteService[];
