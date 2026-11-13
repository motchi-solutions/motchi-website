import type { Metadata } from "next";
import { OfflinePage } from "../../components/ui/offline.tsx";

// Precached by the service worker; never indexed or listed in the sitemap.
export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};
export default function Offline() {
  return <OfflinePage />;
}
