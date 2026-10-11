import type { ReactNode } from "react";
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-reveal="ready" className={className}>
      {children}
    </div>
  );
}
