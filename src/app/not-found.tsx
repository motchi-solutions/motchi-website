import type { Metadata } from "next";
import { NotFoundPage } from "../components/ui/index.ts";
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};
export default function NotFound() {
  return <NotFoundPage />;
}
