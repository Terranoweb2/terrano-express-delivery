"use client";

import { useState, useEffect } from 'react';
import { Bell, BellOff, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationPermissionProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  showAsCard?: boolean;
  compact?: boolean;
}

export default function NotificationPermission({
  onPermissionGranted,
  onPermissionDenied,
  showAsCard = false,
  compact = false
}: NotificationPermissionProps) {
  const {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe
  } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const result = await requestPermission();

      if (result === 'granted') {
        // Essayer de s'abonner automatiquement
        const subscribed = await subscribe();
        if (subscribed) {
          onPermissionGranted?.();
        }
      } else {
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error('Erreur permission notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSubscription = async () => {
    setIsLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        const result = permission === 'granted'
          ? await subscribe()
          : await requestPermission().then(perm =>
              perm === 'granted' ? subscribe() : false
            );

        if (result) {
          onPermissionGranted?.();
        }
      }
    } catch (error) {
      console.error('Erreur toggle subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (!isSupported) {
      return {
        icon: <BellOff className="h-5 w-5 text-gray-400" />,
        title: 'Non supporté',
        description: 'Votre navigateur ne supporte pas les notifications push',
        color: 'gray',
        action: null
      };
    }

    switch (permission) {
      case 'granted':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          title: isSubscribed ? 'Notifications activées' : 'Permission accordée',
          description: isSubscribed
            ? 'Vous recevrez des notifications en temps réel'
            : 'Cliquez pour activer les notifications',
          color: 'green',
          action: isSubscribed ? 'Désactiver' : 'Activer'
        };

      case 'denied':
        return {
          icon: <BellOff className="h-5 w-5 text-red-500" />,
          title: 'Permission refusée',
          description: 'Activez les notifications dans les paramètres de votre navigateur',
          color: 'red',
          action: null
        };

      default:
        return {
          icon: <Bell className="h-5 w-5 text-orange-500" />,
          title: 'Activer les notifications',
          description: 'Recevez des alertes quand votre livreur approche',
          color: 'orange',
          action: 'Activer'
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {statusInfo.icon}
        <span className="text-sm">
          {statusInfo.title}
        </span>
        {statusInfo.action && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleToggleSubscription}
            disabled={isLoading}
            className="text-xs"
          >
            {isLoading ? 'Chargement...' : statusInfo.action}
          </Button>
        )}
      </div>
    );
  }

  if (showAsCard) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-orange-900">
            {statusInfo.icon}
            <span>{statusInfo.title}</span>
            <Badge variant="secondary" className="bg-orange-200 text-orange-800">
              {permission === 'granted' && isSubscribed ? 'Actif' : 'Inactif'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-800 mb-4">{statusInfo.description}</p>

          {!showDetails && statusInfo.action && (
            <div className="space-y-3">
              <Button
                onClick={handleToggleSubscription}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Chargement...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <span>{statusInfo.action} les notifications</span>
                  </div>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowDetails(true)}
                className="w-full text-orange-700 hover:bg-orange-100"
              >
                En savoir plus
              </Button>
            </div>
          )}

          {showDetails && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">
                  Que sont les notifications push ?
                </h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Alertes quand votre commande est confirmée</li>
                  <li>• Notification quand le livreur prend votre commande</li>
                  <li>• Alerte quand le livreur approche (1km)</li>
                  <li>• Notification d'arrivée du livreur</li>
                  <li>• Messages du livreur en temps réel</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">
                  Confidentialité et sécurité
                </h4>
                <p className="text-sm text-orange-800">
                  Vos données restent privées. Nous n'utilisons les notifications que
                  pour améliorer votre expérience de livraison. Vous pouvez les
                  désactiver à tout moment.
                </p>
              </div>

              <div className="flex space-x-2">
                {statusInfo.action && (
                  <Button
                    onClick={handleToggleSubscription}
                    disabled={isLoading}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isLoading ? 'Chargement...' : statusInfo.action}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Vue bannière simple
  return (
    <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        {statusInfo.icon}
        <div className="flex-1">
          <h3 className="font-medium text-orange-900">{statusInfo.title}</h3>
          <p className="text-sm text-orange-800 mt-1">{statusInfo.description}</p>

          {statusInfo.action && (
            <div className="mt-3 flex space-x-2">
              <Button
                size="sm"
                onClick={handleToggleSubscription}
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isLoading ? 'Chargement...' : statusInfo.action}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDetails(true)}
                className="text-orange-700 hover:bg-orange-200"
              >
                En savoir plus
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher le statut en mini format
export function NotificationStatus() {
  const { permission, isSubscribed } = useNotifications();

  const getStatusIcon = () => {
    if (permission === 'granted' && isSubscribed) {
      return <Bell className="h-4 w-4 text-green-500" />;
    } else if (permission === 'denied') {
      return <BellOff className="h-4 w-4 text-red-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {getStatusIcon()}
      <span className="text-xs text-gray-600">
        {permission === 'granted' && isSubscribed ? 'Actif' : 'Inactif'}
      </span>
    </div>
  );
}
