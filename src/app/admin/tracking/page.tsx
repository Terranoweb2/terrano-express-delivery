"use client";

import { useState, useEffect } from 'react';
import { Delivery, Driver } from '@/types/admin';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  User,
  Package,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Route,
  Timer,
  Zap,
  Car,
  Bike,
  Target,
  Home,
  Building2,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Types pour le tracking
interface TrackingData {
  deliveryId: string;
  orderId: string;
  customer: string;
  driver: Driver;
  startAddress: string;
  destinationAddress: string;
  startCoords: { lat: number; lng: number };
  destinationCoords: { lat: number; lng: number };
  currentPosition: { lat: number; lng: number };
  status: 'assigned' | 'started' | 'in_transit' | 'arrived' | 'delivered';
  estimatedTime: number; // minutes
  actualTime?: number;
  distance: number; // km
  route: { lat: number; lng: number }[];
  updates: {
    timestamp: string;
    position: { lat: number; lng: number };
    status: string;
  }[];
}

// Données mockées pour le tracking
const activeDeliveries: TrackingData[] = [
  {
    deliveryId: 'LIV001',
    orderId: 'CMD001',
    customer: 'Marie Dubois',
    driver: {
      id: 'DRV001',
      name: 'Kouassi Jean',
      phone: '+225 05 98 76 54 32',
      email: 'jean.kouassi@terrano.com',
      status: 'busy',
      assignedZone: 'Cocody',
      vehicleType: 'moto',
      vehicleNumber: 'MT-001-AB',
      rating: 4.8,
      totalDeliveries: 234,
      createdAt: '2024-01-15T00:00:00Z'
    },
    startAddress: 'Terrano Express, Boulevard Lagunaire, Cocody',
    destinationAddress: 'Cocody, Riviera Golf, Villa 25',
    startCoords: { lat: 5.3717, lng: -4.0078 },
    destinationCoords: { lat: 5.3890, lng: -3.9950 },
    currentPosition: { lat: 5.3803, lng: -4.0014 },
    status: 'in_transit',
    estimatedTime: 8,
    distance: 4.2,
    route: [
      { lat: 5.3717, lng: -4.0078 },
      { lat: 5.3750, lng: -4.0050 },
      { lat: 5.3803, lng: -4.0014 },
      { lat: 5.3850, lng: -3.9980 },
      { lat: 5.3890, lng: -3.9950 }
    ],
    updates: [
      { timestamp: '2024-07-23T14:30:00Z', position: { lat: 5.3717, lng: -4.0078 }, status: 'Commande récupérée' },
      { timestamp: '2024-07-23T14:32:00Z', position: { lat: 5.3750, lng: -4.0050 }, status: 'En route' },
      { timestamp: '2024-07-23T14:35:00Z', position: { lat: 5.3803, lng: -4.0014 }, status: 'À mi-chemin' }
    ]
  },
  {
    deliveryId: 'LIV002',
    orderId: 'CMD002',
    customer: 'Pierre Martin',
    driver: {
      id: 'DRV002',
      name: 'Aya Fatou',
      phone: '+225 07 45 32 21 09',
      email: 'fatou.aya@terrano.com',
      status: 'busy',
      assignedZone: 'Plateau',
      vehicleType: 'moto',
      vehicleNumber: 'MT-002-CD',
      rating: 4.9,
      totalDeliveries: 189,
      createdAt: '2024-02-01T00:00:00Z'
    },
    startAddress: 'Terrano Express, Boulevard Lagunaire, Cocody',
    destinationAddress: 'Plateau, Avenue Chardy, Immeuble Nour',
    startCoords: { lat: 5.3717, lng: -4.0078 },
    destinationCoords: { lat: 5.3197, lng: -4.0267 },
    currentPosition: { lat: 5.3197, lng: -4.0267 },
    status: 'arrived',
    estimatedTime: 0,
    actualTime: 18,
    distance: 7.3,
    route: [
      { lat: 5.3717, lng: -4.0078 },
      { lat: 5.3500, lng: -4.0200 },
      { lat: 5.3300, lng: -4.0250 },
      { lat: 5.3197, lng: -4.0267 }
    ],
    updates: [
      { timestamp: '2024-07-23T14:15:00Z', position: { lat: 5.3717, lng: -4.0078 }, status: 'Commande récupérée' },
      { timestamp: '2024-07-23T14:25:00Z', position: { lat: 5.3300, lng: -4.0250 }, status: 'En route vers Plateau' },
      { timestamp: '2024-07-23T14:33:00Z', position: { lat: 5.3197, lng: -4.0267 }, status: 'Arrivé à destination' }
    ]
  }
];

export default function TrackingPage() {
  const [selectedDelivery, setSelectedDelivery] = useState<TrackingData | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [newAddresses, setNewAddresses] = useState({
    start: '',
    destination: ''
  });

  // Simulation de mise à jour en temps réel
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      // Simuler le déplacement des livreurs
      console.log('Updating positions...');
    }, 5000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'started': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-green-100 text-green-800';
      case 'arrived': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <User className="h-4 w-4" />;
      case 'started': return <Play className="h-4 w-4" />;
      case 'in_transit': return <Navigation className="h-4 w-4" />;
      case 'arrived': return <Target className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'moto': return <Bike className="h-4 w-4" />;
      case 'voiture': return <Car className="h-4 w-4" />;
      case 'velo': return <Bike className="h-4 w-4" />;
      default: return <Bike className="h-4 w-4" />;
    }
  };

  const formatStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'assigned': 'Assigné',
      'started': 'Démarré',
      'in_transit': 'En route',
      'arrived': 'Arrivé',
      'delivered': 'Livré'
    };
    return labels[status] || status;
  };

  const calculateProgress = (delivery: TrackingData) => {
    switch (delivery.status) {
      case 'assigned': return 0;
      case 'started': return 25;
      case 'in_transit': return 60;
      case 'arrived': return 90;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tracking GPS en Temps Réel</h1>
          <p className="text-gray-600 mt-1">
            Suivez vos livreurs et optimisez les trajets
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant={isTracking ? "default" : "outline"}
            onClick={() => setIsTracking(!isTracking)}
            className={isTracking ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {isTracking ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isTracking ? "En transit" : "En pause"}
          </Button>
          <Button
            onClick={() => setShowRouteModal(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Route className="h-4 w-4 mr-2" />
            Nouveau trajet
          </Button>
        </div>
      </div>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Livraisons actives</p>
                <p className="text-2xl font-bold text-blue-600">{activeDeliveries.length}</p>
              </div>
              <Navigation className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(activeDeliveries.reduce((sum, d) => sum + (d.actualTime || d.estimatedTime), 0) / activeDeliveries.length)}min
                </p>
              </div>
              <Timer className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Distance totale</p>
                <p className="text-2xl font-bold text-purple-600">
                  {activeDeliveries.reduce((sum, d) => sum + d.distance, 0).toFixed(1)}km
                </p>
              </div>
              <Route className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Livreurs actifs</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(activeDeliveries.map(d => d.driver.id)).size}
                </p>
              </div>
              <User className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interface principale avec carte et livraisons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte principale */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Carte des Livraisons</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Mise à jour: 30s
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-100 rounded-lg relative overflow-hidden">
              {/* Simulation de carte */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                {/* Routes simulées */}
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Route 1 */}
                  <path d="M50,100 Q150,80 250,120 Q350,140 400,100" stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite"/>
                  </path>

                  {/* Route 2 */}
                  <path d="M60,200 Q160,180 260,220 Q360,240 410,200" stroke="#10b981" strokeWidth="3" fill="none" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite"/>
                  </path>
                </svg>

                {/* Markers des livreurs */}
                {activeDeliveries.map((delivery, index) => (
                  <div
                    key={delivery.deliveryId}
                    className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      left: `${20 + index * 150}px`,
                      top: `${100 + index * 100}px`,
                      animation: 'pulse 2s infinite'
                    }}
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    {getVehicleIcon(delivery.driver.vehicleType)}
                  </div>
                ))}

                {/* Markers de destination */}
                {activeDeliveries.map((delivery, index) => (
                  <div
                    key={`dest-${delivery.deliveryId}`}
                    className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: `${400 + index * 10}px`,
                      top: `${100 + index * 100}px`
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                ))}

                {/* Légende */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>Livreurs</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>Destinations</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-8 h-1 bg-blue-500 opacity-60"></div>
                    <span>Trajets</span>
                  </div>
                </div>

                {/* Contrôles de zoom */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-1">
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">+</Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">-</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel des livraisons actives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Livraisons en cours</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDeliveries.map((delivery) => (
              <div
                key={delivery.deliveryId}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedDelivery?.deliveryId === delivery.deliveryId ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedDelivery(delivery)}
              >
                <div className="space-y-3">
                  {/* En-tête */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{delivery.orderId}</span>
                    <Badge className={getStatusColor(delivery.status)}>
                      {getStatusIcon(delivery.status)}
                      <span className="ml-1">{formatStatusLabel(delivery.status)}</span>
                    </Badge>
                  </div>

                  {/* Livreur */}
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">
                        {delivery.driver.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{delivery.driver.name}</p>
                      <p className="text-xs text-gray-500">{delivery.driver.phone}</p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-1">
                    <div className="flex items-start space-x-2">
                      <Home className="h-3 w-3 text-gray-400 mt-0.5" />
                      <p className="text-xs text-gray-600 line-clamp-2">{delivery.startAddress}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Target className="h-3 w-3 text-red-500 mt-0.5" />
                      <p className="text-xs text-gray-600 line-clamp-2">{delivery.destinationAddress}</p>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Progression</span>
                      <span className="text-gray-500">{calculateProgress(delivery)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${calculateProgress(delivery)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Temps et distance */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{delivery.estimatedTime}min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Route className="h-3 w-3" />
                      <span>{delivery.distance}km</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Détails de la livraison sélectionnée */}
      {selectedDelivery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="h-5 w-5" />
              <span>Détails du trajet - {selectedDelivery.orderId}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations de livraison */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informations de livraison</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span className="font-medium">{selectedDelivery.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livreur:</span>
                      <span className="font-medium">{selectedDelivery.driver.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <Badge className={getStatusColor(selectedDelivery.status)}>
                        {formatStatusLabel(selectedDelivery.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">{selectedDelivery.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temps estimé:</span>
                      <span className="font-medium">{selectedDelivery.estimatedTime} min</span>
                    </div>
                  </div>
                </div>

                {/* Actions rapides */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Actions rapides</h4>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler livreur
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler client
                    </Button>
                  </div>
                </div>
              </div>

              {/* Historique des mises à jour */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Historique du trajet</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedDelivery.updates.map((update, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{update.status}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(update.timestamp).toLocaleTimeString('fr-FR')}
                        </p>
                        <p className="text-xs text-gray-400">
                          Position: {update.position.lat.toFixed(4)}, {update.position.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal pour créer un nouveau trajet */}
      <Dialog open={showRouteModal} onOpenChange={setShowRouteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Définir un nouveau trajet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="start">Adresse de départ</Label>
              <Input
                id="start"
                value={newAddresses.start}
                onChange={(e) => setNewAddresses(prev => ({ ...prev, start: e.target.value }))}
                placeholder="Terrano Express, Boulevard Lagunaire, Cocody"
              />
            </div>
            <div>
              <Label htmlFor="destination">Adresse de destination</Label>
              <Input
                id="destination"
                value={newAddresses.destination}
                onChange={(e) => setNewAddresses(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="Adresse de livraison complète"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Estimation automatique:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Distance:</span>
                  <span className="font-medium ml-2">~5.2 km</span>
                </div>
                <div>
                  <span className="text-gray-500">Temps:</span>
                  <span className="font-medium ml-2">~15 min</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRouteModal(false)}
              >
                Annuler
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  console.log('Creating new route:', newAddresses);
                  setShowRouteModal(false);
                  setNewAddresses({ start: '', destination: '' });
                }}
              >
                Créer le trajet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
