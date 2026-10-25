import type { ProcessStep } from "@motchi/ui";
export const processSteps = [
  {
    id: "understand",
    title: "Understand",
    summary: "Tell us what is getting in the way and what you want to achieve.",
    detailHeading: "First, We Listen",
    details: [
      "Tell us about your business, the people doing the work, and what would make their day easier.",
      "You don't need a technical brief. We ask clear questions and work out the priorities together.",
      "We agree on what success should look like, so the project starts with a shared goal.",
    ],
  },
  {
    id: "plan",
    title: "Plan",
    summary:
      "Understand the options, costs, and next steps before work begins.",
    detailHeading: "Know What You're Agreeing To",
    details: [
      "We explain the practical options and trade-offs in plain language, including how they fit your budget and existing tools.",
      "Together, we agree on the scope, responsibilities, and review points, so you know what is included.",
      "If priorities change, we discuss the impact with you before changing the plan.",
    ],
  },
  {
    id: "build",
    title: "Build",
    summary: "Stay involved as the plan becomes a working solution.",
    detailHeading: "See the Progress, Shape the Result",
    details: [
      "We build and connect the agreed solution, with opportunities for your team to review the work and give feedback.",
      "We check the tasks your team will use, so the solution fits the way your business works.",
      "Clear handover notes and practical guidance help your team feel ready to use what we deliver.",
    ],
  },
  {
    id: "support",
    title: "Support",
    summary: "Know who to turn to after launch and as your needs change.",
    detailHeading: "Support Beyond the Launch",
    details: [
      "Before handover, we agree on maintenance, support responsibilities, and what ongoing help is included.",
      "As your team starts using the solution, we help work through questions and issues within the agreed support scope.",
      "As your business changes, we review what is working and plan improvements around your priorities.",
    ],
  },
] satisfies ProcessStep[];
