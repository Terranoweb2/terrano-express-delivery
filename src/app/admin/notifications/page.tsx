"use client";

import { useState } from 'react';
import {
  Bell,
  Send,
  TestTube,
  Users,
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Package,
  Navigation,
  MessageCircle,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotifications } from '@/hooks/useNotifications';
import { useToastNotification } from '@/components/notifications/NotificationToast';
import NotificationSettings from '@/components/notifications/NotificationSettings';

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  data?: Record<string, any>;
}

const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'order_confirmed',
    name: 'Commande confirmée',
    type: 'order_confirmed',
    title: 'Commande confirmée !',
    message: 'Votre commande #CMD001 a été confirmée et est en préparation',
    icon: <Package className="h-5 w-5" />,
    color: 'bg-green-100 text-green-800',
    data: { orderId: 'CMD001' }
  },
  {
    id: 'driver_assigned',
    name: 'Livreur assigné',
    type: 'driver_assigned',
    title: 'Livreur assigné',
    message: 'Kouassi Jean a pris en charge votre commande',
    icon: <Navigation className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-800',
    data: { orderId: 'CMD001', driverName: 'Kouassi Jean', driverPhone: '+225 05 98 76 54 32' }
  },
  {
    id: 'driver_approaching',
    name: 'Livreur approche',
    type: 'driver_approaching',
    title: 'Votre livreur approche !',
    message: 'Kouassi Jean arrive dans 3 minutes',
    icon: <Navigation className="h-5 w-5" />,
    color: 'bg-orange-100 text-orange-800',
    data: { orderId: 'CMD001', driverName: 'Kouassi Jean', driverPhone: '+225 05 98 76 54 32', eta: 3 }
  },
  {
    id: 'driver_arrived',
    name: 'Livreur arrivé',
    type: 'driver_arrived',
    title: 'Votre livreur est arrivé !',
    message: 'Kouassi Jean est à votre adresse',
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-800',
    data: { orderId: 'CMD001', driverName: 'Kouassi Jean', driverPhone: '+225 05 98 76 54 32' }
  },
  {
    id: 'delivery_completed',
    name: 'Livraison terminée',
    type: 'delivery_completed',
    title: 'Livraison terminée !',
    message: 'Votre commande a été livrée avec succès. Bon appétit !',
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'bg-green-100 text-green-800',
    data: { orderId: 'CMD001' }
  },
  {
    id: 'chat_message',
    name: 'Message livreur',
    type: 'chat_message',
    title: 'Nouveau message',
    message: 'Kouassi Jean: Je suis devant votre immeuble',
    icon: <MessageCircle className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-800',
    data: { orderId: 'CMD001', senderName: 'Kouassi Jean', chatId: 'chat-001' }
  },
  {
    id: 'promotion',
    name: 'Promotion',
    type: 'promotion',
    title: 'Offre spéciale !',
    message: '20% de réduction sur votre prochaine commande',
    icon: <Tag className="h-5 w-5" />,
    color: 'bg-pink-100 text-pink-800',
    data: { promoId: 'PROMO20' }
  }
];

export default function NotificationsAdminPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [customNotification, setCustomNotification] = useState({
    title: '',
    message: '',
    type: 'order_confirmed',
    orderId: '',
    targetAudience: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeLastHour: 0,
    sentToday: 0,
    successRate: 95
  });
  const [showSettings, setShowSettings] = useState(false);

  const { permission, isSubscribed, showLocalNotification } = useNotifications();
  const { notify } = useToastNotification();

  const handleSendTemplate = async (template: NotificationTemplate) => {
    setIsLoading(true);
    try {
      // Envoyer via API
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: template.type,
          title: template.title,
          message: template.message,
          ...template.data,
          targetAudience: 'all'
        })
      });

      if (response.ok) {
        // Afficher aussi en local pour test
        showLocalNotification({
          type: template.type as any,
          title: template.title,
          message: template.message,
          ...template.data
        });

        notify({
          type: 'order_confirmed',
          title: 'Notification envoyée',
          message: `Template "${template.name}" envoyé avec succès`,
          sound: false
        });
      } else {
        throw new Error('Erreur envoi notification');
      }
    } catch (error) {
      notify({
        type: 'chat_message',
        title: 'Erreur',
        message: 'Impossible d\'envoyer la notification',
        sound: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCustom = async () => {
    if (!customNotification.title || !customNotification.message) {
      notify({
        type: 'chat_message',
        title: 'Erreur',
        message: 'Titre et message requis',
        sound: false
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customNotification)
      });

      if (response.ok) {
        showLocalNotification({
          type: customNotification.type as any,
          title: customNotification.title,
          message: customNotification.message,
          orderId: customNotification.orderId || undefined
        });

        notify({
          type: 'order_confirmed',
          title: 'Notification personnalisée envoyée',
          message: 'Votre notification a été envoyée avec succès',
          sound: false
        });

        // Reset form
        setCustomNotification({
          title: '',
          message: '',
          type: 'order_confirmed',
          orderId: '',
          targetAudience: 'all'
        });
      }
    } catch (error) {
      notify({
        type: 'chat_message',
        title: 'Erreur',
        message: 'Impossible d\'envoyer la notification',
        sound: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/notifications/subscribe?action=stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalSubscriptions: data.stats.total || 0,
          activeLastHour: data.stats.activeLastHour || 0,
          sentToday: Math.floor(Math.random() * 50), // Simulation
          successRate: 95
        });
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Notifications Push</h1>
          <p className="text-gray-600 mt-1">
            Envoyez et gérez les notifications en temps réel
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={loadStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Abonnements</p>
                <p className="text-2xl font-bold">{stats.totalSubscriptions}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actifs (1h)</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeLastHour}</p>
              </div>
              <Bell className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Envoyées (24h)</p>
                <p className="text-2xl font-bold text-purple-600">{stats.sentToday}</p>
              </div>
              <Send className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de succès</p>
                <p className="text-2xl font-bold text-orange-600">{stats.successRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statut des notifications */}
      <Card className={permission === 'granted' && isSubscribed ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            {permission === 'granted' && isSubscribed ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-600" />
            )}
            <div>
              <p className="font-medium">
                {permission === 'granted' && isSubscribed ? 'Notifications actives' : 'Notifications non configurées'}
              </p>
              <p className="text-sm text-gray-600">
                {permission === 'granted' && isSubscribed
                  ? 'Vous pouvez envoyer et recevoir des notifications de test'
                  : 'Activez les notifications pour tester l\'envoi'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates de notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="h-5 w-5" />
              <span>Templates de test</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notificationTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${template.color}`}>
                    {template.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-gray-600">{template.message}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSendTemplate(template)}
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Test
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notification personnalisée */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Notification personnalisée</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={customNotification.title}
                onChange={(e) => setCustomNotification(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de la notification"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={customNotification.message}
                onChange={(e) => setCustomNotification(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Contenu du message"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={customNotification.type}
                  onValueChange={(value) => setCustomNotification(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order_confirmed">Commande confirmée</SelectItem>
                    <SelectItem value="driver_assigned">Livreur assigné</SelectItem>
                    <SelectItem value="driver_approaching">Livreur approche</SelectItem>
                    <SelectItem value="driver_arrived">Livreur arrivé</SelectItem>
                    <SelectItem value="delivery_completed">Livraison terminée</SelectItem>
                    <SelectItem value="chat_message">Message chat</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target">Cible</Label>
                <Select
                  value={customNotification.targetAudience}
                  onValueChange={(value) => setCustomNotification(prev => ({ ...prev, targetAudience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    <SelectItem value="order">Commande spécifique</SelectItem>
                    <SelectItem value="user">Utilisateur spécifique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="orderId">ID Commande (optionnel)</Label>
              <Input
                id="orderId"
                value={customNotification.orderId}
                onChange={(e) => setCustomNotification(prev => ({ ...prev, orderId: e.target.value }))}
                placeholder="CMD001"
              />
            </div>

            <Button
              onClick={handleSendCustom}
              disabled={isLoading || !customNotification.title || !customNotification.message}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Envoyer la notification
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Paramètres */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Paramètres des notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationSettings showAsDialog={false} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
