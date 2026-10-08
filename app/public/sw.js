const CACHE_NAME = "fresh-to-home-v1";
const PRECACHE_ASSETS = [
   "/",
   "/offline.html",
   "/favicon.ico",
   "/favicon.svg",
   "/manifest.json"
];

self.addEventListener("install", (event) => {
   event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
         return cache.addAll(PRECACHE_ASSETS).catch((err) => {
            console.warn("[SW] Pre-caching items error:", err);
         });
      })
   );
   self.skipWaiting();
});

self.addEventListener("activate", (event) => {
   event.waitUntil(
      caches.keys().then((cacheNames) => {
         return Promise.all(
            cacheNames.map((name) => {
               if (name !== CACHE_NAME) {
                  return caches.delete(name);
               }
            })
         );
      })
   );
   self.clients.claim();
});

self.addEventListener("fetch", (event) => {
   // Only handle GET requests and http/https navigation or assets
   if (event.request.method !== "GET") return;

   const url = new URL(event.request.url);

   // Skip Next.js hot reload / socket requests
   if (url.pathname.startsWith("/_next/webpack-hmr")) return;

   // Handle document navigation (pages)
   if (event.request.mode === "navigate") {
      event.respondWith(
         fetch(event.request)
            .then((networkResponse) => {
               // Clone and cache the successfully fetched page for offline use
               if (networkResponse && networkResponse.status === 200) {
                  const responseToCache = networkResponse.clone();
                  caches.open(CACHE_NAME).then((cache) => {
                     cache.put(event.request, responseToCache);
                  });
               }
               return networkResponse;
            })
            .catch(async () => {
               // If network fails, try cached version first, then offline fallback page
               const cachedResponse = await caches.match(event.request);
               if (cachedResponse) {
                  return cachedResponse;
               }
               const offlinePage = await caches.match("/offline.html");
               if (offlinePage) {
                  return offlinePage;
               }
               return new Response(
                  "<!DOCTYPE html><html><body><h1>Offline</h1><p>No internet connection available.</p></body></html>",
                  { headers: { "Content-Type": "text/html" } }
               );
            })
      );
      return;
   }

   // For static assets (images, css, js, icons): Stale-While-Revalidate or Network-first with Cache fallback
   event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
         const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
               if (networkResponse && networkResponse.status === 200) {
                  const responseToCache = networkResponse.clone();
                  caches.open(CACHE_NAME).then((cache) => {
                     cache.put(event.request, responseToCache);
                  });
               }
               return networkResponse;
            })
            .catch(() => cachedResponse);

         return cachedResponse || fetchPromise;
      })
   );
});
