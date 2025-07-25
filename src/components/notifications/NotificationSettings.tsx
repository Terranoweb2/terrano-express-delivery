"use client";

import { useState } from 'react';
import {
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Smartphone,
  Package,
  MessageCircle,
  Tag,
  Settings as SettingsIcon,
  Save,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationSettingsProps {
  onClose?: () => void;
  showAsDialog?: boolean;
}

export default function NotificationSettings({
  onClose,
  showAsDialog = false
}: NotificationSettingsProps) {
  const {
    isSupported,
    permission,
    isSubscribed,
    settings,
    updateSettings,
    subscribe,
    unsubscribe,
    showLocalNotification
  } = useNotifications();

  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
    onClose?.();
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  const handleTestNotification = () => {
    showLocalNotification({
      type: 'order_confirmed',
      title: 'Test de notification',
      message: 'Ceci est un test de notification push pour Terrano Express',
      sound: localSettings.sound,
      vibrate: localSettings.vibration
    });
  };

  const settingsGroups = [
    {
      title: 'Notifications générales',
      icon: <Bell className="h-5 w-5" />,
      settings: [
        {
          key: 'enabled' as const,
          label: 'Activer les notifications',
          description: 'Recevoir toutes les notifications push',
          icon: <Bell className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Types de notifications',
      icon: <Package className="h-5 w-5" />,
      settings: [
        {
          key: 'orderUpdates' as const,
          label: 'Mises à jour de commande',
          description: 'Confirmation, préparation, prêt pour livraison',
          icon: <Package className="h-4 w-4" />
        },
        {
          key: 'driverUpdates' as const,
          label: 'Statut du livreur',
          description: 'Livreur assigné, en route, arrivé',
          icon: <Smartphone className="h-4 w-4" />
        },
        {
          key: 'chatMessages' as const,
          label: 'Messages du livreur',
          description: 'Notifications des messages du chat',
          icon: <MessageCircle className="h-4 w-4" />
        },
        {
          key: 'promotions' as const,
          label: 'Offres et promotions',
          description: 'Notifications des offres spéciales',
          icon: <Tag className="h-4 w-4" />
        }
      ]
    },
    {
      title: 'Préférences sonores',
      icon: <Volume2 className="h-5 w-5" />,
      settings: [
        {
          key: 'sound' as const,
          label: 'Son des notifications',
          description: 'Jouer un son lors des notifications',
          icon: <Volume2 className="h-4 w-4" />
        },
        {
          key: 'vibration' as const,
          label: 'Vibration',
          description: 'Vibrer lors des notifications importantes',
          icon: <Smartphone className="h-4 w-4" />
        }
      ]
    }
  ];

  const Content = () => (
    <div className="space-y-6">
      {/* Statut global */}
      <Card className={permission === 'granted' && isSubscribed ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {permission === 'granted' && isSubscribed ? (
                <Bell className="h-5 w-5 text-green-600" />
              ) : (
                <BellOff className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <p className="font-medium">
                  {permission === 'granted' && isSubscribed ? 'Notifications actives' : 'Notifications inactives'}
                </p>
                <p className="text-sm text-gray-600">
                  {!isSupported ? 'Non supporté par votre navigateur' :
                   permission === 'denied' ? 'Permission refusée - Activez dans les paramètres du navigateur' :
                   permission === 'default' ? 'Permission non demandée' :
                   !isSubscribed ? 'Abonnement requis' : 'Vous recevez les notifications'}
                </p>
              </div>
            </div>

            {permission === 'granted' && (
              <Button
                variant="outline"
                size="sm"
                onClick={isSubscribed ? unsubscribe : subscribe}
                className={isSubscribed ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'}
              >
                {isSubscribed ? 'Désactiver' : 'Activer'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Paramètres détaillés */}
      {settingsGroups.map((group, groupIndex) => (
        <Card key={groupIndex}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              {group.icon}
              <span>{group.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.settings.map((setting, settingIndex) => (
              <div key={setting.key}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {setting.icon}
                    <div>
                      <Label htmlFor={setting.key} className="text-sm font-medium">
                        {setting.label}
                      </Label>
                      <p className="text-xs text-gray-600">{setting.description}</p>
                    </div>
                  </div>
                  <Switch
                    id={setting.key}
                    checked={localSettings[setting.key]}
                    onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                    disabled={!isSupported || (setting.key !== 'enabled' && !localSettings.enabled)}
                  />
                </div>
                {settingIndex < group.settings.length - 1 && <Separator className="my-3" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Test et actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <SettingsIcon className="h-5 w-5" />
            <span>Test et actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleTestNotification}
              disabled={!isSupported || permission !== 'granted' || !localSettings.enabled}
              className="flex items-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span>Tester une notification</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => window.open('https://support.google.com/chrome/answer/3220216', '_blank')}
              className="flex items-center space-x-2"
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Aide navigateur</span>
            </Button>
          </div>

          {hasChanges && (
            <>
              <Separator />
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-800">Vous avez des modifications non sauvegardées</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleReset}
                    className="text-blue-600 hover:bg-blue-100"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Informations supplémentaires */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">À savoir</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Les notifications fonctionnent même quand l'onglet est fermé</li>
            <li>• Vous pouvez désactiver les notifications à tout moment</li>
            <li>• Les notifications importantes comme "livreur arrivé" ne peuvent pas être désactivées</li>
            <li>• Vos préférences sont sauvegardées localement</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  if (showAsDialog) {
    return (
      <div className="max-w-2xl mx-auto">
        <Content />
      </div>
    );
  }

  return <Content />;
}

// Composant pour afficher un résumé des paramètres
export function NotificationSettingsSummary() {
  const { settings, isSubscribed, permission } = useNotifications();

  const getActiveCount = () => {
    const keys: (keyof typeof settings)[] = ['orderUpdates', 'driverUpdates', 'chatMessages', 'promotions'];
    return keys.filter(key => settings[key]).length;
  };

  const activeCount = getActiveCount();
  const isActive = permission === 'granted' && isSubscribed && settings.enabled;

  return (
    <div className="flex items-center space-x-2 text-sm">
      {isActive ? (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Bell className="h-3 w-3 mr-1" />
          {activeCount}/4 types actifs
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          <BellOff className="h-3 w-3 mr-1" />
          Inactif
        </Badge>
      )}

      {settings.sound && (
        <Volume2 className="h-3 w-3 text-green-500" />
      )}
      {settings.vibration && (
        <Smartphone className="h-3 w-3 text-blue-500" />
      )}
    </div>
  );
}
