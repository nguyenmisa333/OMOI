// Service Worker tối giản — chỉ để đáp ứng PWA installability.
// Không cache gì cả → web hoạt động bình thường như trước.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
