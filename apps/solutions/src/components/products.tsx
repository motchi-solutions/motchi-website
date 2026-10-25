import Image from "next/image";
import { LuCircleHelp } from "react-icons/lu";
import { AnimatedLink, Eyebrow, Section } from "@motchi/ui";
import { products } from "@/content/products";
export function Products() {
  return (
    <Section id="products" className="bg-surface">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Eyebrow>Motchi Products</Eyebrow>
          <h2 className="text-h2 font-medium tracking-tight">
            Ideas Taking Shape
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-muted">
            These products are still in development. We will share more about
            what they do and how to use them when they are ready.
          </p>
        </div>
        <div className="lg:col-span-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="flex items-start gap-4 border-t border-border py-7 sm:gap-5"
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
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted"
                >
                  <LuCircleHelp className="h-8 w-8" />
                </div>
              )}
              <div className="min-w-0 flex-1">
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
