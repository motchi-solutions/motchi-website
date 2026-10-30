import { MediaFrame, ProjectMedia } from "@motchi/ui";
import Image from "next/image";
import type { Project } from "@/content/projects";

export function ProjectPreview({ project }: { project: Project }) {
  const primary =
    project.media.desktop ??
    project.media.hero ??
    project.media.motion ??
    project.media.mobile;
  if (!primary)
    return (
      <figure className="border-l-2 border-accent py-6 pl-5">
        <figcaption className="text-small text-muted">
          {project.title} project images are being prepared.
        </figcaption>
      </figure>
    );
  return (
    <figure className="project-preview">
      <div className="project-composition">
        <MediaFrame className="project-desktop bg-surface">
          <ProjectMedia
            asset={primary}
            sizes="(min-width: 1280px) 720px, (min-width: 1024px) 60vw, 100vw"
          />
        </MediaFrame>
        {project.media.desktop && project.media.mobile && (
          <MediaFrame className="project-mobile bg-surface">
            <Image
              src={project.media.mobile.src}
              alt={project.media.mobile.alt}
              width={project.media.mobile.width}
              height={project.media.mobile.height}
              sizes="(min-width: 1024px) 160px, (min-width: 640px) 180px, 28vw"
              className="h-auto w-full"
            />
          </MediaFrame>
        )}
      </div>
    </figure>
  );
}
