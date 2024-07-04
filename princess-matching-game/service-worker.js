const CACHE_NAME = 'princess-matching-game-cache-v1.4';
const domain = 'https://naosk8.github.io';
const urlsToCache = [
    '/kids-software-with-gpt/princess-matching-game/',
    '/kids-software-with-gpt/princess-matching-game/index.html',
    '/kids-software-with-gpt/princess-matching-game/styles.css',
    '/kids-software-with-gpt/princess-matching-game/scripts.js',
    '/kids-software-with-gpt/princess-matching-game/princess/1.png',
    '/kids-software-with-gpt/princess-matching-game/princess/2.png',
    '/kids-software-with-gpt/princess-matching-game/princess/3.png',
    '/kids-software-with-gpt/princess-matching-game/princess/4.png',
    '/kids-software-with-gpt/princess-matching-game/princess/5.png',
    '/kids-software-with-gpt/princess-matching-game/princess/6.png',
    '/kids-software-with-gpt/princess-matching-game/princess/7.png',
    '/kids-software-with-gpt/princess-matching-game/princess/8.png',
    '/kids-software-with-gpt/princess-matching-game/princess/9.png',
    '/kids-software-with-gpt/princess-matching-game/princess/10.png',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache.map(path => new URL(path, domain).toString()));
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
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
