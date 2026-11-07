import { pageMetadata } from "../../lib/config/metadata.ts";
import { ContactCTA } from "../../components/ui/index.ts";
import { ProductsHero } from "@/components/products-hero";
export const metadata = pageMetadata(
  "Products",
  "Explore the products and features we are developing. See what is planned and its current status.",
  "/products",
);
export default function Page() {
  return (
    <>
      <ProductsHero />
      <ContactCTA title="Have a Question About a Product?" />
    </>
  );
}
