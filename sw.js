// ═══════════════════════════════════════════════
//  뉴스 모니터 - Service Worker
//  브라우저 알림 처리 + 오프라인 캐시
// ═══════════════════════════════════════════════

const CACHE = 'news-monitor-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

// ── Install: 핵심 파일 캐시 ──
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// ── Activate: 구버전 캐시 정리 ──
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: 캐시 우선, 네트워크 폴백 ──
self.addEventListener('fetch', evt => {
  if (evt.request.url.includes('rss2json') ||
      evt.request.url.includes('googleapis') ||
      evt.request.url.includes('news.google')) return;

  evt.respondWith(
    caches.match(evt.request).then(cached => {
      return cached || fetch(evt.request).then(res => {
        if (res && res.status === 200 && evt.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(evt.request, clone));
        }
        return res;
      }).catch(() => cached || new Response('오프라인 상태입니다', {status: 503}));
    })
  );
});

// ── Message: 메인 스레드에서 알림 요청 ──
self.addEventListener('message', evt => {
  if (!evt.data) return;
  if (evt.data.type === 'NOTIFY') {
    evt.waitUntil(
      self.registration.showNotification(evt.data.title || '뉴스 모니터', {
        body: evt.data.body || '새 알림이 있습니다',
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        tag: 'news-update',
        renotify: true,
        requireInteraction: false,
        data: { url: '/' }
      })
    );
  }
});

// ── Push: 외부 푸시 알림 ──
self.addEventListener('push', evt => {
  if (!evt.data) return;
  let payload = {};
  try { payload = evt.data.json(); } catch { payload = { title: '뉴스 모니터', body: evt.data.text() }; }
  evt.waitUntil(
    self.registration.showNotification(payload.title || '뉴스 모니터', {
      body: payload.body || '새 알림',
      icon: '/icon-192.png',
      tag: 'push-news',
      data: { url: payload.url || '/' }
    })
  );
});

// ── Notification Click: 클릭 시 앱 열기 ──
self.addEventListener('notificationclick', evt => {
  evt.notification.close();
  const url = evt.notification.data?.url || '/';
  evt.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wcs => {
      const existing = wcs.find(w => w.url.includes(self.registration.scope));
      if (existing) { existing.focus(); return existing.navigate(url); }
      return clients.openWindow(url);
    })
  );
});
