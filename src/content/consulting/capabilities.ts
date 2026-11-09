/* Each capability names the contact service it preselects, so the page and
   the enquiry wizard stay in step. Services must match contact-config.ts. */
export const capabilities = [
  {
    id: "ai",
    title: "AI Consulting",
    service: "AI Adoption",
    problem: "Where would AI actually help?",
    description:
      "Find where AI can help your team, then plan its use around your data and responsibilities. We review provider data use, access controls, and human oversight before it reaches everyday work.",
    areas: [
      "Opportunity Assessment",
      "Workflow Automation",
      "Internal Tooling",
      "AI Integration",
    ],
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    service: "Data & Analytics",
    problem: "Get from scattered data to useful answers.",
    description:
      "Connect sources, pipelines, and reporting to the questions your team needs answered. Security, governance, and data residency are planned alongside the analytics.",
    areas: [
      "Analytics Strategy",
      "Data Pipelines & Platforms",
      "Reporting & Dashboards",
      "Cloud Data Architecture",
    ],
  },
  {
    id: "databricks",
    title: "Databricks Consulting",
    service: "Databricks",
    problem: "Make the platform work for your team.",
    description:
      "Implement or improve Databricks with data engineering, architecture, and governance shaped around your business, including access, ownership, and where data is stored and processed.",
    areas: [
      "Platform Implementation & Support",
      "Data Engineering",
      "Architecture & Optimization",
      "Governance & Analytics Enablement",
    ],
  },
  {
    id: "technology-strategy",
    title: "Technology Strategy",
    service: "Technology Strategy",
    problem: "Choose a direction before committing to a platform.",
    description:
      "Clarify requirements, compare the options, and plan a sensible architecture. We make the trade-offs clear before they become expensive to change.",
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
    service: "Implementation & Adoption",
    problem: "Move from an agreed plan to everyday use.",
    description:
      "Build the solution with your team, support the handover, and stay available while people learn to use it. We keep improving it as real needs become clearer.",
    areas: [
      "Implementation Planning",
      "Delivery Support",
      "Team Adoption",
      "Continued Improvement",
    ],
  },
  {
    id: "website-digital",
    title: "Website & Digital",
    service: "Website & Digital",
    problem: "Connect the customer journey with the work behind it.",
    description:
      "Review how your website, online flows, and internal systems fit together, then simplify the steps that slow down customers or your team.",
    areas: [
      "Digital Strategy",
      "Customer Journeys",
      "Website Systems",
      "Workflows & Integrations",
    ],
  },
] as const;
