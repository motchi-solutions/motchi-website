export const capabilityContent = [
  {
    name: "Websites",
    heading: "A website that works for you",
    detail:
      "Reflect your brand and make it easy for customers to get in touch, book, or browse what you offer.",
    scope: [
      "Clear structure, responsive design, and a straightforward path to enquire or book.",
      "Support from planning and launch through ongoing improvements.",
    ],
    action: "Discuss your website",
    interest: "Websites",
    contactHref: "/contact?branch=websites",
  },
  {
    name: "AI",
    heading: "Put AI to practical use",
    detail:
      "Find where AI can save your team time, choose a suitable approach, and put it to work with clear safeguards.",
    scope: [
      "Identify useful tasks and assess whether AI is a suitable fit.",
      "Plan implementation, safeguards, and adoption with your team.",
    ],
    action: "Talk about AI",
    interest: "AI",
    contactHref: "/contact?branch=consulting&topic=AI",
  },
  {
    name: "Data",
    heading: "Make your data useful",
    detail:
      "Bring information together securely, so your team can see what matters and make better-informed decisions.",
    scope: [
      "Connect and organise information from the tools you use.",
      "Build useful reporting and help your team understand the results.",
    ],
    action: "Discuss your data",
    interest: "Data",
    contactHref: "/contact?branch=consulting&topic=Data",
  },
  {
    name: "Cloud",
    heading: "Keep your systems manageable",
    detail:
      "Choose, maintain, and improve the platforms your business runs on, so they stay reliable, scalable, and secure.",
    scope: [
      "Review your platforms, integrations, and everyday setup.",
      "Plan practical improvements and support your team as systems change.",
    ],
    action: "Discuss your systems",
    interest: "Cloud",
    contactHref: "/contact?branch=consulting",
  },
  {
    name: "Automation",
    heading: "Spend less time on repetitive work",
    detail:
      "Simplify routine tasks and connect your tools, so your team can focus on the work that needs them.",
    scope: [
      "Find repetitive steps, handoffs, and avoidable manual work.",
      "Connect suitable tools, test the workflow, and help your team use it.",
    ],
    action: "Talk about automation",
    interest: "Automation",
    contactHref: "/contact?branch=consulting",
  },
] as const;
export function resolveCapability(topic?: string) {
  return capabilityContent.find((item) => item.name === topic);
}
