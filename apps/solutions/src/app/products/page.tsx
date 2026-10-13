import { pageMetadata } from "@motchi/config/metadata";
import { ContactCTA, PageHero } from "@motchi/ui";
import { Products } from "@/components/products";
export const metadata = pageMetadata(
  "Motchi Products",
  "Explore the products and features we are developing. See what is planned and its current status.",
  "/products",
);
export default function Page() {
  return (
    <>
      <PageHero eyebrow="Motchi Products" title="Products We're Developing">
        Take a look at the products and features we are working on. These are
        still being developed and are not yet available to use.
      </PageHero>
      <Products />
      <ContactCTA />
    </>
  );
}
