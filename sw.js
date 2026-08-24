/* PMCS Course Hub · Service Worker
   設計原則：
   1. 頁面本身一律「網路優先」—— 教師重新部署後，學生一連上網就會拿到新版，
      不會被舊快取鎖住（這是 PWA 最常見的坑）。離線時才退回快取。
   2. CDN 的 React／Tailwind／字型走「先給快取、背景更新」，載入快且離線可用。
   3. 版本號一改，舊快取全部清掉。 */

const VERSION = 'pmcs-hub-v1';
const SHELL = VERSION + '-shell';
const VENDOR = VERSION + '-vendor';

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

/* 這些外部資源允許快取；其餘一律不碰 */
const VENDOR_HOSTS = [
  'cdn.tailwindcss.com',
  'cdnjs.cloudflare.com',
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL)
      .then((c) => Promise.allSettled(SHELL_FILES.map((f) => c.add(f))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== SHELL && k !== VENDOR).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

  const sameOrigin = url.origin === self.location.origin;

  /* ① 導覽與同源檔案：網路優先，離線才用快取 */
  if (sameOrigin) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(SHELL).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
    );
    return;
  }

  /* ② 白名單 CDN：先給快取，背景更新 */
  if (VENDOR_HOSTS.indexOf(url.hostname) !== -1) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req).then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(VENDOR).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
  }
  /* 其餘一律不攔截 */
});
