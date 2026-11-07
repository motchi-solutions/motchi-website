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
      "Plan the pages, content, and a responsive design that fits your business.",
      "Build and review the pages and steps your customers will use.",
    ],
  },
  {
    id: "booking-integrations",
    title: "Booking & Integrations",
    summary:
      "Connect booking, enquiries, and purchases with the tools behind your business.",
    details: [
      "Plan the steps customers take and how booking or enquiry details reach your team.",
      "Connect the tools we agree on and explain which accounts and access are needed.",
    ],
  },
  {
    id: "continued-support",
    title: "Maintenance & Ongoing Care",
    summary:
      "Keep running your business while we take care of the agreed website maintenance, updates, and technical support.",
    details: [
      "Check accessibility, loading speed, and basic search setup before launch.",
      "Choose a care plan for hosting, routine maintenance, and content updates. We explain the costs and when to expect a response.",
    ],
  },
] satisfies WebsiteService[];
