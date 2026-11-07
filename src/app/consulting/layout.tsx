import type { ReactNode } from "react";
import { sites } from "../../lib/config/sites.ts";
import { BranchLayout } from "@/components/branch-layout";
export const metadata = {
  title: {
    default: sites.consulting.name,
    template: `%s | ${sites.consulting.name}`,
  },
  description: sites.consulting.description,
};
export default function Layout({ children }: { children: ReactNode }) {
  return <BranchLayout branch="consulting">{children}</BranchLayout>;
}
