export const capabilityContent = [
  {
    name: "Websites",
    heading: "A Website That Works for You",
    detail:
      "Help customers understand your business and take the next step, from an enquiry to a booking.",
    scope: [
      "Clear structure, responsive design, and a straightforward path to enquire or book.",
      "Support from planning and launch through ongoing improvements.",
    ],
    action: "Discuss Your Website",
    interest: "Websites",
  },
  {
    name: "AI",
    heading: "Put AI to Practical Use",
    detail:
      "Find where AI can help your team, choose a suitable approach, and put it to work with clear safeguards.",
    scope: [
      "Identify useful tasks and assess whether AI is a suitable fit.",
      "Plan implementation, safeguards, and adoption with your team.",
    ],
    action: "Talk About AI",
    interest: "AI",
  },
  {
    name: "Data",
    heading: "Make Your Data Useful",
    detail:
      "Bring information together so your team can see what matters and make better-informed decisions.",
    scope: [
      "Connect and organise information from the tools you use.",
      "Build useful reporting and help your team understand the results.",
    ],
    action: "Discuss Your Data",
    interest: "Data",
  },
  {
    name: "Cloud",
    heading: "Keep Your Systems Manageable",
    detail:
      "Choose, connect, and improve the platforms your business relies on, with support as your needs change.",
    scope: [
      "Review your platforms, integrations, and everyday setup.",
      "Plan practical improvements and support your team as systems change.",
    ],
    action: "Discuss Your Systems",
    interest: "Cloud",
  },
  {
    name: "Automation",
    heading: "Spend Less Time on Repetitive Work",
    detail:
      "Connect the tools you already use and simplify routine tasks so your team can focus on the work that needs them.",
    scope: [
      "Find repetitive steps, handoffs, and avoidable manual work.",
      "Connect suitable tools, test the workflow, and help your team use it.",
    ],
    action: "Talk About Automation",
    interest: "Automation",
  },
] as const;
export function resolveCapability(topic?: string) {
  return capabilityContent.find((item) => item.name === topic);
}
