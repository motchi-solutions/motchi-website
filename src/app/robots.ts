import { getSites, indexingAllowed } from "../lib/config/env.ts";
import type { MetadataRoute } from "next";

/* Link-preview fetchers for messaging and social apps. They read a page's
   Open Graph and X tags to draw a card and do not index it, so they may
   fetch pages even while search engines are kept out. */
export const linkPreviewAgents = [
  "Twitterbot",
  "facebookexternalhit",
  "LinkedInBot",
  "Slackbot",
  "Discordbot",
  "WhatsApp",
  "TelegramBot",
];

/* Search engines may crawl only the production site once indexing is
   allowed (see indexingAllowed). Everywhere else they are asked to stay out,
   and the noindex meta tag keeps pages out of results. The contact API is
   never crawled. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexingAllowed()
      ? { userAgent: "*", allow: "/", disallow: "/api/" }
      : [
          { userAgent: linkPreviewAgents, allow: "/", disallow: "/api/" },
          { userAgent: "*", disallow: "/" },
        ],
    sitemap: new URL("/sitemap.xml", getSites().solutions.url).href,
  };
}
