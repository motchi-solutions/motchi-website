import { PrivacyNotice } from "../../components/ui/index.ts";
import { pageMetadata } from "../../lib/config/metadata.ts";
export const metadata = pageMetadata(
  "Privacy Policy",
  "What Motchi collects through the contact form, why, who processes it, how long it's kept, and how to access, correct, or delete it.",
  "/privacy",
);
export default function Privacy() {
  return <PrivacyNotice />;
}
