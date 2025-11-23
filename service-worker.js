const CACHE_NAME = 'ray-tracing-cache-v1';
const urlsToCache = [
    './index.html',
    //'./style.css', // Если вы вынесли CSS в отдельный файл
    './manifest.json',
    //'./icons/icon-192x192.png',
   // './icons/icon-512x512.png'
    // Добавьте сюда любые другие ресурсы, которые нужно кэшировать
];

self.addEventListener('install', event => {
    // Выполняем кэширование основных файлов
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // Перехватываем запросы и отдаем закэшированные файлы, если они есть
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Кэш найден -> отдаем его
                if (response) {
                    return response;
                }
                // Кэш не найден -> делаем запрос к сети
                return fetch(event.request);
            }
        )
    );
});

self.addEventListener('activate', event => {
    // Очищаем старые кэши при обновлении сервис-воркера
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
