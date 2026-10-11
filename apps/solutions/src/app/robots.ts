import { sites } from "@motchi/config/sites";
import { getSites } from "@motchi/config/env";
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const site = getSites().solutions;
  const published = site.url === sites.solutions.url;
  return {
    rules: published
      ? { userAgent: "*", allow: "/", disallow: "/api/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", getSites().solutions.url).href,
  };
}
