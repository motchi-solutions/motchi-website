"use client";

import { useEffect } from "react";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import { capabilities } from "../../content/consulting/capabilities.ts";
import { AnimatedLink, Container } from "../ui/primitives.tsx";
import { useTabs } from "../ui/use-tabs.ts";

const contactHref = (service: string) =>
  `/contact?${new URLSearchParams({ branch: "consulting", service })}`;

/* Problem-led services. Desktop reads as a list beside its detail; smaller
   screens turn the list into a scrollable row above the detail. Tabs render
   on the server so the page does not shift on load; without JavaScript every
   service is listed in full. */
export function Capabilities() {
  const { selected, select, tabId, tabProps } = useTabs(capabilities.length);
  // A link to one service, such as /consulting#databricks, opens it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: Runs once for the arrival URL.
  useEffect(() => {
    const linked = capabilities.findIndex(
      (item) => `#${item.id}` === window.location.hash,
    );
    if (linked < 0) return;
    select(linked);
    document.getElementById("capabilities")?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <section id="capabilities" className="bg-background py-section">
      <Container>
        <div className="max-w-176">
          <h2 className="text-h2 font-medium tracking-tight">
            Where Would You Like Help?
          </h2>
          <p className="mt-4 max-w-152 text-body-lg leading-relaxed text-muted">
            Sometimes the answer is a new system. Sometimes it's a better use of
            what you already have. Choose a service to see how we can help.
          </p>
        </div>

        <div className="mt-(--space-section-heading) grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
          <noscript>
            <style>
              {
                "#capabilities [role=tablist]{display:none}#capabilities [role=tabpanel]{display:block!important}#capabilities [data-panels]{grid-column:1/-1;display:grid;gap:1.5rem}"
              }
            </style>
          </noscript>
          <div
            role="tablist"
            aria-label="Consulting services"
            className="-mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 py-1 scrollbar-none sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:gap-1.5 lg:overflow-visible lg:px-0 lg:py-0"
          >
            {capabilities.map((item, index) => {
              return (
                <button
                  key={item.id}
                  {...tabProps(index, item.id)}
                  className="group relative grid min-h-11 shrink-0 snap-start cursor-pointer content-center gap-1 rounded-(--radius-panel) border border-border bg-surface px-4 py-2.5 text-start transition-colors duration-(--motion-hover) ease-(--ease-hover) hover:border-(--active) hover:bg-(--active-tint) active:bg-(--active-tint-strong) active:duration-100 aria-selected:border-(--active) aria-selected:bg-(--active) aria-selected:text-(--active-foreground) aria-selected:hover:bg-(--active-hover) motion-reduce:transition-none lg:min-h-19 lg:border-transparent lg:bg-transparent lg:py-3 lg:ps-5 lg:pe-12 lg:hover:bg-(--active-tint) lg:aria-selected:border-(--active) lg:aria-selected:bg-(--active) lg:aria-selected:hover:bg-(--active-hover)"
                >
                  <span className="text-small font-semibold whitespace-nowrap text-foreground group-aria-selected:text-(--active-foreground) lg:text-base">
                    {item.title}
                  </span>
                  <span className="hidden text-small text-muted group-aria-selected:text-(--active-foreground)/80 lg:block">
                    {item.problem}
                  </span>
                  <LuArrowRight
                    aria-hidden="true"
                    className="absolute inset-e-5 top-1/2 hidden size-5 -translate-y-1/2 text-(--active-detail) lg:group-aria-selected:block"
                  />
                </button>
              );
            })}
          </div>

          <div className="min-w-0" data-panels="">
            {capabilities.map((item, index) => (
              <div
                key={item.id}
                id={item.id}
                role="tabpanel"
                aria-labelledby={tabId(index)}
                hidden={selected !== index}
                // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA tab panels take focus so keyboard users can reach their content.
                tabIndex={0}
                className="min-w-0 rounded-(--radius-panel) border border-border bg-surface p-[clamp(1.5rem,3vw,2.75rem)] motion-safe:animate-panel-in"
              >
                <p className="text-small font-semibold text-(--active)">
                  {item.title}
                </p>
                <h3 className="mt-3 text-3xl leading-tight font-medium tracking-[-0.02em]">
                  {item.problem}
                </h3>
                <p className="mt-4 max-w-160 text-body leading-relaxed text-muted">
                  {item.description}
                </p>
                <ul
                  className="mt-7 grid gap-x-8 gap-y-3 border-t border-border pt-6 sm:grid-cols-2"
                  aria-label={`${item.title} focus areas`}
                >
                  {item.areas.map((area) => (
                    <li key={area} className="flex items-start gap-2.5">
                      <LuCheck
                        className="mt-[0.2em] size-4.5 shrink-0 text-(--active)"
                        aria-hidden="true"
                      />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <AnimatedLink
                    href={contactHref(item.service)}
                    arrow
                    underline="always"
                    className="min-h-11 font-semibold text-(--active)"
                  >
                    Talk to us about {item.title}
                  </AnimatedLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
