"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageEntry({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div
      key={pathname}
      className="page-arrival"
      data-inner-page={pathname !== "/"}
    >
      {children}
    </div>
  );
}
