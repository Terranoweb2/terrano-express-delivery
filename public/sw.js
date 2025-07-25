// Service Worker pour Terrano-Express
// Gestion des notifications push en temps réel

const CACHE_NAME = 'terrano-express-v1';
const urlsToCache = [
  '/',
  '/menu',
  '/track',
  '/offline.html'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestion des requêtes (cache-first strategy)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Notification push reçue:', event);

  let notificationData = {};

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'Terrano Express',
        body: event.data.text() || 'Nouvelle notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png'
      };
    }
  }

  const {
    title = 'Terrano Express',
    body = 'Nouvelle notification',
    icon = '/icons/icon-192x192.png',
    badge = '/icons/badge-72x72.png',
    tag = 'terrano-notification',
    data = {},
    actions = [],
    requireInteraction = false,
    silent = false
  } = notificationData;

  const options = {
    body,
    icon,
    badge,
    tag,
    data,
    actions,
    requireInteraction,
    silent,
    vibrate: [200, 100, 200], // Pattern de vibration
    timestamp: Date.now(),
    renotify: true
  };

  // Personnaliser selon le type de notification
  if (data.type) {
    switch (data.type) {
      case 'order_confirmed':
        options.body = `Votre commande #${data.orderId} a été confirmée !`;
        options.icon = '/icons/order-confirmed.png';
        options.tag = 'order-confirmed';
        options.actions = [
          {
            action: 'track',
            title: 'Suivre',
            icon: '/icons/track-icon.png'
          },
          {
            action: 'dismiss',
            title: 'OK'
          }
        ];
        break;

      case 'driver_assigned':
        options.body = `${data.driverName} a pris en charge votre commande`;
        options.icon = '/icons/driver-assigned.png';
        options.tag = 'driver-assigned';
        options.actions = [
          {
            action: 'track',
            title: 'Suivre',
            icon: '/icons/track-icon.png'
          },
          {
            action: 'call_driver',
            title: 'Appeler',
            icon: '/icons/phone-icon.png'
          }
        ];
        break;

      case 'driver_approaching':
        options.body = `${data.driverName} arrive dans ${data.eta} minutes`;
        options.icon = '/icons/approaching.png';
        options.tag = 'driver-approaching';
        options.requireInteraction = true;
        options.vibrate = [300, 100, 300, 100, 300];
        options.actions = [
          {
            action: 'track',
            title: 'Voir position',
            icon: '/icons/location-icon.png'
          },
          {
            action: 'call_driver',
            title: 'Appeler',
            icon: '/icons/phone-icon.png'
          }
        ];
        break;

      case 'driver_arrived':
        options.body = `${data.driverName} est arrivé à votre adresse !`;
        options.icon = '/icons/arrived.png';
        options.tag = 'driver-arrived';
        options.requireInteraction = true;
        options.vibrate = [500, 200, 500, 200, 500];
        options.sound = '/sounds/arrival.mp3';
        break;

      case 'delivery_completed':
        options.body = 'Votre commande a été livrée avec succès !';
        options.icon = '/icons/delivered.png';
        options.tag = 'delivery-completed';
        options.actions = [
          {
            action: 'rate',
            title: 'Noter',
            icon: '/icons/star-icon.png'
          },
          {
            action: 'reorder',
            title: 'Recommander',
            icon: '/icons/reorder-icon.png'
          }
        ];
        break;

      case 'chat_message':
        options.body = `${data.senderName}: ${data.message}`;
        options.icon = '/icons/chat.png';
        options.tag = 'chat-message';
        options.actions = [
          {
            action: 'reply',
            title: 'Répondre',
            icon: '/icons/reply-icon.png'
          },
          {
            action: 'view_chat',
            title: 'Voir conversation'
          }
        ];
        break;

      case 'promotion':
        options.body = data.message;
        options.icon = '/icons/promo.png';
        options.tag = 'promotion';
        options.actions = [
          {
            action: 'view_offer',
            title: 'Voir l\'offre'
          },
          {
            action: 'order_now',
            title: 'Commander'
          }
        ];
        break;

      default:
        // Notification générique
        break;
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Clic sur notification:', event);

  const { notification, action } = event;
  const data = notification.data || {};

  event.notification.close();

  event.waitUntil(
    (async () => {
      const windowClients = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      let url = '/';

      // Déterminer l'URL selon l'action
      switch (action) {
        case 'track':
          url = data.orderId ? `/track/${data.orderId}` : '/track';
          break;
        case 'call_driver':
          if (data.driverPhone) {
            url = `tel:${data.driverPhone}`;
            return clients.openWindow(url);
          }
          break;
        case 'view_chat':
          url = `/chat/${data.orderId || data.chatId}`;
          break;
        case 'rate':
          url = `/rate/${data.orderId}`;
          break;
        case 'reorder':
          url = `/reorder/${data.orderId}`;
          break;
        case 'view_offer':
          url = `/promotions/${data.promoId}`;
          break;
        case 'order_now':
          url = '/menu';
          break;
        case 'reply':
          // Ouvrir interface de réponse rapide
          url = `/chat/${data.orderId}?quickReply=true`;
          break;
        case 'dismiss':
          return; // Ne rien faire
        default:
          // Clic général sur la notification
          if (data.orderId) {
            url = `/track/${data.orderId}`;
          } else {
            url = '/';
          }
      }

      // Chercher une fenêtre existante avec cette URL
      for (const client of windowClients) {
        if (client.url.includes(url.split('?')[0]) && 'focus' in client) {
          return client.focus();
        }
      }

      // Ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })()
  );
});

// Gestion de la fermeture des notifications
self.addEventListener('notificationclose', (event) => {
  console.log('Notification fermée:', event.notification.tag);

  // Analytics ou actions de nettoyage si nécessaire
  const data = event.notification.data || {};

  // Envoyer analytics
  if (data.trackClose) {
    fetch('/api/analytics/notification-closed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tag: event.notification.tag,
        data: data,
        timestamp: Date.now()
      })
    }).catch(err => console.log('Erreur analytics:', err));
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Synchroniser les données hors ligne
      syncOfflineData()
    );
  }
});

async function syncOfflineData() {
  try {
    // Récupérer et envoyer les données mises en cache hors ligne
    const cache = await caches.open('offline-data');
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        console.log('Erreur sync:', error);
      }
    }
  } catch (error) {
    console.log('Erreur synchronisation:', error);
  }
}

// Gestion des messages du client principal
self.addEventListener('message', (event) => {
  console.log('Message reçu dans SW:', event.data);

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
      case 'CLEAR_CACHE':
        caches.delete(CACHE_NAME);
        break;
    }
  }
});
