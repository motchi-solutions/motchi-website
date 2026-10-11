import { family } from "@motchi/brand";
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/contact", "/privacy"].map((path) => ({
    url: `${family.consulting.domain}${path}`,
  }));
}
