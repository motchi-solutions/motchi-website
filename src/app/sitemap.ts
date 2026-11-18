import { getSites } from "../lib/config/env.ts";
import { publicRoutes } from "../lib/config/navigation.ts";
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((path) => ({
    url: new URL(path, getSites().solutions.url).href,
  }));
}
