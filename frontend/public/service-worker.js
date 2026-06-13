const CACHE_NAME = 'smartcrop-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/public/favicon.svg'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (e) => {
  // Do not intercept API calls with standard cache; fetch from network directly or handle API cache separately
  if (e.request.url.includes('/api/')) {
    e.respondWith(
      fetch(e.request).catch(async () => {
        // If offline and saving scans, cache locally (future enhancement) or return error response
        const cache = await caches.open(CACHE_NAME);
        if (e.request.url.includes('/api/user/scans') && e.request.method === 'GET') {
          // If we have cached scans, return them
          const cachedResponse = await cache.match(e.request.url);
          if (cachedResponse) return cachedResponse;
        }
        return new Response(JSON.stringify({ error: 'You are currently offline. Local scan diagnostics will resume when reconnected.' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Caching strategy: Cache First, Fallback to Network for assets
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Only cache valid GET responses for static files
        if (networkResponse && networkResponse.status === 200 && e.request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If everything fails (e.g. offline and uncached), return index.html if it's navigation
        if (e.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
