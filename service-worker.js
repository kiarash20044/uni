// /service-worker.js

const CACHE_NAME = 'student-dashboard-v1';
const URLS_TO_CACHE = [
    // Core App Shell
    '/',
    '/index.html',
    '/css/main.css',
    '/css/variables.css',
    '/css/base.css',
    '/css/effects.css',
    '/css/rtl.css',
    '/css/components/Sidebar.css',
    '/css/components/StatCard.css',
    '/js/app.js',
    '/js/router.js',
    '/js/state.js',
    '/js/services/i18nService.js',
    '/js/services/storageService.js',
    '/js/utils/animations.js',
    '/js/utils/dom.js',
    '/js/components/Sidebar.js',
    '/js/components/TopNav.js',
    '/js/components/StatCard.js',
    '/js/pages/home.js',
    '/favicon.ico',

    // External CDN Assets
    'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/jalaali-js/dist/jalaali.js',
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;700&family=Poppins:wght@300;400;600&family=Fira+Code:wght@400;600&display=swap'
];

// --- INSTALL Event: Cache the application shell ---
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// --- ACTIVATE Event: Clean up old caches ---
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

// --- FETCH Event: Serve from cache first ---
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // Not in cache - fetch from network
                return fetch(event.request);
            })
    );
});