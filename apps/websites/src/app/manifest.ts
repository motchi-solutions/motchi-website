import type { MetadataRoute } from "next";
import { sites } from "@motchi/config/sites";
import { palette } from "@motchi/brand";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: sites.websites.name,
    short_name: "Websites",
    description: sites.websites.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: palette.cream,
    theme_color: palette.burgundy,
    lang: "en-CA",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
