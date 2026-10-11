import { securityHeaders } from "@motchi/config/security";
import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  transpilePackages: [
    "@motchi/ui",
    "@motchi/brand",
    "@motchi/email",
    "@motchi/config",
  ],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
export default config;
