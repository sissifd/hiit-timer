// HIIT Timer Service Worker
// Version — bump this to force cache refresh after updates
const CACHE_VERSION = 'hiit-v1';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const FONT_CACHE    = `${CACHE_VERSION}-fonts`;

// Files to cache immediately on install
const STATIC_ASSETS = [
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// ── INSTALL: pre-cache static assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean up old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('hiit-') && key !== STATIC_CACHE && key !== FONT_CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: serve from cache, fall back to network ──
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Google Fonts — cache-first with font cache
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // Firebase & external APIs — network only (always fresh)
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') && !url.pathname.includes('fonts')
  ) {
    event.respondWith(fetch(request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // App shell & static assets — cache-first, network fallback
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        // Cache successful GET responses
        if (request.method === 'GET' && response.status === 200) {
          caches.open(STATIC_CACHE).then(cache => cache.put(request, response.clone()));
        }
        return response;
      }).catch(() => {
        // Offline fallback: return index.html for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// ── BACKGROUND SYNC: re-save pending data when back online ──
self.addEventListener('sync', event => {
  if (event.tag === 'sync-workouts') {
    event.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  // Handled by the app itself via Firestore's offline persistence
  console.log('[SW] Background sync triggered');
}

// ── PUSH NOTIFICATIONS (future use) ──
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'HIIT Timer', {
      body: data.body || 'Zeit für dein Workout! 💪',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      vibrate: [200, 100, 200]
    })
  );
});
