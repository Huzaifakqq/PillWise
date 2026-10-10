/*
 * PillWise service worker — offline demo fail-safe.
 *
 * Strategy:
 *   - App shell (HTML/CSS/JS): cache-first so the UI loads with no network.
 *   - API GETs: network-first with a cache fallback, so the last successful
 *     interaction check is still visible if the backend is unreachable.
 *   - POSTs (interaction checks): never cached; the frontend keeps its own
 *     localStorage copy of the last check for that case.
 */
const CACHE_NAME = "pillwise-v1";
const SHELL_ASSETS = ["/", "/offline", "/icon.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isApi = url.pathname.startsWith("/api/");

  if (isApi) {
    // Network-first for API GETs, fall back to cached copy when offline.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for the app shell and static assets.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => caches.match("/")))
  );
});
