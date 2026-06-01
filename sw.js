// Service worker for the World Live News Map PWA.
// Strategy:
//   - App shell (HTML/CSS/JS/data/icons): cache-first, so the app opens offline.
//   - Live APIs (GDELT, Hacker News, USGS, weather): network-only, never cached
//     (stale news is worse than no news; failures degrade gracefully in the app).
const CACHE = "news-map-v2";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./vendor/leaflet.css",
  "./vendor/leaflet.js",
  "./vendor/globe.gl.min.js",
  "./data/world-countries.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // Cache shell items individually so one missing file doesn't abort the install.
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isLiveApi =
    /gdeltproject\.org|hn\.algolia\.com|earthquake\.usgs\.gov|api\.weather\.gov|youtube\.com|ytimg\.com/.test(
      url.hostname + url.pathname
    );

  // Never cache live data or third-party media; just try the network.
  if (isLiveApi) {
    event.respondWith(fetch(request).catch(() => new Response("", { status: 504 })));
    return;
  }

  // App shell + the heavy vendored globe lib: network-first so updates show immediately
  // while online, refreshing the cache each time; fall back to cache (then the app shell)
  // when offline. This keeps the PWA installable/offline without serving stale code.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && url.origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
  );
});
