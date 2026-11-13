import { getSites, indexingAllowed } from "../lib/config/env.ts";
import type { MetadataRoute } from "next";

/* Crawling is allowed only on the launched production site (see
   indexingAllowed); every other deployment, previews included, asks search
   engines to stay out. The contact API is never crawled. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexingAllowed()
      ? { userAgent: "*", allow: "/", disallow: "/api/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", getSites().solutions.url).href,
  };
}
