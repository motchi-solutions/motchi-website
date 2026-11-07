import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type {
  GifAsset,
  ImageAsset,
  MediaAsset,
  VideoAsset,
} from "../../lib/brand.ts";
export type Project = {
  id: string;
  title: string;
  industry: string;
  services: string[];
  description: string;
  url: string | null;
  caseStudyUrl?: string;
  technologies?: string[];
  details?: { heading: string; description: string }[];
  featured?: boolean;
  media: {
    desktop?: ImageAsset;
    mobile?: ImageAsset;
    logo?: ImageAsset;
    hero?: MediaAsset;
    motion?: VideoAsset | GifAsset;
  };
};
// One data boundary for server rendering and the public projects endpoint.
// Replace this read with a database query when projects move out of JSON.
export const getProjects = cache(async (): Promise<Project[]> => {
  const source = await readFile(
    path.join(process.cwd(), "src/content/websites/projects.json"),
    "utf8",
  );
  return JSON.parse(source) as Project[];
});
