// Simple service worker for Polis PWA
const CACHE_NAME = 'polis-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './apple-touch-icon.png',
  './assets/images/home/municipio.webp',
  './assets/images/home/projects.webp',
  './assets/images/home/funding.webp',
  './assets/images/home/publicacoes.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 