import { AnimatedLink, Eyebrow, Section } from "@motchi/ui";
import { products } from "@/content/products";
export function Products() {
  return (
    <Section id="products" className="bg-surface">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Eyebrow>Motchi Products</Eyebrow>
          <h2 className="text-h2 font-medium tracking-tight">
            Our Own Ideas,
            <br />
            <span className="font-display italic text-primary">
              Taking Shape.
            </span>
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-muted">
            We’re also developing a direction for Motchi products. We’ll share
            more when there’s something ready to use.
          </p>
        </div>
        <div className="lg:col-span-3">
          {products.map((product) => (
            <article key={product.name} className="border-t border-border py-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-medium">{product.name}</h3>
                <span className="inline-flex items-center gap-2 text-xs text-muted">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                  />
                  {product.status}
                </span>
              </div>
              <p className="mt-4 max-w-lg leading-relaxed text-muted">
                {product.description}
              </p>
              {product.status === "Available" && (
                <AnimatedLink
                  href={product.url}
                  external
                  className="mt-4 min-h-12 text-primary"
                >
                  Explore {product.name}
                </AnimatedLink>
              )}
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
