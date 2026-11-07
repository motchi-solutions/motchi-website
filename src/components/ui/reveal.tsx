"use client";
import { type ReactNode, useEffect, useRef } from "react";
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.dataset.revealMounted = "true";
    node.dispatchEvent(
      new CustomEvent("motchi:reveal-ready", { bubbles: true }),
    );
    return () => {
      delete node.dataset.revealMounted;
    };
  }, []);
  return (
    <div ref={ref} data-reveal="ready" className={className}>
      {children}
    </div>
  );
}
