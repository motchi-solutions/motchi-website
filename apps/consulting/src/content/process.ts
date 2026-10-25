import type { ProcessStep } from "@motchi/ui";
export const engagement = [
  {
    id: "understand",
    title: "Understand",
    detailHeading: "Get Clear on the Business Need",
    summary: "Agree on the business problem and desired outcome.",
    details: [
      "Listen to stakeholders and the people doing the work.",
      "Map the current process and agree on what needs to change.",
    ],
  },
  {
    id: "assess",
    title: "Assess",
    detailHeading: "Understand Your Options and Constraints",
    summary: "Review systems, constraints, risks, and opportunities.",
    details: [
      "Understand the current platforms, data, dependencies, and responsibilities.",
      "Compare practical options against cost, risk, and available capacity.",
    ],
  },
  {
    id: "design",
    title: "Design",
    detailHeading: "Agree on a Practical Plan",
    summary: "Plan the solution and the work needed to deliver it.",
    details: [
      "Set out architecture, integration points, and an implementation plan.",
      "Agree on responsibilities, review points, and what is in scope.",
    ],
  },
  {
    id: "implement",
    title: "Implement",
    detailHeading: "Build It With Your Team Involved",
    summary: "Build, configure, and integrate the agreed solution.",
    details: [
      "Work through implementation with your team involved in key decisions.",
      "Review the working solution and check the agreed business flows.",
    ],
  },
  {
    id: "adopt",
    title: "Adopt",
    detailHeading: "Help Your Team Feel Ready",
    summary: "Help people bring the solution into daily work.",
    details: [
      "Prepare documentation, handover, and guidance appropriate to the team.",
      "Support training and workflow integration, with room for questions.",
    ],
  },
  {
    id: "support",
    title: "Support",
    detailHeading: "Know Where to Turn for Help",
    summary: "Stay available after delivery under an agreed scope.",
    details: [
      "Agree on maintenance, troubleshooting, and support responsibilities.",
      "Help resolve issues and answer the questions that follow real use.",
    ],
  },
  {
    id: "improve",
    title: "Improve",
    detailHeading: "Keep Improving What Matters",
    summary: "Refine the solution based on what happens in practice.",
    details: [
      "Review how the solution serves the business and where friction remains.",
      "Prioritize improvements as needs, workflows, and capacity change.",
    ],
  },
] satisfies ProcessStep[];
