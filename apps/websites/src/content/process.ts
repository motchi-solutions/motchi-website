import type { ProcessStep } from "@motchi/ui";
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
      "Agree on who supplies and approves copy, photographs, and logos.",
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
      "Agree on who handles launch and check the steps customers take on the live site.",
    ],
  },
  {
    id: "support",
    title: "Support",
    detailHeading: "Keep Your Website Useful After Launch",
    summary: "Keep the site useful after it goes live.",
    details: [
      "Agree on hosting, maintenance, handover, and post-launch support.",
      "Make future changes around the needs of your customers and team.",
    ],
  },
] satisfies ProcessStep[];
