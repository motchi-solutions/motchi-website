import type { ProcessStep } from "@motchi/ui";
export const processSteps = [
  {
    id: "understand",
    title: "Understand",
    summary: "Start with the business and the problem behind the request.",
    details: [
      "Listen to the people doing the work and map the current process.",
      "Agree on what needs to change and what a useful outcome looks like.",
    ],
  },
  {
    id: "plan",
    title: "Plan",
    summary: "Agree on an appropriate approach, scope, and responsibilities.",
    details: [
      "Assess existing systems, constraints, cost, and practical options.",
      "Design the solution and agree on the work before committing to tools.",
    ],
  },
  {
    id: "build",
    title: "Build",
    summary: "Implement the solution with your team involved.",
    details: [
      "Build, configure, and integrate the agreed solution; review it together.",
      "Prepare documentation and help people adopt it in their daily work.",
    ],
  },
  {
    id: "support",
    title: "Support",
    summary: "Stay available and improve the solution as needs change.",
    details: [
      "Agree on maintenance, handover, and a useful level of ongoing support.",
      "Review how it works in practice and make proportionate improvements.",
    ],
  },
] satisfies ProcessStep[];
