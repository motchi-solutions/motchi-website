import { FaqSection } from "../ui/faq-section.tsx";

const questions = [
  {
    title: "Do we need a technical brief to get started?",
    content:
      "No. Tell us what's getting in the way, in your own words. We'll help shape the problem and suggest a sensible first step.",
  },
  {
    title: "Do you only give advice, or do you build too?",
    content:
      "Both. We can help you choose a direction, then implement it with your team and support the rollout.",
  },
  {
    title: "How is consulting priced?",
    content:
      "Every engagement is scoped and quoted before work starts, so you know the goals, responsibilities, and cost up front. Tell us what you need and we'll reply with next steps or an initial quote.",
  },
  {
    title: "Can you work with the tools we already have?",
    content:
      "Yes. Sometimes the answer is a new system, and sometimes it's a better use of what you already have. We start with your current setup.",
  },
  {
    title: "How do you handle our data and AI risks?",
    content:
      "We review how providers use data, who has access, and where data is stored and processed. AI plans include human review where results need it.",
  },
  {
    title: "What happens after delivery?",
    content:
      "We prepare documentation and handover, support training, and agree on ongoing support so your team knows where to turn.",
  },
  {
    title: "How quickly will we hear back?",
    content:
      "We typically respond with next steps or an initial quote within 2-3 business days. We work with businesses in Toronto and around the world.",
  },
] as const;

export function ConsultingFaq() {
  return <FaqSection questions={questions} />;
}
