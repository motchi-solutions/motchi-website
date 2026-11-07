import { getSites } from "../lib/config/env.ts";
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", getSites().solutions.url).href,
  };
}
