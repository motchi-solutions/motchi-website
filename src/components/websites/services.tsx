import { LuLayers, LuPlug, LuServer, LuWrench, LuCheck } from "react-icons/lu";
import { services } from "../../content/websites/services.ts";
import { Container, SectionHeading } from "../ui/primitives.tsx";
import styles from "./landing.module.css";

export function Services() {
  const fullStack = services[1];
  const supporting = [services[0], services[2], services[3]];
  const icons = [LuLayers, LuPlug, LuWrench];
  return (
    <section id="services" className={styles.services}>
      <Container>
        <SectionHeading wide title="What We Build">
          A website should look like your business and work for it, too. We
          bring the design, content, and systems together.
        </SectionHeading>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <article
            id={fullStack.id}
            className="flex min-w-0 flex-col rounded-lg bg-primary p-6 text-inverse sm:p-8 lg:col-span-2"
          >
            <LuServer aria-hidden="true" className="mb-8 h-8 w-8 text-accent" />
            <h3 className="text-2xl font-medium tracking-tight">
              {fullStack.title}
            </h3>
            <p className="mt-4 max-w-reading text-body leading-relaxed">
              {fullStack.summary}
            </p>
            <ul className="mt-8 grid gap-3 text-body">
              {[
                "Bookings & reservations",
                "Menus & content",
                "Data & management tools",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <LuCheck
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <div className="grid content-start gap-8 lg:col-span-3">
            {supporting.map((service, index) => {
              const Icon = icons[index];
              return (
                <article
                  id={service.id}
                  key={service.id}
                  className="flex min-w-0 items-start gap-4 sm:gap-6"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xl font-medium tracking-tight">
                      {service.title}
                    </h3>
                    <p className="mt-2 max-w-reading text-body leading-relaxed text-muted">
                      {service.summary}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
