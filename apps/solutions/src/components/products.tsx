import { Section, SectionHeading } from "@motchi/ui";
import { products } from "@/content/products";
export function Products() {
  return (
    <Section id="products" className="border-y border-border bg-surface">
      <SectionHeading
        eyebrow="Built by Motchi"
        title="Room for what comes next."
      >
        Alongside client work, we’re shaping a family of our own products. These
        planned entries are not available yet.
      </SectionHeading>
      <div className="grid gap-8 md:grid-cols-2">
        {products.map((product) => (
          <article key={product.name} className="border-t border-border pt-7">
            <span className="inline-block border border-border px-3 py-1 text-xs text-muted">
              {product.status}
            </span>
            <h3 className="mt-6 text-2xl font-medium">{product.name}</h3>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              {product.description}
            </p>
            {product.status === "Available" && (
              <a
                href={product.url}
                className="mt-5 inline-flex min-h-12 items-center text-primary underline"
              >
                Explore {product.name}
              </a>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
