const urlParams = new URL(location.href).searchParams;
const version = urlParams.get('v') || '2.6.4';
const CACHE_NAME = 'minihome-cache-v' + version;

const urlsToCache = [
  './index.php',
  './assets/css/style.css?v=' + version,
  './assets/js/db.js?v=' + version,
  './assets/js/app.js?v=' + version,
  './assets/js/settings.js?v=' + version,
  './assets/js/widgets/clock.js?v=' + version,
  './assets/js/widgets/weather.js?v=' + version,
  './assets/js/widgets/calendar.js?v=' + version,
  './assets/js/widgets/timer.js?v=' + version,
  './assets/js/widgets/stopwatch.js?v=' + version,
  './assets/js/widgets/todo.js?v=' + version,
  './assets/js/widgets/notes.js?v=' + version,
  './assets/js/widgets/search.js?v=' + version,
  './assets/js/widgets/shortener.js?v=' + version,
  './assets/js/widgets/links.js?v=' + version,
  './assets/js/widgets/rss.js?v=' + version,
  './assets/js/widgets/miniplayer.js?v=' + version,
  './assets/js/screensaver.js?v=' + version,
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
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});
