import { PageEntry } from "@motchi/ui";
import type { ReactNode } from "react";
export default function Template({ children }: { children: ReactNode }) {
  return <PageEntry>{children}</PageEntry>;
}
