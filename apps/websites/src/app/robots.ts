import { sites } from "@motchi/config/sites";
import { getSites } from "@motchi/config/env";
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const site = getSites().websites;
  const published = site.url === sites.websites.url;
  return {
    rules: published
      ? { userAgent: "*", allow: "/", disallow: "/api/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", getSites().websites.url).href,
  };
}
