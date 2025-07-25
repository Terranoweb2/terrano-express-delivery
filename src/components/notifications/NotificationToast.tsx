"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  Package,
  Navigation,
  CheckCircle,
  MessageCircle,
  X,
  Phone,
  MapPin,
  Clock,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NotificationData } from '@/hooks/useNotifications';

interface ToastNotification extends NotificationData {
  id: string;
  timestamp: number;
  progress?: number;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationToastProps {
  maxNotifications?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  enableSound?: boolean;
}

export default function NotificationToast({
  maxNotifications = 3,
  position = 'top-right',
  enableSound = true
}: NotificationToastProps) {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Initialiser côté client pour éviter l'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Jouer un son de notification
  const playNotificationSound = useCallback((type: string) => {
    if (!enableSound || typeof window === 'undefined') return;

    try {
      // Créer un son selon le type
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Fréquences différentes selon le type
      switch (type) {
        case 'driver_approaching':
        case 'driver_arrived':
          // Son plus urgent
          oscillator.frequency.setValueAtTime(800, context.currentTime);
          oscillator.frequency.setValueAtTime(600, context.currentTime + 0.1);
          break;
        case 'chat_message':
          // Son doux
          oscillator.frequency.setValueAtTime(400, context.currentTime);
          break;
        default:
          // Son standard
          oscillator.frequency.setValueAtTime(520, context.currentTime);
      }

      // Volume et durée
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

      oscillator.type = 'sine';
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.3);
    } catch (error) {
      console.warn('Impossible de jouer le son de notification:', error);
    }
  }, [enableSound]);

  // Ajouter une notification
  const addNotification = useCallback((data: NotificationData) => {
    const notification: ToastNotification = {
      ...data,
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      autoClose: !data.requireInteraction,
      duration: data.requireInteraction ? 0 : (data.type === 'chat_message' ? 3000 : 5000)
    };

    setNotifications(prev => {
      // Éviter les doublons
      const existing = prev.find(n =>
        n.type === notification.type &&
        n.orderId === notification.orderId &&
        Date.now() - n.timestamp < 30000
      );

      if (existing) return prev;

      // Limiter le nombre de notifications
      const newNotifications = [notification, ...prev].slice(0, maxNotifications);
      return newNotifications;
    });

    // Son des notifications
    if (enableSound && data.sound !== false) {
      playNotificationSound(data.type);
    }

    // Fermeture automatique
    if (notification.autoClose && notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    }

  }, [maxNotifications, enableSound, playNotificationSound, removeNotification]);

  // Supprimer toutes les notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Écouter les événements de notification personnalisés
  useEffect(() => {
    const handleCustomNotification = (event: CustomEvent<NotificationData>) => {
      addNotification(event.detail);
    };

    window.addEventListener('terrano-notification' as any, handleCustomNotification);

    return () => {
      window.removeEventListener('terrano-notification' as any, handleCustomNotification);
    };
  }, [addNotification]);

  // Hook pour que d'autres composants puissent envoyer des notifications
  useEffect(() => {
    (window as any).terranoNotify = addNotification;

    return () => {
      delete (window as any).terranoNotify;
    };
  }, [addNotification]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_confirmed':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'driver_assigned':
        return <Navigation className="h-5 w-5 text-blue-500" />;
      case 'driver_approaching':
        return <MapPin className="h-5 w-5 text-orange-500" />;
      case 'driver_arrived':
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case 'delivery_completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'chat_message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'promotion':
        return <Tag className="h-5 w-5 text-pink-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order_confirmed':
        return 'border-green-200 bg-green-50';
      case 'driver_assigned':
        return 'border-blue-200 bg-blue-50';
      case 'driver_approaching':
        return 'border-orange-200 bg-orange-50';
      case 'driver_arrived':
        return 'border-purple-200 bg-purple-50';
      case 'delivery_completed':
        return 'border-green-200 bg-green-50';
      case 'chat_message':
        return 'border-blue-200 bg-blue-50';
      case 'promotion':
        return 'border-pink-200 bg-pink-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleAction = (notification: ToastNotification, actionType: string) => {
    const { orderId, driverPhone, chatId, promoId } = notification;

    switch (actionType) {
      case 'track':
        if (orderId) {
          window.open(`/track/${orderId}`, '_blank');
        }
        break;
      case 'call_driver':
        if (driverPhone) {
          window.open(`tel:${driverPhone}`);
        }
        break;
      case 'view_chat':
        if (chatId || orderId) {
          window.open(`/chat/${chatId || orderId}`, '_blank');
        }
        break;
      case 'view_offer':
        if (promoId) {
          window.open(`/promotions/${promoId}`, '_blank');
        }
        break;
      case 'rate':
        if (orderId) {
          window.open(`/rate/${orderId}`, '_blank');
        }
        break;
      case 'reorder':
        if (orderId) {
          window.open(`/reorder/${orderId}`, '_blank');
        }
        break;
    }

    removeNotification(notification.id);
  };



  const getPositionClasses = () => {
    const base = 'fixed z-50 space-y-3 max-w-sm w-full';
    switch (position) {
      case 'top-right':
        return `${base} top-4 right-4`;
      case 'top-left':
        return `${base} top-4 left-4`;
      case 'bottom-right':
        return `${base} bottom-4 right-4`;
      case 'bottom-left':
        return `${base} bottom-4 left-4`;
      default:
        return `${base} top-4 right-4`;
    }
  };

  if (!isClient || !isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <>
      {/* Notifications */}
      <div className={getPositionClasses()}>
        {notifications.map((notification, index) => (
          <Card
            key={notification.id}
            className={`${getNotificationColor(notification.type)} border shadow-lg animate-in slide-in-from-right-full duration-300`}
            style={{
              animationDelay: `${index * 100}ms`,
              transform: `translateY(${index * 4}px)`,
              zIndex: 1000 - index
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900 leading-tight">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 leading-tight">
                        {notification.message}
                      </p>

                      {/* Informations supplémentaires */}
                      {notification.eta && (
                        <div className="flex items-center space-x-1 mt-2">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            Arrivée dans {notification.eta} min
                          </span>
                        </div>
                      )}

                      {notification.driverName && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Navigation className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {notification.driverName}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Actions */}
                  {notification.actions && notification.actions.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      {notification.actions.slice(0, 2).map((action) => (
                        <Button
                          key={action.action}
                          size="sm"
                          variant={action.action === 'track' || action.action === 'view_chat' ? 'default' : 'outline'}
                          onClick={() => handleAction(notification, action.action)}
                          className="text-xs h-7 px-2"
                        >
                          {action.action === 'call_driver' && <Phone className="h-3 w-3 mr-1" />}
                          {action.action === 'track' && <MapPin className="h-3 w-3 mr-1" />}
                          {action.action === 'view_chat' && <MessageCircle className="h-3 w-3 mr-1" />}
                          {action.title}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Barre de progression pour auto-close */}
                  {notification.autoClose && notification.duration && notification.duration > 0 && (
                    <div className="mt-3">
                      <Progress
                        value={((Date.now() - notification.timestamp) / notification.duration) * 100}
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Bouton pour tout effacer */}
        {notifications.length > 1 && (
          <div className="flex justify-center mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Tout effacer ({notifications.length})
            </Button>
          </div>
        )}
      </div>

      {/* Overlay pour masquer temporairement */}
      {notifications.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="fixed bottom-4 right-4 z-40 text-xs text-gray-500 hover:text-gray-700"
          style={{ marginRight: position.includes('right') ? '100px' : '0' }}
        >
          Masquer ({notifications.length})
        </Button>
      )}
    </>
  );
}

// Hook pour envoyer des notifications depuis n'importe quel composant
export function useToastNotification() {
  const notify = useCallback((data: NotificationData) => {
    if (typeof window !== 'undefined' && (window as any).terranoNotify) {
      (window as any).terranoNotify(data);
    } else {
      // Fallback: dispatch custom event
      const event = new CustomEvent('terrano-notification', { detail: data });
      window.dispatchEvent(event);
    }
  }, []);

  return { notify };
}
