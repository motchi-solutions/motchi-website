import { PrivacyNotice } from "@motchi/ui";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return <PrivacyNotice />;
}
