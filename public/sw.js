const CACHE_NAME = 'theodore-photos-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

const isDevRequest = (url) => {
  return url.includes('/@vite/') || url.includes('/src/') || url.includes('/node_modules/') || url.includes('/@react-refresh');
};

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isDevAsset = isSameOrigin && isDevRequest(requestUrl.href);

  if (!isSameOrigin || isDevAsset) {
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, responseToCache);
        }

        return networkResponse;
      } catch {
        const fallback = await caches.match('/index.html');
        return fallback || new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});