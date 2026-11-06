export const capabilityContent = [
  {
    name: "Websites",
    heading: "A Website That Works for You",
    detail:
      "We help you create a digital presence that reflects your brand and helps you connect with your audience, whether through a contact form, a booking system, or a product showcase.",
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
      "We help you identify where AI can help your team, choose a suitable approach, and put it to work with clear safeguards; saving time and resources.",
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
      "We help you bring information together securely, so your team can see what matters and make better-informed decisions.",
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
      "We help you choose, maintain, and improve the platforms your business is built on, ensuring the reliability, scalability, and security of your systems and operations.",
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
      "We help you simplify routine tasks and streamline your workflow so your team can focus on the work that needs them, improving efficiency and productivity.",
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
