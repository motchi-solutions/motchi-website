import { localDevOrigins } from "./src/lib/config/dev-origins.ts";
import { securityHeaders } from "./src/lib/config/security.ts";
import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: localDevOrigins(),
  // Retired company pages: the homepage now introduces both services.
  async redirects() {
    return ["/services", "/businesses"].map((source) => ({
      source,
      destination: "/#businesses",
      permanent: true,
    }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The service worker must never be cached, so updates reach visitors
      // on their next visit (Next.js docs: Progressive Web Apps).
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};
export default config;
