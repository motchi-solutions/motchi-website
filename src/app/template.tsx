import { PageEntry } from "../components/ui/index.ts";
import type { ReactNode } from "react";
export default function Template({ children }: { children: ReactNode }) {
  return <PageEntry>{children}</PageEntry>;
}
