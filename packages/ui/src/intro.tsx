"use client";
import { useEffect, useState } from "react";
export function Introduction() {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("motchi-introduced")) return;
      sessionStorage.setItem("motchi-introduced", "yes");
      setPlay(true);
    } catch {
      /* Storage restrictions simply skip the introduction. */
    }
  }, []);
  return play ? (
    <span
      aria-hidden="true"
      className="intro-line pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-accent"
    />
  ) : null;
}
