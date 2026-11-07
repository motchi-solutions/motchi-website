import { PrivacyNotice } from "../../components/ui/index.ts";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return <PrivacyNotice frontendOnly />;
}
