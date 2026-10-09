// LegendRise service worker: app-shell + immutable-asset caching with an
// offline fallback. Installability requires a fetch handler — this one is
// deliberately conservative so SSR/auth/API behaviour never changes:
//   - navigations  → network-first, fall back to the /offline page
//   - /_app/immutable/* (hashed) → cache-first
//   - other same-origin static GETs → stale-while-revalidate
//   - /api/* and non-GET → network-only (never cached)
const VERSION = "legendrise-v1";
const CORE = ["/", "/offline", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(CORE).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Allow pages to trigger immediate activation of an updated worker.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // API + auth endpoints: always live, never cached.
  if (url.pathname.startsWith("/api/")) return;

  // Navigations: try network, fall back to cached page, then /offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Keep a fresh copy of the home page for faster restarts.
          if (res.ok && (url.pathname === "/" || url.pathname === OFFLINE_URL)) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(VERSION);
          const cached = await cache.match(req);
          if (cached) return cached;
          const offline = await cache.match(OFFLINE_URL);
          if (offline) return offline;
          return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
        }),
    );
    return;
  }

  // Hashed immutable build assets: cache-first (safe — filename changes on change).
  if (url.pathname.startsWith("/_app/immutable/")) {
    event.respondWith(
      caches.open(VERSION).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  // Other static assets (icons, manifest, styles): stale-while-revalidate.
  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const hit = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => undefined);
      return hit || network.then((res) => res || Response.error());
    }),
  );
});
