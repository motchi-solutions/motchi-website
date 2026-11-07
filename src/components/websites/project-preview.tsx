import { MediaFrame, ProjectMedia } from "../ui/index.ts";
import type { Project } from "../../content/websites/projects.ts";

export function ProjectPreview({
  project,
  aboveFold = false,
}: {
  project: Project;
  aboveFold?: boolean;
}) {
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
            loading={aboveFold ? "eager" : "lazy"}
            fetchPriority={aboveFold ? "high" : undefined}
            sizes="(min-width: 1280px) 720px, (min-width: 1024px) 60vw, 100vw"
          />
        </MediaFrame>
        {project.media.desktop && project.media.mobile && (
          <MediaFrame className="project-mobile bg-surface">
            <ProjectMedia
              asset={project.media.mobile}
              loading={aboveFold ? "eager" : "lazy"}
              sizes="(min-width: 1024px) 160px, (min-width: 640px) 180px, 28vw"
            />
          </MediaFrame>
        )}
      </div>
    </figure>
  );
}
