export type WebsiteService = {
  id: string;
  title: string;
  summary: string;
  details: readonly string[];
};
export const services = [
  {
    id: "design-development",
    title: "Design & Content",
    summary:
      "Design, words, and visuals shaped around your brand. Clear, responsive layouts that work on phones, tablets, and desktops.",
    details: [
      "Plan the pages and customer journey, with clear navigation and content that sounds like your business.",
      "Create responsive layouts around your brand, photographs, and content. We agree on who writes, supplies, and approves each part.",
    ],
  },
  {
    id: "full-stack-websites",
    title: "Full-Stack Websites",
    summary:
      "We build the pages customers see and the systems behind them, from bookings and reservations to menu management and custom features.",
    details: [
      "Build the customer-facing website alongside the server-side features, data, and management tools your project needs.",
      "Plan and test the whole experience, from a customer's first visit to how your team receives and manages their request.",
    ],
  },
  {
    id: "booking-integrations",
    title: "Connected Tools & Workflows",
    summary:
      "Connect your website to the tools you already use, so enquiries, bookings, and payments reach the right place.",
    details: [
      "Connect the agreed booking, reservation, payment, or business tools, and explain which accounts and access are needed.",
      "Make the handoff between your website and your team easier, with custom integrations where existing tools don't quite fit.",
    ],
  },
  {
    id: "continued-support",
    title: "Maintenance & Support",
    summary:
      "Keep your website up to date after launch, with content changes, technical upkeep, and support as your business grows.",
    details: [
      "Check accessibility, loading speed, and basic search setup before launch, with a handover that helps you use your website.",
      "Agree on hosting, maintenance, and ongoing support. We explain what's covered, what it costs, and when to expect a response.",
    ],
  },
] satisfies WebsiteService[];
