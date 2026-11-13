import "@/components/home.css";
import { ContactCTA } from "../components/ui/index.ts";
import type { Metadata } from "next";
import { pageMetadata } from "../lib/config/metadata.ts";
import { Businesses } from "@/components/businesses";
import { Hero } from "@/components/hero";
import { ClientLogos, RecentWork, WhyMotchi } from "@/components/home-sections";
import { Products } from "@/components/products";
export const metadata: Metadata = pageMetadata(
  "Websites and Technology Consulting in Toronto - Motchi",
  "Motchi builds websites shaped around your customers and offers practical technology consulting for AI, data, and business systems, from planning to support.",
  "/",
  { absolute: true },
);
export default function Home() {
  return (
    <div className="solutions-home">
      <Hero />
      <ClientLogos />
      <Businesses />
      <RecentWork />
      <WhyMotchi />
      <Products />
      <ContactCTA tone="light" />
    </div>
  );
}
