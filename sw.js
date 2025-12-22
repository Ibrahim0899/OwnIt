// ====================================
// OwnIt Service Worker
// Progressive Web App - Offline Support
// ====================================

const CACHE_NAME = 'ownit-v1';
const STATIC_CACHE = 'ownit-static-v1';
const DYNAMIC_CACHE = 'ownit-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/auth.html',
    '/manifest.json',
    '/favicon.png',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    // Styles
    '/styles/design-system.css',
    '/styles/main.css',
    '/styles/navigation.css',
    '/styles/profile.css',
    '/styles/feed.css',
    '/styles/jobs.css',
    '/styles/messages.css',
    '/styles/network.css',
    '/styles/search.css',
    '/styles/ui-polish.css',
    '/styles/auth.css',
    // Core Scripts
    '/scripts/utils.js',
    '/scripts/mock-data.js',
    '/scripts/navigation.js',
    '/scripts/security.js',
    '/scripts/database.js',
    '/scripts/supabase-config.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => {
                console.error('[SW] Failed to cache:', err);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');

    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
                    .map((key) => {
                        console.log('[SW] Deleting old cache:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests (Supabase API, CDNs, etc.)
    if (!url.origin.includes(self.location.origin)) {
        return;
    }

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // API calls - Network first, cache fallback
    if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Static assets - Cache first, network fallback
    event.respondWith(cacheFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        // Update cache in background
        fetchAndCache(request);
        return cachedResponse;
    }

    return fetchAndCache(request);
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        // Fallback to cache on network failure
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page if available
        return caches.match('/offline.html');
    }
}

// Fetch and cache helper
async function fetchAndCache(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Fetch failed, returning offline content');
        return new Response('Offline', { status: 503 });
    }
}

// Push notification handler (for future implementation)
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();

    const options = {
        body: data.body || 'Nouvelle notification OwnIt',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        },
        actions: [
            { action: 'open', title: 'Ouvrir' },
            { action: 'close', title: 'Fermer' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'OwnIt', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') return;

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((windowClients) => {
            // Focus existing window if available
            for (const client of windowClients) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

console.log('[SW] Service Worker loaded');
