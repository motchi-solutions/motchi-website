import type { ReactNode } from "react";
import { sites } from "../../lib/config/sites.ts";
import { BranchLayout } from "@/components/branch-layout";
export const metadata = {
  title: {
    default: sites.websites.name,
    template: `%s - ${sites.websites.name}`,
  },
  description: sites.websites.description,
};
export default function Layout({ children }: { children: ReactNode }) {
  return <BranchLayout branch="websites">{children}</BranchLayout>;
}
