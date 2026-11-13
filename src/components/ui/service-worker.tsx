"use client";

import { useEffect } from "react";

/* Registers public/sw.js in production only: in development the build files
   are not content-hashed, so caching them would serve stale code. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // Offline support is an enhancement; the site works without it.
    });
  }, []);
  return null;
}
