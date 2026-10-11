import { family, publicRoutes } from "@motchi/brand";
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.solutions.map((path) => ({
    url: new URL(path, family.solutions.domain).href,
  }));
}
