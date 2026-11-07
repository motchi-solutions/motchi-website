import type { Branch } from "../../../lib/brand.ts";
export const services = [
  "Website",
  "AI Adoption",
  "Data & Analytics",
  "Automation",
  "Cloud / Infrastructure",
  "Technology Advice",
  "Product / Software Idea",
  "Not Sure Yet",
];
export const serviceDescriptions: Record<string, string> = {
  Website:
    "We can help with website design, mobile-friendly layouts, custom features, and integrations.",
  "AI Adoption":
    "We can help you adopt AI for assistants, search, team knowledge, and everyday tasks.",
  "Data & Analytics":
    "We can help connect and clean up data, build reports, and find useful insights.",
  Automation:
    "We can reduce manual work by connecting tools and automating routine steps.",
  "Cloud / Infrastructure":
    "We can help plan a cloud move, estimate or reduce costs, and automate cloud systems.",
  "Technology Advice":
    "We can help you choose tools, platforms, or a technical approach.",
  "Product / Software Idea":
    "We can work with you to turn an idea into an application or digital product.",
  "Not Sure Yet":
    "If you're unsure where to start, we're happy to help you find a starting point.",
};
export const followUps: Record<string, string[]> = {
  Website: [
    "Build a new website",
    "Improve an existing website",
    "Add online booking",
    "Connect my other tools",
    "Get maintenance or support",
    "Not sure",
  ],
  "AI Adoption": [
    "Add an AI assistant",
    "Search team documents",
    "Help with everyday tasks",
    "Explore what's possible",
    "Not sure",
  ],
  "Data & Analytics": [
    "Build reports or dashboards",
    "Connect data from different tools",
    "Clean up inaccurate or duplicate data",
    "Automate data updates",
    "Find trends or answer specific questions",
    "Not sure",
  ],
  Automation: [
    "Connect my tools",
    "Reduce repetitive tasks",
    "Simplify customer bookings or enquiries",
    "Not sure",
  ],
  "Cloud / Infrastructure": [
    "Move to the cloud",
    "Estimate the cost of moving to the cloud",
    "Reduce cloud costs",
    "Automate cloud setup or tasks",
    "Set up hosting",
    "Improve reliability",
    "Get ongoing support",
    "Not sure",
  ],
  "Technology Advice": [
    "Choose tools or a platform",
    "Plan how systems work together",
    "Decide what to improve first",
    "Get help putting a plan into practice",
    "Not sure",
  ],
  "Product / Software Idea": [
    "Explore an idea",
    "Build a first version",
    "Improve an existing product",
    "Not sure",
  ],
};
export const questions = {
  business: {
    label: "Your project or organization",
    options: [
      "Starting something new",
      "Business",
      "Non-profit / community organization",
      "Personal project",
      "Other",
    ],
  },
  stage: {
    label: "Project stage",
    options: [
      "Exploring an idea",
      "I know where to start",
      "I want to improve an existing process",
      "I need ongoing support",
    ],
  },
  budget: {
    label: "Budget range",
    options: [
      "$100-$500",
      "$500-$1,000",
      "$1,000-$2,500",
      "$2,500-$5,000",
      "$5,000-$10,000",
      "$10,000+",
      "Not sure yet",
      "Prefer to discuss",
    ],
  },
  timeline: {
    label: "When would you like to start?",
    options: [
      "As soon as possible",
      "Within a month",
      "1-3 months",
      "3+ months",
      "Flexible / just exploring",
    ],
  },
  source: {
    label: "How did you hear about Motchi?",
    options: [
      "Referral",
      "Online Search",
      "Social media",
      "Existing client/project",
      "Event/community",
      "Other",
    ],
  },
};

export type ContactConfiguration = {
  branch: Branch;
  services: string[];
  serviceDescriptions: Record<string, string>;
  followUps: Record<string, string[]>;
  questions: typeof questions;
  topicAliases: Record<string, string>;
  submissionInterests: Record<string, string>;
  title: string;
  introduction: string;
  projectTitle: string;
};
const configurations: Record<Branch, ContactConfiguration> = {
  solutions: {
    branch: "solutions",
    services,
    serviceDescriptions,
    followUps,
    questions,
    topicAliases: {
      Consulting: "Technology Advice",
      "New Website": "Website",
      "New website": "Website",
      "Website Redesign": "Website",
      "Website redesign": "Website",
      "Booking & Integrations": "Website",
      "Booking or integrations": "Website",
      Maintenance: "Website",
      "Maintenance & Support": "Website",
      Databricks: "Data & Analytics",
      "Data & analytics": "Data & Analytics",
      "Technology Strategy": "Technology Advice",
      "Technology strategy": "Technology Advice",
      "Implementation & Adoption": "Automation",
      "Implementation & adoption": "Automation",
      "Website & Digital": "Website",
      "Website & digital": "Website",
      AI: "AI Adoption",
      Websites: "Website",
      Data: "Data & Analytics",
      Cloud: "Cloud / Infrastructure",
      Products: "Product / Software Idea",
      "Something else": "Not Sure Yet",
    },
    submissionInterests: {
      Website: "Websites",
      "AI Adoption": "AI",
      "Data & Analytics": "Data",
      Automation: "Automation",
      "Cloud / Infrastructure": "Cloud",
      "Technology Advice": "Consulting",
      "Product / Software Idea": "Products",
      "Not Sure Yet": "Something else",
    },
    title: "Let's Explore How We Can Help",
    introduction:
      "Please share what you have in mind. New ideas and organizations are welcome. We can help from planning to delivery.",
    projectTitle: "A little about your project",
  },
  websites: {
    branch: "websites",
    services: [
      "New Website",
      "Website Redesign",
      "Booking & Integrations",
      "Maintenance & Support",
      "Not Sure Yet",
    ],
    serviceDescriptions: {
      "New Website":
        "We can create a mobile-friendly website that helps people understand what you offer and get in touch.",
      "Website Redesign":
        "We can improve your existing website's design, content, accessibility, and experience on mobile.",
      "Booking & Integrations":
        "We can connect your website to bookings, enquiries, payments, and the tools you already use.",
      "Maintenance & Support":
        "We can help keep your website up to date and resolve issues after launch.",
      "Not Sure Yet":
        "We're happy to help you find a practical starting point for your website.",
    },
    followUps: {
      "New Website": [
        "Introduce my business or project",
        "Showcase my work",
        "Help people contact me",
        "Take bookings or requests",
        "Not sure",
      ],
      "Website Redesign": [
        "Refresh the design",
        "Improve the mobile experience",
        "Make content easier to find",
        "Improve accessibility or performance",
        "Not sure",
      ],
      "Booking & Integrations": [
        "Add online booking",
        "Collect enquiries",
        "Connect payments",
        "Connect my other tools",
        "Not sure",
      ],
      "Maintenance & Support": [
        "Update content",
        "Fix an issue",
        "Keep software up to date",
        "Get ongoing support",
        "Not sure",
      ],
    },
    questions: {
      ...questions,
      stage: {
        ...questions.stage,
        label: "Website project stage",
        options: [
          "Exploring an idea",
          "I know where to start",
          "I want to improve an existing website",
          "I need ongoing support",
        ],
      },
      budget: {
        ...questions.budget,
        options: [
          "$100-$500",
          "$500-$1,000",
          "$1,000-$2,500",
          "$2,500-$5,000",
          "$5,000+",
          "Not sure yet",
          "Prefer to discuss",
        ],
      },
    },
    topicAliases: {
      Website: "New Website",
      "New website": "New Website",
      "Website redesign": "Website Redesign",
      "Booking or integrations": "Booking & Integrations",
      Maintenance: "Maintenance & Support",
      "Something else": "Not Sure Yet",
      Websites: "New Website",
    },
    submissionInterests: {
      "New Website": "New website",
      "Website Redesign": "Website redesign",
      "Booking & Integrations": "Booking or integrations",
      "Maintenance & Support": "Maintenance",
      "Not Sure Yet": "Something else",
    },
    title: "Let's Plan Your Website",
    introduction:
      "Please share what you have in mind for your website. Whether you're starting fresh or improving what you have, we'll help you with the next steps.",
    projectTitle: "A little about your website",
  },
  consulting: {
    branch: "consulting",
    services: [
      "AI Adoption",
      "Data & Analytics",
      "Databricks",
      "Technology Strategy",
      "Implementation & Adoption",
      "Website & Digital",
      "Not Sure Yet",
    ],
    serviceDescriptions: {
      "AI Adoption":
        "We can help you identify useful AI opportunities and introduce them into everyday work.",
      "Data & Analytics":
        "We can help organize your data, improve reporting, and answer questions that matter to your team.",
      Databricks:
        "We can help plan, improve, or support a Databricks platform and its data workflows.",
      "Technology Strategy":
        "We can help compare tools, understand costs, and plan a practical approach to your technology.",
      "Implementation & Adoption":
        "We can help put a plan into practice and support the people using your systems.",
      "Website & Digital":
        "We can help you plan digital services and understand how your website and tools should work together.",
      "Not Sure Yet":
        "Please share the challenge you're facing. We'll help you find a useful starting point.",
    },
    followUps: {
      "AI Adoption": [
        "Explore useful AI opportunities",
        "Choose an AI tool",
        "Build a pilot",
        "Help my team use AI",
        "Not sure",
      ],
      "Data & Analytics": followUps["Data & Analytics"],
      Databricks: [
        "Plan a new platform",
        "Improve data pipelines",
        "Review performance or costs",
        "Set up governance",
        "Get ongoing support",
        "Not sure",
      ],
      "Technology Strategy": [
        "Compare tools or platforms",
        "Review existing systems",
        "Plan costs and priorities",
        "Create a technology roadmap",
        "Not sure",
      ],
      "Implementation & Adoption": [
        "Connect existing systems",
        "Automate a process",
        "Support a rollout",
        "Help my team adopt new tools",
        "Not sure",
      ],
      "Website & Digital": [
        "Plan a website or digital service",
        "Connect digital tools",
        "Review the user experience",
        "Choose an implementation approach",
        "Not sure",
      ],
    },
    questions: {
      ...questions,
      budget: {
        ...questions.budget,
        options: [
          "Under $2,500",
          "$2,500-$5,000",
          "$5,000-$10,000",
          "$10,000-$25,000",
          "$25,000+",
          "Not sure yet",
          "Prefer to discuss",
        ],
      },
    },
    topicAliases: {
      AI: "AI Adoption",
      Data: "Data & Analytics",
      "Data & analytics": "Data & Analytics",
      Consulting: "Technology Strategy",
      "Technology strategy": "Technology Strategy",
      "Implementation & adoption": "Implementation & Adoption",
      "Website & digital": "Website & Digital",
      "Something else": "Not Sure Yet",
    },
    submissionInterests: {
      "AI Adoption": "AI",
      "Data & Analytics": "Data & analytics",
      Databricks: "Databricks",
      "Technology Strategy": "Technology strategy",
      "Implementation & Adoption": "Implementation & adoption",
      "Website & Digital": "Website & digital",
      "Not Sure Yet": "Technology strategy",
    },
    title: "Let's Talk About Your Next Steps",
    introduction:
      "Please share the challenge or idea you have in mind. We can help you explore the options, make a plan, and put it into practice.",
    projectTitle: "A little about your project",
  },
};
export type ContactEnquiryType = "websites" | "consulting" | "products";
export const websiteTiers = [
  "Starter",
  "Business",
  "Advanced / Enterprise",
  "I'm not sure",
];
export const productNames = [
  "Pop Tips",
  "Our Next Chapter",
  "A new product idea",
  "Something else",
];
const productConfiguration: ContactConfiguration = {
  ...configurations.solutions,
  services: [
    "A product idea",
    "Report a bug",
    "Suggest an improvement",
    "How a product works",
    "Setup or requirements",
    "Something else",
  ],
  serviceDescriptions: {},
  followUps: {},
  topicAliases: { Products: "How a product works" },
  submissionInterests: Object.fromEntries(
    [
      "A product idea",
      "Report a bug",
      "Suggest an improvement",
      "How a product works",
      "Setup or requirements",
      "Something else",
    ].map((value) => [value, "Products"]),
  ),
  projectTitle: "Your product question",
};
export function getContactConfiguration(
  branch: Branch | "products" = "solutions",
): ContactConfiguration {
  return branch === "products" ? productConfiguration : configurations[branch];
}

// Keep saved choices and submission values compatible while using consistent copy.
export function contactOptionLabel(value: string): string {
  const labels: Record<string, string> = {
    "Not Sure Yet": "I'm not sure",
    "Not sure yet": "I'm not sure",
    "Not sure": "I'm not sure",
    "Non-profit / community organization": "Non-profit or community",
    "Exploring an idea": "Explore an idea",
    "I have an idea": "Explore an idea",
    "Just exploring": "Explore an idea",
    "I know where to start": "Have a plan",
    "I want to improve an existing website": "Improve an existing website",
    "I want to improve an existing process": "Improve an existing process",
    "I need ongoing support": "Ongoing support",
    "Introduce my business or project": "Introduce a business or project",
    "Showcase my work": "Showcase work",
    "Connect my other tools": "Connect other tools",
    "Connect my tools": "Connect tools",
    "Estimate the cost of moving to the cloud": "Estimate migration costs",
    "Find trends or answer specific questions": "Find trends or answers",
    "Clean up inaccurate or duplicate data": "Clean up data",
    "Connect data from different tools": "Connect data sources",
    "Online Search": "Online search",
    "Existing client/project": "Existing client or project",
    "Event/community": "Event or community",
  };
  return labels[value] ?? value;
}
