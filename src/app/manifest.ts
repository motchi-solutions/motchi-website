import type { MetadataRoute } from "next";
import { sites } from "../lib/config/sites.ts";
import { palette } from "../lib/brand.ts";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: sites.solutions.name,
    short_name: "Motchi",
    description: sites.solutions.description,
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
      // Padded so circular and rounded launcher masks never clip the mark.
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "productivity"],
    // Long-press (Android) or right-click (desktop) shortcuts on the app icon.
    shortcuts: [
      {
        name: "Websites",
        url: "/websites",
        description: sites.websites.description,
      },
      {
        name: "Consulting",
        url: "/consulting",
        description: sites.consulting.description,
      },
      { name: "Contact", url: "/contact", description: "Start an enquiry." },
    ],
    // Shown in the install dialog on supporting browsers.
    screenshots: [
      {
        src: "/screenshots/home-wide.jpg",
        sizes: "1280x720",
        type: "image/jpeg",
        form_factor: "wide",
        label: "The Motchi Solutions home page",
      },
      {
        src: "/screenshots/home-narrow.jpg",
        sizes: "390x844",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "The Motchi Solutions home page on a phone",
      },
    ],
  };
}
