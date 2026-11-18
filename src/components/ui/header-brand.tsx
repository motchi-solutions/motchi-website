"use client";

import { usePathname } from "next/navigation";
import { branchForPath } from "../../lib/config/navigation.ts";
import { sites } from "../../lib/config/sites.ts";
import { BranchMark } from "./branch-mark.tsx";

/* The lockup shows the current branch but always links to the family home,
   so its name starts with the visible words and then says where it goes. */
export function HeaderBrand() {
  const branch = branchForPath(usePathname());
  return (
    <BranchMark
      branch={branch}
      transition
      homeLabel={
        branch === "solutions"
          ? `${sites.solutions.name} home`
          : `${sites[branch].name}, ${sites.solutions.name} home`
      }
    />
  );
}
