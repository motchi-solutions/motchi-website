import { getSites } from "@motchi/config/env";
import { publicRoutes } from "@motchi/config/navigation";
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.solutions.map((path) => ({
    url: new URL(path, getSites().solutions.url).href,
  }));
}
