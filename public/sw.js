/* Motchi service worker. Kept deliberately small:
   - Pages are always fetched from the network, so visitors never see a
     stale page. If the network fails, the precached offline page is shown.
   - Next's hashed build files (/_next/static/) and brand assets are cached
     after first use; their URLs change whenever their content does.
   - Only same-origin GET requests are handled. The contact API and form
     submissions (POST) always go straight to the network.
   Bump VERSION to drop old caches. References: MDN, Service Worker API;
   web.dev, "Offline fallback page". */
const VERSION = "v1";
const CACHE = `motchi-${VERSION}`;
const OFFLINE_URL = "/offline";

// Cache the offline page and the build files it needs to render.
async function precacheOfflinePage() {
  const cache = await caches.open(CACHE);
  const response = await fetch(OFFLINE_URL, { cache: "reload" });
  if (!response.ok) return;
  const html = await response.clone().text();
  const assets = [
    ...html.matchAll(/(?:href|src)="(\/_next\/static\/[^"]+)"/g),
  ].map((match) => match[1]);
  await cache.put(OFFLINE_URL, response);
  await cache.addAll([...new Set(assets)]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheOfflinePage().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("motchi-") && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

const cacheable = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/brand/") ||
  url.pathname.startsWith("/icons/");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE);
        return (await cache.match(OFFLINE_URL)) ?? Response.error();
      }),
    );
    return;
  }

  if (cacheable(url)) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      }),
    );
  }
});
