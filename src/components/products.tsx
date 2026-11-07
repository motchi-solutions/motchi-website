import Image from "next/image";
import { AnimatedLink, ButtonLink, Section } from "./ui/index.ts";
import { products } from "@/content/products";
export function Products() {
  return (
    <Section id="products" className="ms-surface-dark">
      <div className="section-layout product-overview grid lg:grid-cols-5">
        <div className="section-introduction lg:col-span-2">
          <h2 className="text-h2 font-medium tracking-tight">
            Products We're Building
          </h2>
          <p className="max-w-sm leading-relaxed text-muted">
            These products are still in development. We will share more about
            what they do and how to use them when they are ready.
          </p>
        </div>
        <div className="lg:col-span-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="flex items-start gap-4 border-t border-border py-[var(--space-related)]"
            >
              {product.logo ? (
                <Image
                  src={product.logo.src}
                  width={product.logo.width}
                  height={product.logo.height}
                  sizes="64px"
                  alt=""
                  className="h-16 w-16 shrink-0 object-contain"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-medium">{product.name}</h3>
                  <span className="inline-flex items-center gap-2 text-xs text-muted">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                    />
                    {product.status}
                  </span>
                </div>
                <p className="mt-[var(--space-related)] max-w-lg leading-relaxed text-muted">
                  {product.description}
                </p>
                {product.status === "Available" && (
                  <AnimatedLink
                    href={product.url}
                    external
                    className="mt-[var(--space-action)] min-h-12 text-accent"
                  >
                    Explore {product.name}
                  </AnimatedLink>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="section-action product-overview-action">
          <ButtonLink href="/products" light>
            Explore Our Products
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
