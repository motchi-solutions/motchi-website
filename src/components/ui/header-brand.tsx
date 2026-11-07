"use client";

import { usePathname } from "next/navigation";
import { branchForPath } from "../../lib/config/navigation.ts";
import { BranchMark } from "./branch-mark.tsx";

export function HeaderBrand() {
  const pathname = usePathname();
  return (
    <BranchMark
      branch={branchForPath(pathname)}
      transition
      homeLabel="Motchi Solutions home"
    />
  );
}
