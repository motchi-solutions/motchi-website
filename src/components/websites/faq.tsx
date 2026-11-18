import { websiteBusiness, websiteStarter } from "../../lib/config/sites.ts";
import { FaqSection } from "../ui/faq-section.tsx";

// Answers restate what the pricing and services sections already promise.
const questions = [
  {
    title: "How much does a website cost?",
    content: `Starter websites start from ${websiteStarter.price} and Business websites from ${websiteBusiness.price}. Advanced builds are quoted to your scope. Prices are in CAD; taxes, domain, and hosting fees are extra.`,
  },
  {
    title: "What's included after launch?",
    content: `Every website includes ${websiteStarter.includedSecurityUpdateYears} year of free security updates. Business and Advanced websites also include ${websiteBusiness.includedCareMonths} months of free maintenance. After that, maintenance is quoted separately.`,
  },
  {
    title: "Do I need my text and photos ready?",
    content:
      "Starter websites are built with the text and images you supply. For larger projects, we agree on who writes, supplies, and approves each part before work starts.",
  },
  {
    title: "Can you improve the website I already have?",
    content:
      "Yes. We can redesign an existing website, add booking or online ordering, and connect it to the tools you already use.",
  },
  {
    title: "How do changes and revisions work?",
    content: `${websiteStarter.terms} You'll know what's included, and anything new is agreed with you first.`,
  },
  {
    title: "Can you help with the systems behind my business, too?",
    content: (
      <>
        Yes. Motchi Consulting helps with AI, data, and business systems, from
        choosing a direction to putting it to work.{" "}
        <a href="/consulting">See how Motchi Consulting can help</a>.
      </>
    ),
  },
  {
    title: "How quickly will we hear back?",
    content:
      "We typically respond with next steps or an initial quote within 2-3 business days.",
  },
] as const;

export function WebsiteFaq() {
  return <FaqSection questions={questions} className="bg-surface" />;
}
