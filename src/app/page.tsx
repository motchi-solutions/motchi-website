import "@/components/home.css";
import { ContactCTA } from "../components/ui/index.ts";
import type { Metadata } from "next";
import { Businesses } from "@/components/businesses";
import { Hero } from "@/components/hero";
import { RecentWork, WhyMotchi } from "@/components/home-sections";
import { Products } from "@/components/products";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <div className="solutions-home">
      <Hero />
      <Businesses />
      <RecentWork />
      <WhyMotchi />
      <Products />
      <ContactCTA />
    </div>
  );
}
