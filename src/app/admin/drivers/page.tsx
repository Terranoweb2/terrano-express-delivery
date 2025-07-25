"use client";

import { useState } from 'react';
import { Driver } from '@/types/admin';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Clock,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Bike,
  Car,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

// Données mockées des livreurs
const drivers: Driver[] = [
  {
    id: 'DRV001',
    name: 'Kouassi Jean-Baptiste',
    phone: '+225 05 98 76 54 32',
    email: 'jean.kouassi@terrano.com',
    status: 'busy',
    currentLocation: { lat: 5.3717, lng: -4.0078 },
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
    currentLocation: { lat: 5.3197, lng: -4.0267 },
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
    currentLocation: { lat: 5.2767, lng: -3.9608 },
    assignedZone: 'Marcory',
    vehicleType: 'voiture',
    vehicleNumber: 'VT-003-EF',
    rating: 4.7,
    totalDeliveries: 156,
    createdAt: '2024-03-10T00:00:00Z'
  },
  {
    id: 'DRV004',
    name: 'Kone Mariame',
    phone: '+225 09 88 77 66 55',
    email: 'mariame.kone@terrano.com',
    status: 'offline',
    currentLocation: { lat: 5.3484, lng: -4.0267 },
    assignedZone: 'Adjamé',
    vehicleType: 'moto',
    vehicleNumber: 'MT-004-GH',
    rating: 4.6,
    totalDeliveries: 98,
    createdAt: '2024-04-20T00:00:00Z'
  },
  {
    id: 'DRV005',
    name: 'Traore Seydou',
    phone: '+225 06 11 22 33 44',
    email: 'seydou.traore@terrano.com',
    status: 'offline',
    assignedZone: 'Yopougon',
    vehicleType: 'velo',
    vehicleNumber: 'VL-005-IJ',
    rating: 4.4,
    totalDeliveries: 67,
    createdAt: '2024-05-15T00:00:00Z'
  }
];

const zones = [
  'Cocody', 'Plateau', 'Marcory', 'Adjamé', 'Yopougon',
  'Koumassi', 'Port-Bouët', 'Treichville', 'Abobo', 'Attécoubé'
];

const vehicleTypes = [
  { value: 'moto', label: 'Moto', icon: Bike },
  { value: 'voiture', label: 'Voiture', icon: Car },
  { value: 'velo', label: 'Vélo', icon: Bike }
];

const statusOptions = [
  'Tous',
  'disponible',
  'busy',
  'pause',
  'hors_service'
];

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    assignedZone: '',
    vehicleType: 'moto' as Driver['vehicleType'],
    status: 'available' as Driver['status']
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-blue-100 text-blue-800';
      case 'pause': return 'bg-yellow-100 text-yellow-800';
      case 'hors_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponible': return <CheckCircle className="h-4 w-4" />;
      case 'busy': return <Package className="h-4 w-4" />;
      case 'pause': return <Clock className="h-4 w-4" />;
      case 'hors_service': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    const vehicle = vehicleTypes.find(v => v.value === vehicleType);
    const IconComponent = vehicle?.icon || Bike;
    return <IconComponent className="h-4 w-4" />;
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.assignedZone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'Tous' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateDriver = () => {
    // Logique de création d'un nouveau livreur
    console.log('Creating driver:', formData);
    setShowCreateModal(false);
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      assignedZone: '',
      vehicleType: 'moto',
      status: 'available'
    });
  };

  const handleUpdateDriverStatus = (driverId: string, newStatus: Driver['status']) => {
    // Logique de mise à jour du statut
    console.log(`Updating driver ${driverId} status to: ${newStatus}`);
  };

  const formatStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'disponible': 'Disponible',
      'busy': 'En livraison',
      'pause': 'En pause',
      'hors_service': 'Hors service'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Livreurs</h1>
          <p className="text-gray-600 mt-1">
            Gérez votre équipe de livraison et optimisez les performances
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-500 hover:bg-orange-600 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau livreur
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Livreurs</p>
                <p className="text-2xl font-bold">{drivers.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">
                  {drivers.filter(d => d.status === 'available').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En livraison</p>
                <p className="text-2xl font-bold text-blue-600">
                  {drivers.filter(d => d.status === 'busy').length}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note moyenne</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom, zone ou téléphone..."
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
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'Tous' ? status : formatStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table des livreurs */}
      <Card>
        <CardHeader>
          <CardTitle>Équipe de livraison ({filteredDrivers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Livreur</th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">Zone</th>
                  <th className="text-left py-3 px-4">Véhicule</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Performance</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{driver.name}</p>
                          <p className="text-sm text-gray-500">ID: {driver.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{driver.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{driver.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{driver.assignedZone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getVehicleIcon(driver.vehicleType)}
                        <span className="capitalize">{driver.vehicleType}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(driver.status)}>
                        {getStatusIcon(driver.status)}
                        <span className="ml-1">{formatStatusLabel(driver.status)}</span>
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{driver.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {driver.totalDeliveries} livraisons
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDriver(driver);
                            setShowDriverModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
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

      {/* Modal Détails du livreur */}
      <Dialog open={showDriverModal} onOpenChange={setShowDriverModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profil du livreur</DialogTitle>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-6">
              {/* Informations personnelles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nom complet</Label>
                  <p className="text-gray-900">{selectedDriver.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
                  <p className="text-gray-900">{selectedDriver.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-gray-900">{selectedDriver.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Zone assignée</Label>
                  <p className="text-gray-900">{selectedDriver.assignedZone}</p>
                </div>
              </div>

              {/* Statut et véhicule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Statut actuel</Label>
                  <div className="mt-1">
                    <select
                      value={selectedDriver.status}
                      onChange={(e) => handleUpdateDriverStatus(selectedDriver.id, e.target.value as Driver['status'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="busy">En livraison</option>
                      <option value="pause">En pause</option>
                      <option value="hors_service">Hors service</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Type de véhicule</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getVehicleIcon(selectedDriver.vehicleType)}
                    <span className="capitalize">{selectedDriver.vehicleType}</span>
                  </div>
                </div>
              </div>

              {/* Statistiques de performance */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Statistiques de performance</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </div>
                      <p className="text-2xl font-bold">{selectedDriver.rating}</p>
                      <p className="text-sm text-gray-600">Note moyenne</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Package className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold">{selectedDriver.totalDeliveries}</p>
                      <p className="text-sm text-gray-600">Livraisons</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold">98%</p>
                      <p className="text-sm text-gray-600">Réussite</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Position actuelle */}
              {selectedDriver.currentLocation && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Position actuelle</Label>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-red-500" />
                        <span>Lat: {selectedDriver.currentLocation.lat}, Lng: {selectedDriver.currentLocation.lng}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Dernière mise à jour: il y a 2 minutes
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Création de livreur */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau livreur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom et prénom du livreur"
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+225 XX XX XX XX XX"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@terrano.com"
              />
            </div>
            <div>
              <Label htmlFor="zone">Zone d'attribution</Label>
              <select
                id="zone"
                value={formData.assignedZone}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedZone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Sélectionner une zone</option>
                {zones.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="vehicle">Type de véhicule</Label>
              <select
                id="vehicle"
                value={formData.vehicleType}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value as Driver['vehicleType'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {vehicleTypes.map(vehicle => (
                  <option key={vehicle.value} value={vehicle.value}>{vehicle.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateDriver}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Créer le livreur
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
