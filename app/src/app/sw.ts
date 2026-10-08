/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "fresh-to-home-v1";
const STATIC_ASSETS = ["/", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"];

self.addEventListener("install", (event: ExtendableEvent) => {
   event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
         return cache.addAll(STATIC_ASSETS);
      })
   );
   self.skipWaiting();
});

self.addEventListener("activate", (event: ExtendableEvent) => {
   event.waitUntil(
      caches.keys().then((cacheNames) => {
         return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
      })
   );
   self.clients.claim();
});

self.addEventListener("fetch", (event: FetchEvent) => {
   // Only handle GET requests
   if (event.request.method !== "GET") return;
   // Skip cross-origin requests
   if (!event.request.url.startsWith(self.location.origin)) return;

   event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
         if (cachedResponse) {
            return cachedResponse;
         }
         return fetch(event.request)
            .then((response) => {
               if (response && response.status === 200 && response.type === "basic") {
                  const responseToCache = response.clone();
                  caches.open(CACHE_NAME).then((cache) => {
                     cache.put(event.request, responseToCache);
                  });
               }
               return response;
            })
            .catch(() => {
               if (event.request.mode === "navigate") {
                  return caches.match("/");
               }
               return new Response("Network error occurred", { status: 408, headers: { "Content-Type": "text/plain" } });
            }) as Promise<Response>;
      })
   );
});

export {};
