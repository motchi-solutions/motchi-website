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
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
export default config;
