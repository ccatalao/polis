// Cache name with version - increment when making changes to force cache refresh
const CACHE_NAME = 'polis-cache-v1.1.3';

// Minimal set of files to cache for offline support
const urlsToCache = [
  '/polis/',
  '/polis/index.html',
  '/polis/404.html',
  '/polis/favicon.svg'
];

// Log function for better debugging
function logSW(message) {
  console.log(`[ServiceWorker ${CACHE_NAME}] ${message}`);
}

// Fast deletion of old caches
async function deleteOldCaches() {
  try {
    const cacheNames = await caches.keys();
    return Promise.all(
      cacheNames
        .filter(cacheName => cacheName !== CACHE_NAME)
        .map(cacheName => {
          logSW(`Deleting old cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
    );
  } catch (err) {
    logSW(`Error deleting caches: ${err}`);
    return Promise.resolve();
  }
}

// Minimal-impact install - don't block activation
self.addEventListener('install', event => {
  logSW('Installing new version');
  self.skipWaiting();
  
  // Create a cache in the background for essential files
  caches.open(CACHE_NAME)
    .then(cache => {
      logSW('Caching minimal app shell');
      return cache.addAll(urlsToCache);
    })
    .catch(err => {
      logSW(`Install cache error: ${err}`);
    });
});

// Fast activation
self.addEventListener('activate', event => {
  logSW('Activating new service worker');
  
  // Take control immediately
  event.waitUntil(clients.claim());
  
  // Clean up old caches in the background
  deleteOldCaches();
});

// Network-first approach for all requests
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // For navigation requests, try network first but fall back to index if needed
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => {
          logSW('Navigation fetch failed, using cached index.html');
          return caches.match('/polis/index.html');
        })
    );
    return;
  }
  
  // For all other requests, try network first, fall back to cache
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .catch(error => {
        logSW(`Fetch failed: ${error}`);
        return caches.match(event.request);
      })
  );
});

// Listen for messages from clients
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    logSW('skipWaiting command received');
    self.skipWaiting();
  }
  
  if (event.data === 'clearCaches') {
    logSW('clearCaches command received');
    deleteOldCaches();
  }
}); 