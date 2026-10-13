import { MediaFrame, ProjectMedia } from "@motchi/ui";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";
export function ProjectPreview({ project }: { project: Project }) {
  const asset =
    project.media.hero ?? project.media.desktop ?? project.media.motion;
  const styles = {
    "--project-background":
      project.colors?.background ??
      (project.treatment === "ink"
        ? "var(--brand-secondary)"
        : project.treatment === "burgundy"
          ? "var(--brand-primary)"
          : "var(--surface)"),
    "--project-foreground":
      project.colors?.foreground ??
      (project.treatment === "paper" ? "var(--foreground)" : "var(--inverse)"),
  } as CSSProperties;
  const treatment =
    project.treatment === "ink"
      ? "bg-secondary text-inverse"
      : project.treatment === "burgundy"
        ? "bg-primary text-inverse"
        : "bg-surface text-foreground";
  return (
    <div className="project-preview relative" style={styles}>
      <MediaFrame className={`project-stage ${treatment}`}>
        <div className="flex min-h-12 items-center justify-between gap-4 border-b border-current/20 px-5 text-xs tracking-wide">
          <span>{project.industry}</span>
          <span>{asset ? "Project preview" : "Media placeholder"}</span>
        </div>
        <div className="relative flex aspect-16/11 items-center p-6 sm:p-10 lg:p-12">
          {asset ? (
            <div
              className={`w-full ${project.media.mobile ? "pr-8 sm:pr-10" : ""}`}
            >
              <MediaFrame>
                <ProjectMedia asset={asset} />
              </MediaFrame>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col justify-between border border-current/20 p-5 sm:p-7">
              <p className="text-xs tracking-widest uppercase opacity-70">
                {project.media.logo
                  ? "Website preview"
                  : "Approved media to follow"}
              </p>
              {project.media.logo ? (
                <Image
                  src={project.media.logo.src}
                  alt={project.media.logo.alt}
                  width={project.media.logo.width}
                  height={project.media.logo.height}
                  className="h-auto max-h-20 w-auto max-w-full object-contain"
                />
              ) : (
                <p
                  className={`max-w-sm text-3xl tracking-tight sm:text-4xl ${project.treatment === "paper" ? "font-medium" : "font-display italic"}`}
                >
                  {project.title}
                </p>
              )}
              <p className="max-w-xs text-xs leading-relaxed opacity-70">
                Screenshot placeholder.
                <br />
                This is a Motchi presentation treatment, not a client
                screenshot.
              </p>
            </div>
          )}
          {asset && project.media.mobile && (
            <div className="phone-preview absolute right-5 bottom-6 sm:right-8 sm:bottom-8">
              <Image
                src={project.media.mobile.src}
                alt={project.media.mobile.alt}
                width={project.media.mobile.width}
                height={project.media.mobile.height}
                sizes="(min-width: 1024px) 140px, 22vw"
              />
            </div>
          )}
        </div>
      </MediaFrame>
      {asset && project.media.logo && (
        <div className="mt-4">
          <Image
            src={project.media.logo.src}
            alt={project.media.logo.alt}
            width={project.media.logo.width}
            height={project.media.logo.height}
            className="h-8 w-auto max-w-40 object-contain"
          />
        </div>
      )}
    </div>
  );
}
