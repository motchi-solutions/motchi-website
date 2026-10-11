import { family, publicRoutes } from "@motchi/brand";
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.consulting.map((path) => ({
    url: new URL(path, family.consulting.domain).href,
  }));
}
