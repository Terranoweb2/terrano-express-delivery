"use client";

import { useState } from 'react';
import { Order, OrderItem } from '@/types/admin';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const orders: Order[] = [
  {
    id: 'CMD001',
    customer: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    items: [
      { name: 'Couscous Royal', quantity: 1, price: 12000 },
      { name: 'Tajine Agneau', quantity: 1, price: 14500 },
      { name: 'Thé à la Menthe', quantity: 2, price: 3500 }
    ],
    total: 30000,
    status: 'in_transit' as const,
    paymentStatus: 'Payé' as const,
    orderDate: '2024-07-23',
    orderTime: '14:30',
    deliveryAddress: '15 Rue de la Paix, 75001 Paris',
    deliveryTime: '15:30',
    notes: 'Sans piment dans le tajine'
  },
  {
    id: 'CMD002',
    customer: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    phone: '+33 6 87 65 43 21',
    items: [
      { name: 'Pastilla Poulet', quantity: 1, price: 11000 },
      { name: 'Thé à la Menthe', quantity: 2, price: 3500 },
      { name: 'Pâtisseries Orientales', quantity: 1, price: 7000 }
    ],
    total: 21500,
    status: 'delivered' as const,
    paymentStatus: 'Payé' as const,
    orderDate: '2024-07-23',
    orderTime: '13:45',
    deliveryAddress: '28 Avenue des Champs, 75008 Paris',
    deliveryTime: '14:45',
    notes: ''
  },
  {
    id: 'CMD003',
    customer: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    phone: '+33 6 55 44 33 22',
    items: [
      { name: 'Tagine Végétarien', quantity: 2, price: 9500 }
    ],
    total: 19000,
    status: 'preparing' as const,
    paymentStatus: 'Payé' as const,
    orderDate: '2024-07-23',
    orderTime: '14:15',
    deliveryAddress: '42 Boulevard Saint-Germain, 75006 Paris',
    deliveryTime: '15:15',
    notes: 'Livraison au 3ème étage'
  },
  {
    id: 'CMD004',
    customer: 'Jean Rousseau',
    email: 'jean.rousseau@email.com',
    phone: '+33 6 11 22 33 44',
    items: [
      { name: 'Menu Découverte', quantity: 1, price: 36000 }
    ],
    total: 36000,
    status: 'preparing' as const,
    paymentStatus: 'En attente' as const,
    orderDate: '2024-07-23',
    orderTime: '14:00',
    deliveryAddress: '7 Place Vendôme, 75001 Paris',
    deliveryTime: '16:00',
    notes: 'Appeler avant livraison'
  },
  {
    id: 'CMD005',
    customer: 'Anna Morel',
    email: 'anna.morel@email.com',
    phone: '+33 6 99 88 77 66',
    items: [
      { name: 'Brick à l\'Oeuf', quantity: 2, price: 8.50 },
      { name: 'Couscous Merguez', quantity: 1, price: 16.90 }
    ],
    total: 25.40,
    status: 'cancelled' as const,
    paymentStatus: 'Remboursé' as const,
    orderDate: '2024-07-23',
    orderTime: '13:20',
    deliveryAddress: '33 Rue de Rivoli, 75004 Paris',
    deliveryTime: '14:20',
    notes: 'Client non disponible'
  }
];

const statusOptions = [
  'Tous',
  'preparing',
  'preparing',
  'in_transit',
  'delivered',
  'cancelled'
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'preparing':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Remboursé':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Tous' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-1">Gérez et suivez toutes les commandes</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            + Nouvelle Commande
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par client ou numéro de commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livraison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.orderDate} - {order.orderTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.length} article{order.items.length > 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items[0].name}
                      {order.items.length > 1 && ` +${order.items.length - 1} autre${order.items.length > 2 ? 's' : ''}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(order.total)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getPaymentStatusColor(order.paymentStatus || 'En attente')}>
                      {order.paymentStatus || 'En attente'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.deliveryTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
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
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Commande {selectedOrder.id}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOrderDetails(false)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informations Client</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom</p>
                    <p className="text-gray-900">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                    <p className="text-gray-900">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adresse</p>
                    <p className="text-gray-900">{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Articles Commandés</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Article</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qté</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(item.price)}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(item.quantity * item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                          Total:
                        </td>
                        <td className="px-4 py-2 text-sm font-bold text-gray-900">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(selectedOrder.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status and Notes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Statut</p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {statusOptions.slice(1).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Heure de livraison</p>
                  <p className="text-gray-900 py-2">{selectedOrder.deliveryTime}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                Fermer
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Mettre à jour
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Commandes</p>
              <p className="text-lg font-semibold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-lg font-semibold text-gray-900">
                {orders.filter(o => ['preparing', 'preparing', 'in_transit'].includes(o.status)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Livrées</p>
              <p className="text-lg font-semibold text-gray-900">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Revenus</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
