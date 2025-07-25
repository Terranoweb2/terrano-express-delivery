"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

// Types pour les notifications
export interface NotificationData {
  type: 'order_confirmed' | 'driver_assigned' | 'driver_approaching' | 'driver_arrived' | 'delivery_completed' | 'chat_message' | 'promotion';
  title: string;
  message: string;
  orderId?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  eta?: number;
  senderName?: string;
  promoId?: string;
  chatId?: string;
  sound?: boolean;
  vibrate?: boolean;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface NotificationSettings {
  enabled: boolean;
  orderUpdates: boolean;
  driverUpdates: boolean;
  chatMessages: boolean;
  promotions: boolean;
  sound: boolean;
  vibration: boolean;
}

interface NotificationContextType {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  settings: NotificationSettings;
  requestPermission: () => Promise<NotificationPermission>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  sendNotification: (data: NotificationData) => Promise<boolean>;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  showLocalNotification: (data: NotificationData) => void;
}

// Contexte pour les notifications
const NotificationContext = createContext<NotificationContextType | null>(null);

// Configuration VAPID (à remplacer par vos vraies clés)
const VAPID_PUBLIC_KEY = 'BK8jJXvAuLxpD0vNJQyTwYZ9fNbdWj1KnP2CcF8jZhKqLm4OpQrSt3UvWxYz2AaBcDeFgHiJkLmNoPqRsTuVwX';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    orderUpdates: true,
    driverUpdates: true,
    chatMessages: true,
    promotions: false,
    sound: true,
    vibration: true
  });

  // Vérifier côté client seulement - corriger l'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialisation
  useEffect(() => {
    if (!isClient) return;

    const initNotifications = async () => {
      // Vérifier le support côté client
      const supported = typeof window !== 'undefined' &&
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;
      setIsSupported(supported);

      if (!supported) return;

      // Charger les paramètres depuis localStorage
      try {
        const savedSettings = localStorage.getItem('terrano-notification-settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.warn('Erreur chargement paramètres notifications:', error);
      }

      // Enregistrer le service worker
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);
        console.log('Service Worker enregistré:', reg);

        // Vérifier si déjà abonné
        const subscription = await reg.pushManager.getSubscription();
        setIsSubscribed(!!subscription);

        // Écouter les changements de permission
        if ('permissions' in navigator) {
          const result = await navigator.permissions.query({ name: 'notifications' });
          setPermission(result.state as NotificationPermission);

          result.addEventListener('change', () => {
            setPermission(result.state as NotificationPermission);
          });
        } else {
          setPermission(Notification.permission);
        }

      } catch (error) {
        console.error('Erreur enregistrement service worker:', error);
      }
    };

    initNotifications();
  }, [isClient]);

  // Demander la permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported || !isClient || typeof window === 'undefined') return 'denied';

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Erreur demande permission:', error);
      return 'denied';
    }
  }, [isSupported, isClient]);

  // S'abonner aux notifications push
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!registration || permission !== 'granted') return false;

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // Envoyer l'abonnement au serveur
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });

      if (response.ok) {
        setIsSubscribed(true);
        return true;
      } else {
        throw new Error('Erreur serveur lors de l\'abonnement');
      }
    } catch (error) {
      console.error('Erreur abonnement push:', error);
      return false;
    }
  }, [registration, permission]);

  // Se désabonner
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!registration) return false;

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();

        // Informer le serveur
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });
      }

      setIsSubscribed(false);
      return true;
    } catch (error) {
      console.error('Erreur désabonnement:', error);
      return false;
    }
  }, [registration]);

  // Envoyer une notification (via le serveur)
  const sendNotification = useCallback(async (data: NotificationData): Promise<boolean> => {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur envoi notification:', error);
      return false;
    }
  }, []);

  // Afficher une notification locale (sans serveur)
  const showLocalNotification = useCallback((data: NotificationData) => {
    if (permission !== 'granted' || !settings.enabled) return;

    // Vérifier si le type de notification est activé
    const typeEnabled =
      (data.type.includes('order') && settings.orderUpdates) ||
      (data.type.includes('driver') && settings.driverUpdates) ||
      (data.type === 'chat_message' && settings.chatMessages) ||
      (data.type === 'promotion' && settings.promotions);

    if (!typeEnabled) return;

    const notificationOptions: NotificationOptions = {
      body: data.message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: `terrano-${data.type}-${data.orderId || Date.now()}`,
      requireInteraction: data.requireInteraction || false,
      silent: !settings.sound,
      data: {
        type: data.type,
        orderId: data.orderId,
        driverId: data.driverId,
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        chatId: data.chatId,
        promoId: data.promoId
      }
    };

    // Ajouter les actions si supportées (API expérimentale)
    if (data.actions && 'actions' in Notification.prototype) {
      (notificationOptions as any).actions = data.actions.map(action => ({
        action: action.action,
        title: action.title,
        icon: action.icon
      }));
    }

    const notification = new Notification(data.title, notificationOptions);

    // Vibration si activée
    if (settings.vibration && 'vibrate' in navigator && data.vibrate !== false) {
      const pattern = getVibrationPattern(data.type);
      navigator.vibrate(pattern);
    }

    // Auto-close pour certains types
    if (data.type === 'chat_message' || data.type === 'promotion') {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    notification.onclick = () => {
      notification.close();

      // Navigation selon le type
      let url = '/';
      if (data.orderId) {
        url = `/track/${data.orderId}`;
      } else if (data.chatId) {
        url = `/chat/${data.chatId}`;
      } else if (data.promoId) {
        url = `/promotions/${data.promoId}`;
      }

      window.focus();
      window.location.href = url;
    };

  }, [permission, settings]);

  // Mettre à jour les paramètres
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      localStorage.setItem('terrano-notification-settings', JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  }, []);

  const value: NotificationContextType = {
    isSupported,
    permission,
    isSubscribed,
    settings,
    requestPermission,
    subscribe,
    unsubscribe,
    sendNotification,
    updateSettings,
    showLocalNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook pour utiliser les notifications
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications doit être utilisé dans un NotificationProvider');
  }
  return context;
}

// Fonctions utilitaires
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getVibrationPattern(type: string): number[] {
  switch (type) {
    case 'driver_approaching':
      return [300, 100, 300, 100, 300];
    case 'driver_arrived':
      return [500, 200, 500, 200, 500];
    case 'order_confirmed':
      return [200, 100, 200];
    case 'chat_message':
      return [100];
    default:
      return [200, 100, 200];
  }
}

// Hook pour notifications basées sur la proximité
export function useProximityNotifications() {
  const { showLocalNotification, settings } = useNotifications();
  const [lastPosition, setLastPosition] = useState<{lat: number; lng: number} | null>(null);

  const checkProximity = useCallback(async (
    driverPosition: {lat: number; lng: number},
    customerPosition: {lat: number; lng: number},
    driverName: string,
    orderId: string,
    driverPhone: string
  ) => {
    if (!settings.driverUpdates) return;

    const distance = calculateDistance(driverPosition, customerPosition);

    setLastPosition(prevLastPosition => {
      // Notification quand le livreur est à moins de 1km
      if (distance <= 1 && (!prevLastPosition || calculateDistance(prevLastPosition, customerPosition) > 1)) {
        showLocalNotification({
          type: 'driver_approaching',
          title: 'Votre livreur approche !',
          message: `${driverName} est à moins de 1km de votre adresse`,
          orderId,
          driverName,
          driverPhone,
          eta: Math.round(distance * 3), // Estimation 3min/km
          requireInteraction: true,
          vibrate: true,
          actions: [
            { action: 'track', title: 'Suivre' },
            { action: 'call_driver', title: 'Appeler' }
          ]
        });
      }

      // Notification quand le livreur est arrivé (moins de 100m)
      if (distance <= 0.1 && (!prevLastPosition || calculateDistance(prevLastPosition, customerPosition) > 0.1)) {
        showLocalNotification({
          type: 'driver_arrived',
          title: 'Votre livreur est arrivé !',
          message: `${driverName} est à votre adresse`,
          orderId,
          driverName,
          driverPhone,
          requireInteraction: true,
          vibrate: true
        });
      }

      return driverPosition;
    });
  }, [showLocalNotification, settings.driverUpdates]);

  return { checkProximity };
}

// Calcul de distance entre deux points (formule haversine)
function calculateDistance(pos1: {lat: number; lng: number}, pos2: {lat: number; lng: number}): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
  const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
