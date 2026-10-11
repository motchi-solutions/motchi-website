import type { ProcessStep } from "@motchi/ui";
export const processSteps = [
  {
    id: "discover",
    title: "Discover",
    summary: "Agree on the audience, goals, and scope.",
    details: [
      "Talk through your business, brand, existing website, and customer needs.",
      "Identify the main visitor actions and agree on what is included.",
    ],
  },
  {
    id: "structure",
    title: "Structure",
    summary: "Make the pages and customer journey clear.",
    details: [
      "Plan navigation, page hierarchy, and the steps customers need to take.",
      "Agree on who supplies and approves copy, photographs, and logos.",
    ],
  },
  {
    id: "design",
    title: "Design",
    summary: "Set a visual direction around your identity.",
    details: [
      "Develop layouts for the important pages and mobile customer flows.",
      "Review the design together before development makes changes expensive.",
    ],
  },
  {
    id: "develop",
    title: "Develop",
    summary: "Build and review the working website.",
    details: [
      "Implement the pages and agreed booking, enquiry, or other integrations.",
      "Check accessibility, performance, and the flows customers will use.",
    ],
  },
  {
    id: "launch",
    title: "Launch",
    summary: "Prepare the content, domain, and connected tools.",
    details: [
      "Review final content, forms, metadata, redirects, and domain configuration.",
      "Agree on launch responsibilities and verify the live customer journey.",
    ],
  },
  {
    id: "support",
    title: "Support",
    summary: "Keep the site useful after it goes live.",
    details: [
      "Agree on hosting, maintenance, handover, and post-launch support.",
      "Make future changes around the needs of your customers and team.",
    ],
  },
] satisfies ProcessStep[];
