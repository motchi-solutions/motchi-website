import { Section, SectionHeading } from "@motchi/ui";
import Image from "next/image";
import { projects } from "@/content/projects";
export function Work() {
  return (
    <Section id="work">
      <SectionHeading
        eyebrow="Selected website work"
        title="Different businesses. Distinct directions."
      >
        Restaurant, beauty, project, and professional-business examples.
        Approved screenshots and project links are being prepared.
      </SectionHeading>
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {projects.map((project, index) => (
          <article key={project.title}>
            {project.images.length ? (
              <div className="overflow-hidden border border-border">
                <Image
                  src={project.images[0].src}
                  alt={project.images[0].alt}
                  width={project.images[0].width}
                  height={project.images[0].height}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="h-auto w-full"
                />
              </div>
            ) : (
              <div
                className={`flex aspect-[4/3] flex-col justify-between border border-border p-6 sm:p-10 ${index === 3 ? "bg-secondary text-inverse" : index === 1 ? "bg-primary text-inverse" : "bg-surface"}`}
              >
                <span className="text-xs tracking-widest uppercase">
                  {project.industry}
                </span>
                <p
                  className={`max-w-xs text-3xl tracking-tight sm:text-4xl ${index === 1 || index === 3 ? "font-display italic" : "font-semibold"}`}
                >
                  {project.title}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-current/25 pt-4 text-xs">
                  <span>Screenshot placeholder</span>
                  <span aria-hidden="true">0{index + 1}</span>
                </div>
              </div>
            )}
            <div className="mt-6 flex items-start justify-between gap-4">
              <h3 className="text-2xl font-medium">{project.title}</h3>
              {project.featured && (
                <span className="border border-border px-2 py-1 text-xs text-muted">
                  Featured
                </span>
              )}
            </div>
            <p className="mt-3 text-xs tracking-wide text-primary">
              {project.services.join(" · ")}
            </p>
            <p className="mt-4 max-w-lg leading-relaxed text-muted">
              {project.description}
            </p>
            {project.url && (
              <a
                href={project.url}
                className="mt-3 inline-flex min-h-12 items-center text-sm underline underline-offset-4"
              >
                Visit {project.title}{" "}
                <span aria-hidden="true" className="ml-2">
                  ↗
                </span>
              </a>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
