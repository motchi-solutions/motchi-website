import { localDevOrigins } from "@motchi/config/dev-origins";
import { securityHeaders } from "@motchi/config/security";
import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: localDevOrigins(),
  // Shared packages expose source; each branch still builds independently.
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
