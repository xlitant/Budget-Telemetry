// Bump this version string whenever you edit index.html so phones pick up the change.
const CACHE = "budget-telemetry-v5";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/d3@7/dist/d3.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
];

// Cache everything on install so the app works fully offline afterwards.
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      // Individual failures shouldn't abort the whole install.
      Promise.allSettled(ASSETS.map((url) => c.add(url)))
    )
  );
  self.skipWaiting();
});

// Clear out old versions when the cache name changes.
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first, falling back to network, then refreshing the cache in the background.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || fetched;
    })
  );
});
