export const capabilities = [
  {
    id: "ai",
    title: "AI Consulting",
    problem: "Where would AI actually help?",
    description:
      "Find where AI can help your team and plan its use around your data and responsibilities. Review provider data use, access controls, and human oversight before integrating it into everyday work.",
    areas: [
      "Opportunity Assessment",
      "Workflow Automation",
      "Internal Tooling",
      "AI Integration",
    ],
  },
  {
    id: "databricks",
    title: "Databricks Consulting",
    problem: "Make the platform work for your team.",
    description:
      "Implement or improve Databricks with data engineering, architecture, and governance shaped around your business. Review access permissions, data ownership, and storage and processing locations as part of the platform plan.",
    areas: [
      "Platform Implementation & Support",
      "Data Engineering",
      "Architecture & Optimization",
      "Governance & Analytics Enablement",
    ],
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    problem: "Get from scattered data to useful answers.",
    description:
      "Connect sources, pipelines, and reporting to the questions your team needs answered. Plan data security, governance, and residency alongside analytics, with clear ownership, access rules, and retention expectations.",
    areas: [
      "Analytics Strategy",
      "Data Pipelines & Platforms",
      "Reporting & Dashboards",
      "Cloud Data Architecture",
    ],
  },
  {
    id: "website-digital",
    title: "Website & Digital Consulting",
    problem: "Connect the customer journey with the work behind it.",
    description:
      "Review how your website, online flows, and internal systems fit together. Simplify the steps that create friction for customers or your team.",
    areas: [
      "Digital Strategy",
      "Customer Journeys",
      "Website Systems",
      "Workflows & Integrations",
    ],
  },
  {
    id: "technology-strategy",
    title: "Technology Strategy",
    problem: "Choose a direction before committing to a platform.",
    description:
      "Clarify requirements, compare the options, and plan a sensible architecture. Make the trade-offs understandable before they become expensive to change.",
    areas: [
      "Requirements",
      "Architecture",
      "Vendor & Platform Evaluation",
      "Modernization",
    ],
  },
  {
    id: "implementation-adoption",
    title: "Implementation & Adoption",
    problem: "Move from an agreed plan to everyday use.",
    description:
      "Build the solution with your team, support the handover, and stay available while people learn to use it. Improve it as the real needs become clearer.",
    areas: [
      "Implementation Planning",
      "Delivery Support",
      "Team Adoption",
      "Continued Improvement",
    ],
  },
] as const;
