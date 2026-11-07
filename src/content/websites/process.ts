import type { ProcessStep } from "../../components/ui/index.ts";
export const processSteps = [
  {
    id: "discover",
    title: "Discover",
    detailHeading: "Start With Your Business and Customers",
    summary: "Talk about your customers, goals, and what to build.",
    details: [
      "Talk through your business, brand, existing website, and customer needs.",
      "Identify the main visitor actions and agree on what is included.",
    ],
  },
  {
    id: "structure",
    title: "Structure",
    detailHeading: "Give Every Page a Clear Purpose",
    summary: "Make the pages and customer journey clear.",
    details: [
      "Plan the pages, menus, and steps customers need to take.",
      "Map how your content, navigation, and connected tools fit together.",
    ],
  },
  {
    id: "design",
    title: "Design",
    detailHeading: "Make It Feel Like Your Business",
    summary: "Choose a look that reflects your business.",
    details: [
      "Design responsive layouts for your pages and the steps customers take.",
      "Review the design together before we start building.",
    ],
  },
  {
    id: "develop",
    title: "Develop",
    detailHeading: "Turn the Design Into a Working Website",
    summary: "Build and review the working website.",
    details: [
      "Build the pages and agreed booking, enquiry, or connected tools.",
      "Check accessibility, performance, and the flows customers will use.",
    ],
  },
  {
    id: "launch",
    title: "Launch",
    detailHeading: "Check the Details Before Going Live",
    summary: "Prepare the content, domain, and connected tools.",
    details: [
      "Check the content, forms, search details, links, and domain setup.",
      "Follow the agreed launch plan and check the steps customers take on the live site.",
    ],
  },
  {
    id: "support",
    title: "Support",
    detailHeading: "Keep Your Website Useful After Launch",
    summary: "Keep the site useful after it goes live.",
    details: [
      "Hand over the site and follow the hosting, maintenance, and support plan agreed at the start.",
      "Make future changes around the needs of your customers and team.",
    ],
  },
] satisfies ProcessStep[];
