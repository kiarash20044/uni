// /service-worker.js

const CACHE_NAME = 'student-dashboard-v1';
const URLS_TO_CACHE = [
    // Core App Shell
    '/',
    '/index.html',
    
    // CSS Files
    '/css/main.css',
    '/css/variables.css',
    '/css/base.css',
    '/css/effects.css',
    '/css/rtl.css',
    '/css/components/Sidebar.css',
    '/css/components/StatCard.css',
    '/css/components/Kanban.css',
    '/css/components/ThemeSwitcher.css',
    '/css/components/CircularProgress.css',
    '/css/components/Print.css',
    '/css/components/Tour.css',
    '/css/pages/Settings.css',
    '/css/pages/Timeline.css',

    // JS Files
    '/js/app.js',
    '/js/router.js',
    '/js/state.js',
    '/js/services/i18nService.js',
    '/js/services/storageService.js',
    '/js/utils/animations.js',
    '/js/utils/dom.js',
    '/js/components/Sidebar.js',
    '/js/components/TopNav.js',
    '/js/components/CircularProgress.js',
    '/js/pages/home.js',
    '/js/pages/tasks.js',
    '/js/pages/schedule.js',
    '/js/pages/settings.js',
    
    // Assets & Icons
    '/favicon.ico',

    // External CDN Assets
    'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/jalaali-js/dist/jalaali.js',
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;700&family=Poppins:wght@300;400;600&family=Fira+Code:wght@400;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://unpkg.com/@popperjs/core@2',
    'https://unpkg.com/tippy.js@6',
    'https://unpkg.com/tippy.js@6/dist/tippy-guided.umd.js'
];

// --- INSTALL Event: Cache the application shell ---
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(URLS_TO_CACHE.map(url => new Request(url, { cache: 'reload' })));
            })
            .catch(err => {
                console.error('Failed to cache:', err);
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

// --- FETCH Event: Serve from cache first, then network ---
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // Not in cache - fetch from network, and cache it for next time
                return fetch(event.request).then(
                    (networkResponse) => {
                        // Check if we received a valid response
                        if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            })
    );
});