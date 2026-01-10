// BluePure PWA Service Worker
const CACHE_NAME = 'bluepure-v1.0.3';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'assets/icon.png'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('📦 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Installed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip Tidio and EmailJS requests
  if (event.request.url.includes('tidio') || 
      event.request.url.includes('emailjs') ||
      event.request.url.includes('fontawesome') ||
      event.request.url.includes('cdnjs')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the new response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, show offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for form submissions (if browser supports it)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    console.log('🔄 Background sync: Syncing form data');
    event.waitUntil(syncFormData());
  }
});

// Push notifications (if implemented later)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update from BluePure!',
    icon: 'assets/icon.png',
    badge: 'assets/icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore themes',
        icon: 'assets/icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'assets/icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BluePure', options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('🔔 Notification click received');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Sync form data when online (example function)
function syncFormData() {
  // Get pending submissions from IndexedDB
  // Send them to server
  // Clear after successful send
  return Promise.resolve();
}

// Periodic sync (if browser supports it)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-themes') {
      event.waitUntil(updateThemesCache());
    }
  });
}

// Update themes cache periodically
function updateThemesCache() {
  return fetch('/api/themes')
    .then(response => response.json())
    .then(themes => {
      // Update cache with new themes
      return caches.open(CACHE_NAME)
        .then(cache => {
          // Cache logic here
        });
    });
}
