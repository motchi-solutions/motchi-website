import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA } from "@motchi/ui";
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
