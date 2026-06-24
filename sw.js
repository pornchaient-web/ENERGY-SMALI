const CACHE_NAME = 'smartmeter-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css'
];

// ติดตั้ง Service Worker และบันทึกไฟล์ลง Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// เปิดใช้งานและลบ Cache เวอร์ชันเก่า
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// จัดการคำขอข้อมูล (โหลดจาก Cache ก่อน ถ้าไม่มีค่อยดึงจากเน็ต)
self.addEventListener('fetch', event => {
  // หากเป็นการเรียกไปยัง Google Apps Script (ดึงข้อมูลมิเตอร์) ไม่ต้องผ่าน Cache เพื่อให้ได้ข้อมูลใหม่เสมอ
  if (event.request.url.includes('script.google.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
