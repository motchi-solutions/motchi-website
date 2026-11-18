import type { ProcessStep } from "../process-step.ts";
export const processSteps = [
  {
    id: "discover",
    title: "Discover",
    detailHeading: "Start with your business and customers",
    summary: "Talk about your customers, goals, and what to build.",
    details: [
      "Talk through your business, brand, existing website, and customer needs.",
      "Identify the main visitor actions and agree on what is included.",
    ],
  },
  {
    id: "structure",
    title: "Structure",
    detailHeading: "Give every page a clear purpose",
    summary: "Make the pages and customer journey clear.",
    details: [
      "Plan the pages, menus, and steps customers need to take.",
      "Map how your content, navigation, and connected tools fit together.",
    ],
  },
  {
    id: "design",
    title: "Design",
    detailHeading: "Make it feel like your business",
    summary: "Choose a look that reflects your business.",
    details: [
      "Design responsive layouts for your pages and the steps customers take.",
      "Review the design together before we start building.",
    ],
  },
  {
    id: "develop",
    title: "Develop",
    detailHeading: "Turn the design into a working website",
    summary: "Build and review the working website.",
    details: [
      "Build the pages and agreed booking, enquiry, or connected tools.",
      "Check accessibility, performance, and the flows customers will use.",
    ],
  },
  {
    id: "launch",
    title: "Launch",
    detailHeading: "Check the details before going live",
    summary: "Prepare the content, domain, and connected tools.",
    details: [
      "Check the content, forms, search details, links, and domain setup.",
      "Follow the agreed launch plan and check the steps customers take on the live site.",
    ],
  },
  {
    id: "support",
    title: "Support",
    detailHeading: "Keep your website useful after launch",
    summary: "Keep the site useful after it goes live.",
    details: [
      "Hand over the site and follow the hosting, maintenance, and support plan agreed at the start.",
      "Make future changes around the needs of your customers and team.",
    ],
  },
] satisfies ProcessStep[];
