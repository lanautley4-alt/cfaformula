/* Service worker — cache-first so the app works offline at the gym */
const CACHE = 'lift-v8';
const ASSETS = [
  './',
  'index.html',
  'style.css?v=5',
  'js/data.js?v=2',
  'js/progression.js?v=3',
  'js/app.js?v=6',
  'manifest.webmanifest',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Page loads go network-first so app updates appear on the next launch;
  // the cache is only the offline fallback.
  const isPage = e.request.mode === 'navigate' || e.request.url.endsWith('/index.html');
  if (isPage) {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match('index.html')))
    );
    return;
  }

  // Versioned assets are cache-first (new versions have new URLs)
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
