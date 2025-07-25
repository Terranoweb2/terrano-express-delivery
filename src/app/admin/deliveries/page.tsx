"use client";

import { useState } from 'react';
import { Delivery, Driver } from '@/types/admin';
import {
  MapPin,
  Clock,
  Phone,
  User,
  Truck,
  Package,
  Navigation,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  Plus,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const deliveries: Delivery[] = [
  {
    id: 'LIV001',
    orderId: 'CMD001',
    customer: 'Marie Dubois',
    phone: '+225 07 12 34 56 78',
    address: 'Cocody, Riviera Golf, Villa 25',
    coordinates: { lat: 5.3717, lng: -4.0078 },
    deliveryTime: '15:30',
    estimatedDelivery: '15:45',
    status: 'in_transit',
    driverId: 'DRV001',
    driverName: 'Kouassi Jean',
    driverPhone: '+225 05 98 76 54 32',
    deliveryZone: 'Cocody',
    notes: 'Appeler en arrivant',
    createdAt: '2024-07-23T14:30:00Z'
  },
  {
    id: 'LIV002',
    orderId: 'CMD002',
    customer: 'Pierre Martin',
    phone: '+225 01 87 65 43 21',
    address: 'Plateau, Avenue Chardy, Immeuble Nour',
    deliveryTime: '14:45',
    estimatedDelivery: '15:00',
    actualDelivery: '14:58',
    status: 'delivered',
    driverId: 'DRV002',
    driverName: 'Aya Fatou',
    driverPhone: '+225 07 45 32 21 09',
    deliveryZone: 'Plateau',
    createdAt: '2024-07-23T13:45:00Z'
  },
  {
    id: 'LIV003',
    orderId: 'CMD003',
    customer: 'Sophie Laurent',
    phone: '+225 05 55 44 33 22',
    address: 'Marcory, Zone 4, Rue des Jardins',
    deliveryTime: '15:15',
    estimatedDelivery: '15:30',
    status: 'assigned',
    driverId: 'DRV003',
    driverName: 'Diabaté Omar',
    driverPhone: '+225 01 23 45 67 89',
    deliveryZone: 'Marcory',
    notes: '2ème étage, appartement B',
    createdAt: '2024-07-23T14:15:00Z'
  }
];

const drivers: Driver[] = [
  {
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
  {
    id: 'DRV002',
    name: 'Aya Fatou',
    phone: '+225 07 45 32 21 09',
    email: 'fatou.aya@terrano.com',
    status: 'available',
    assignedZone: 'Plateau',
    vehicleType: 'moto',
    vehicleNumber: 'MT-002-CD',
    rating: 4.9,
    totalDeliveries: 189,
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'DRV003',
    name: 'Diabaté Omar',
    phone: '+225 01 23 45 67 89',
    email: 'omar.diabate@terrano.com',
    status: 'busy',
    assignedZone: 'Marcory',
    vehicleType: 'voiture',
    vehicleNumber: 'VT-003-EF',
    rating: 4.7,
    totalDeliveries: 156,
    createdAt: '2024-03-10T00:00:00Z'
  }
];

export default function DeliveriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'En attente': return 'bg-orange-100 text-orange-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'in_transit': return <Navigation className="h-4 w-4" />;
      case 'assigned': return <User className="h-4 w-4" />;
      case 'En attente': return <Clock className="h-4 w-4" />;
      case 'Annulé': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getDriverStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = (delivery.customer?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (delivery.address?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'Tous' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Livraisons</h1>
          <p className="text-gray-600 mt-1">
            Suivez et gérez toutes les livraisons en temps réel
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            Liste
          </Button>
          <Button
            variant={view === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('map')}
          >
            Carte
          </Button>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Assigner livraison
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'assigned').length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En transit</p>
                <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'in_transit').length}</p>
              </div>
              <Navigation className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Livrées</p>
                <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'delivered').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Livreurs actifs</p>
                <p className="text-2xl font-bold">{drivers.filter(d => d.status !== 'offline').length}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par client, commande ou adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="assigned">Assigné</option>
            <option value="En transit">En transit</option>
            <option value="delivered">Livré</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>
      </div>

      {view === 'list' ? (
        /* Vue en liste */
        <Card>
          <CardHeader>
            <CardTitle>Livraisons ({filteredDeliveries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Commande</th>
                    <th className="text-left py-2">Client</th>
                    <th className="text-left py-2">Adresse</th>
                    <th className="text-left py-2">Livreur</th>
                    <th className="text-left py-2">Heure prévue</th>
                    <th className="text-left py-2">Statut</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div className="font-medium">{delivery.orderId}</div>
                        <div className="text-sm text-gray-500">{delivery.id}</div>
                      </td>
                      <td className="py-3">
                        <div className="font-medium">{delivery.customer}</div>
                        <div className="text-sm text-gray-500">{delivery.phone}</div>
                      </td>
                      <td className="py-3 max-w-xs">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <div className="text-sm">{delivery.address}</div>
                            <div className="text-xs text-gray-500">{delivery.deliveryZone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        {delivery.driverName ? (
                          <div>
                            <div className="font-medium">{delivery.driverName}</div>
                            <div className="text-sm text-gray-500">{delivery.driverPhone}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Non assigné</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="text-sm">{delivery.estimatedDelivery}</div>
                        {delivery.actualDelivery && (
                          <div className="text-xs text-green-600">Livré: {delivery.actualDelivery}</div>
                        )}
                      </td>
                      <td className="py-3">
                        <Badge className={getStatusColor(delivery.status)}>
                          {getStatusIcon(delivery.status)}
                          <span className="ml-1">{delivery.status}</span>
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDelivery(delivery);
                              setShowDeliveryDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Vue carte */
        <Card>
          <CardHeader>
            <CardTitle>Carte des Livraisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Carte des livraisons</p>
                <p className="text-sm text-gray-500">Intégration Google Maps à venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Livreurs disponibles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Livreurs Disponibles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drivers.filter(driver => driver.status === 'available').map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-gray-600">{driver.assignedZone} • {driver.vehicleType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getDriverStatusColor(driver.status)}>
                      {driver.status.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">⭐ {driver.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="h-5 w-5" />
              <span>Livreurs en Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drivers.filter(driver => driver.status === 'busy').map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-gray-600">{driver.assignedZone} • {driver.vehicleType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-100 text-blue-800">
                      En mission
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      <Phone className="h-3 w-3 inline mr-1" />
                      {driver.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
