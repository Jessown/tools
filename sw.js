/* 쓱툴 오프라인 지원: 사이트 파일은 인터넷 우선(없으면 저장본), 외부 라이브러리는 한 번 받으면 저장본 사용 */
var C = 'sseuk-v1';
var CORE = ['/tools.html', '/assets/config.js', '/assets/gas-shim.js', '/icon-192.png', '/icon-512.png', '/favicon.ico'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') return; var u = new URL(r.url);
  if (u.origin === location.origin) {
    e.respondWith(fetch(r).then(function (res) { if (res.ok) { var cp = res.clone(); caches.open(C).then(function (c) { c.put(r, cp); }); } return res; })
      .catch(function () { return caches.match(r, { ignoreSearch: u.pathname === '/tools.html' }).then(function (m) { return m || caches.match('/tools.html', { ignoreSearch: true }); }); }));
  } else if (/(^|\.)(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname)) {
    e.respondWith(caches.match(r).then(function (m) { return m || fetch(r).then(function (res) { if (res.ok || res.type === 'opaque') { var cp = res.clone(); caches.open(C).then(function (c) { c.put(r, cp); }); } return res; }); }));
  }
});
