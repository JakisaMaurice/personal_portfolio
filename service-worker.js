/**
 * Progressive Web App Service Worker
 * Advanced Caching and Offline Functionality
 * Version: 5.0.0
 * Created: 2025-11-28
 */

const CACHE_NAME = 'maurice-portfolio-v5.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/resume.html',
  '/projects.html',
  '/contact.html',
  '/blog.html',
  OFFLINE_URL,
  '/assets/css/style.css',
  '/assets/css/main.css',
  '/assets/css/about.css',
  '/assets/css/contact.css',
  '/assets/css/projects.css',
  '/assets/js/main.js',
  '/assets/js/analytics.js',
  '/assets/fontawesome/css/all.min.css',
  '/assets/images/profile picture.jpg',
  '/assets/images/banner_image.jpg',
  '/assets/images/banner_image2.jpg',
  '/manifest.json'
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install Event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Cache install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate Event');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with appropriate strategies
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle different request types with appropriate strategies
  if (event.request.url.includes('/api/')) {
    // API requests - network first with cache fallback
    event.respondWith(networkFirstStrategy(event.request));
  } else if (event.request.destination === 'image') {
    // Images - cache first
    event.respondWith(cacheFirstStrategy(event.request));
  } else if (event.request.destination === 'style' || 
             event.request.destination === 'script') {
    // CSS/JS - stale while revalidate
    event.respondWith(staleWhileRevalidateStrategy(event.request));
  } else {
    // HTML pages - network first with offline fallback
    event.respondWith(networkFirstWithOfflineFallback(event.request));
  }
});

// Cache-first strategy (good for static assets)
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache first strategy failed:', error);
    throw error;
  }
}

// Network-first strategy (good for dynamic content)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network first - falling back to cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale-while-revalidate strategy (good for frequently updated static content)
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || networkResponsePromise;
}

// Network-first with offline fallback (good for HTML pages)
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network first - falling back to cache and offline page');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, serve offline page
    const offlineResponse = await caches.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // If no offline page, return basic error response
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
  
  if (event.tag === 'newsletter-sync') {
    event.waitUntil(syncNewsletterSubscription());
  }
});

// Sync contact form submissions
async function syncContactForm() {
  try {
    const db = await openDB();
    const pendingForms = await getPendingForms(db);
    
    for (const form of pendingForms) {
      try {
        const response = await fetch('/api/contact.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          await removePendingForm(db, form.id);
          console.log('[Service Worker] Contact form synced successfully');
        }
      } catch (error) {
        console.error('[Service Worker] Contact form sync failed:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Background sync error:', error);
  }
}

// Sync newsletter subscriptions
async function syncNewsletterSubscription() {
  try {
    const db = await openDB();
    const pendingSubscriptions = await getPendingSubscriptions(db);
    
    for (const subscription of pendingSubscriptions) {
      try {
        const response = await fetch('/newsletter.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription.data)
        });
        
        if (response.ok) {
          await removePendingSubscription(db, subscription.id);
          console.log('[Service Worker] Newsletter subscription synced successfully');
        }
      } catch (error) {
        console.error('[Service Worker] Newsletter sync failed:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Newsletter sync error:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'View Portfolio',
          icon: '/assets/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/icons/xmark.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Notification was closed
    console.log('[Service Worker] Notification was closed');
  }
});

// Utility functions for IndexedDB operations
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('portfolio-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores
      if (!db.objectStoreNames.contains('pending-forms')) {
        db.createObjectStore('pending-forms', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('pending-subscriptions')) {
        db.createObjectStore('pending-subscriptions', { keyPath: 'id' });
      }
    };
  });
}

async function getPendingForms(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-forms'], 'readonly');
    const store = transaction.objectStore('pending-forms');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removePendingForm(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-forms'], 'readwrite');
    const store = transaction.objectStore('pending-forms');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getPendingSubscriptions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-subscriptions'], 'readonly');
    const store = transaction.objectStore('pending-subscriptions');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removePendingSubscription(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-subscriptions'], 'readwrite');
    const store = transaction.objectStore('pending-subscriptions');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(event.data.urls))
        .then(() => event.ports[0].postMessage({ success: true }))
        .catch((error) => event.ports[0].postMessage({ error: error.message }))
    );
  }
});

// Periodic background sync (experimental)
self.addEventListener('periodicsync', (event) => {
  console.log('[Service Worker] Periodic sync:', event.tag);
  
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  try {
    // Sync latest blog posts, updates, etc.
    const response = await fetch('/api/updates');
    if (response.ok) {
      const updates = await response.json();
      console.log('[Service Worker] Content synced:', updates);
    }
  } catch (error) {
    console.error('[Service Worker] Content sync failed:', error);
  }
}

console.log('[Service Worker] Service Worker loaded successfully');