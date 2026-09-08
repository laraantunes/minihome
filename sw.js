const CACHE_NAME = 'minihome-cache-v8';
const urlsToCache = [
  './index.php',
  './assets/css/style.css?v=8',
  './assets/js/app.js?v=8',
  './assets/js/settings.js?v=8',
  './assets/js/widgets/clock.js?v=8',
  './assets/js/widgets/weather.js?v=8',
  './assets/js/widgets/calendar.js?v=8',
  './assets/js/widgets/timer.js?v=8',
  './assets/js/widgets/stopwatch.js?v=8',
  './assets/js/widgets/todo.js?v=8',
  './assets/js/widgets/notes.js?v=8',
  './assets/js/widgets/search.js?v=8',
  './assets/favicon.jpg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
