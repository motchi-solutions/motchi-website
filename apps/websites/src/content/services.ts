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
      "New websites and considered redesigns, built around your brand and customers.",
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
      "Map the customer flow and agree on the tools and handover points.",
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
      "Discuss hosting, maintenance, and future changes as explicit parts of the scope.",
    ],
  },
] satisfies WebsiteService[];
