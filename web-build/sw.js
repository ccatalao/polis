// This is a simplified service worker based on Create React App patterns
const CACHE_NAME = 'polis-cache-v1';

// Basic assets to cache for offline support
const urlsToCache = [
  '/polis/',
  '/polis/index.html',
  '/polis/favicon.svg'
];

// Install event - cache basic assets
self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  
  // Skip waiting to take control immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - network first strategy for most requests
self.addEventListener('fetch', (event) => {
  if (!event.request.url.includes('/polis/')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
}); 