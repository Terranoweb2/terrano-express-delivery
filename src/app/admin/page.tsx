"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Package,
  MapPin,
  Clock,
  Star,
  Truck,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  LogOut,
  CheckCircle,
  XCircle,
  Phone,
  Navigation,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  ShoppingCart,
  UserCheck,
  Bike
} from "lucide-react"
import Link from 'next/link'

// Import conditionnel pour éviter les erreurs d'export statique
let useAdminAuth: any = () => ({ logout: () => {} })

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useAdminAuth = require('@/hooks/useAdminAuth').useAdminAuth
}

interface AdminStats {
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
  totalDeliverers: number
  activeDeliverers: number
  totalCustomers: number
  newCustomers: number
  averageDeliveryTime: number
  completionRate: number
}

interface DelivererData {
  id: string
  name: string
  phone: string
  vehicleType: string
  rating: number
  totalDeliveries: number
  todayDeliveries: number
  earnings: number
  isOnline: boolean
  status: 'available' | 'busy' | 'offline'
  lastSeen: string
}

interface OrderData {
  id: string
  customerName: string
  items: { name: string; quantity: number }[]
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'delivery' | 'completed' | 'cancelled'
  createdAt: string
  deliverer?: string
  estimatedTime?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { logout } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 1247,
    todayOrders: 89,
    totalRevenue: 15750000,
    todayRevenue: 487500,
    totalDeliverers: 24,
    activeDeliverers: 18,
    totalCustomers: 3456,
    newCustomers: 12,
    averageDeliveryTime: 28,
    completionRate: 96.7
  })

  const [deliverers, setDeliverers] = useState<DelivererData[]>([
    {
      id: 'LIV001',
      name: 'Moussa Konaté',
      phone: '+225 05 87 65 43 21',
      vehicleType: 'Moto',
      rating: 4.8,
      totalDeliveries: 127,
      todayDeliveries: 8,
      earnings: 45000,
      isOnline: true,
      status: 'busy',
      lastSeen: '2025-01-25T15:30:00Z'
    },
    {
      id: 'LIV002',
      name: 'Sekou Diarra',
      phone: '+225 01 23 45 67 89',
      vehicleType: 'Scooter',
      rating: 4.6,
      totalDeliveries: 95,
      todayDeliveries: 6,
      earnings: 38000,
      isOnline: true,
      status: 'available',
      lastSeen: '2025-01-25T15:45:00Z'
    },
    {
      id: 'LIV003',
      name: 'Fatoumata Sidibé',
      phone: '+225 07 98 76 54 32',
      vehicleType: 'Vélo',
      rating: 4.9,
      totalDeliveries: 203,
      todayDeliveries: 12,
      earnings: 67500,
      isOnline: false,
      status: 'offline',
      lastSeen: '2025-01-25T14:00:00Z'
    },
    {
      id: 'LIV004',
      name: 'Abdoulaye Touré',
      phone: '+225 05 11 22 33 44',
      vehicleType: 'Moto',
      rating: 4.7,
      totalDeliveries: 156,
      todayDeliveries: 9,
      earnings: 52000,
      isOnline: true,
      status: 'busy',
      lastSeen: '2025-01-25T15:50:00Z'
    }
  ])

  const [recentOrders, setRecentOrders] = useState<OrderData[]>([
    {
      id: 'CMD089',
      customerName: 'Aminata Traoré',
      items: [
        { name: 'Tiramisu au Bissap', quantity: 2 },
        { name: 'Pizza Mafé', quantity: 1 }
      ],
      total: 29500,
      status: 'delivery',
      createdAt: '2025-01-25T15:30:00Z',
      deliverer: 'Moussa Konaté',
      estimatedTime: '15 min'
    },
    {
      id: 'CMD088',
      customerName: 'Kouadio Jean',
      items: [
        { name: 'Spaghetti au Thiéboudienne', quantity: 1 }
      ],
      total: 15000,
      status: 'preparing',
      createdAt: '2025-01-25T15:15:00Z'
    },
    {
      id: 'CMD087',
      customerName: 'Marie Keita',
      items: [
        { name: 'Pizza Mafé', quantity: 2 },
        { name: 'Boisson', quantity: 2 }
      ],
      total: 36000,
      status: 'completed',
      createdAt: '2025-01-25T14:45:00Z',
      deliverer: 'Sekou Diarra'
    }
  ])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userType = localStorage.getItem('userType')
      if (userType !== 'admin') {
        router.push('/login')
      }
    }
  }, [router])

  const getStatusColor = (status: OrderData['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'confirmed': return 'bg-blue-500'
      case 'preparing': return 'bg-orange-500'
      case 'delivery': return 'bg-purple-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: OrderData['status']) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'confirmed': return 'Confirmée'
      case 'preparing': return 'En préparation'
      case 'delivery': return 'En livraison'
      case 'completed': return 'Terminée'
      case 'cancelled': return 'Annulée'
      default: return 'Inconnu'
    }
  }

  const getDelivererStatusColor = (status: DelivererData['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'busy': return 'bg-orange-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getDelivererStatusText = (status: DelivererData['status']) => {
    switch (status) {
      case 'available': return 'Disponible'
      case 'busy': return 'Occupé'
      case 'offline': return 'Hors ligne'
      default: return 'Inconnu'
    }
  }

  const handleLogout = () => {
    if (logout) logout()
    router.push('/login')
  }

  const handleAssignDeliverer = (orderId: string, delivererId: string) => {
    const deliverer = deliverers.find(d => d.id === delivererId)
    if (deliverer) {
      setRecentOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, deliverer: deliverer.name, status: 'delivery' }
          : order
      ))
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Terrano-Express</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Administrateur</p>
              <p className="font-semibold">Kwame Asante</p>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-red-500">KA</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto p-6">
        {/* Titre et navigation rapide */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
            <p className="text-gray-400">Vue d'ensemble des opérations Terrano Express</p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href="/admin/orders">
                <Package className="h-4 w-4 mr-2" />
                Commandes
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/deliveries">
                <Truck className="h-4 w-4 mr-2" />
                Livraisons
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Commandes aujourd'hui</p>
                  <p className="text-2xl font-bold">{stats.todayOrders}</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% vs hier
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Revenus du jour</p>
                  <p className="text-2xl font-bold">{(stats.todayRevenue).toLocaleString()} CFA</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +8% vs hier
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Livreurs actifs</p>
                  <p className="text-2xl font-bold">{stats.activeDeliverers}/{stats.totalDeliverers}</p>
                  <p className="text-xs text-gray-400">
                    {((stats.activeDeliverers / stats.totalDeliverers) * 100).toFixed(0)}% en ligne
                  </p>
                </div>
                <Bike className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Temps de livraison</p>
                  <p className="text-2xl font-bold">{stats.averageDeliveryTime} min</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    -3 min vs hier
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-red-500">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-white data-[state=active]:bg-red-500">
              Commandes en cours
            </TabsTrigger>
            <TabsTrigger value="deliverers" className="text-white data-[state=active]:bg-red-500">
              Livreurs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-red-500">
              Analyses
            </TabsTrigger>
          </TabsList>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique des commandes */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Commandes de la semaine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => {
                      const orders = [45, 52, 61, 48, 67, 89, 73][index]
                      return (
                        <div key={day} className="flex items-center gap-3">
                          <span className="w-8 text-sm">{day}</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-red-500 h-3 rounded-full"
                              style={{ width: `${(orders / 89) * 100}%` }}
                            ></div>
                          </div>
                          <span className="w-8 text-sm text-right">{orders}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top livreurs */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Top livreurs du mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deliverers
                      .sort((a, b) => b.totalDeliveries - a.totalDeliveries)
                      .slice(0, 3)
                      .map((deliverer, index) => (
                        <div key={deliverer.id} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                          }`}>
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-red-500 text-xs">
                              {deliverer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{deliverer.name}</p>
                            <p className="text-xs text-gray-400">{deliverer.totalDeliveries} livraisons</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{deliverer.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Indicateurs de performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Taux de satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <div className="w-16 h-16 rounded-full border-4 border-gray-700"></div>
                      <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold">98%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-400">Excellent</p>
                      <p className="text-sm text-gray-400">4.8/5 étoiles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Revenus totaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-3xl font-bold text-green-400">
                      {(stats.totalRevenue).toLocaleString()} CFA
                    </p>
                    <p className="text-sm text-gray-400">Ce mois</p>
                    <div className="mt-2">
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-gray-400 mt-1">75% de l'objectif mensuel</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Nouveaux clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-3xl font-bold text-blue-400">+{stats.newCustomers}</p>
                    <p className="text-sm text-gray-400">Aujourd'hui</p>
                    <p className="text-xs text-green-400 flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3" />
                      +25% vs la semaine dernière
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Commandes en cours */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Commandes en cours</h2>
              <Badge variant="secondary">{recentOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length} actives</Badge>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Card key={order.id} className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      {new Date(order.createdAt).toLocaleString('fr-FR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Client
                        </h4>
                        <p className="text-sm">{order.customerName}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Articles
                        </h4>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <p key={index} className="text-sm">
                              {item.quantity}x {item.name}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Total
                        </h4>
                        <p className="text-lg font-bold text-green-400">
                          {order.total.toLocaleString()} CFA
                        </p>
                      </div>
                    </div>

                    {order.deliverer && (
                      <div className="pt-3 border-t border-gray-700">
                        <p className="text-sm">
                          <span className="text-gray-400">Livreur assigné:</span> {order.deliverer}
                          {order.estimatedTime && (
                            <span className="text-gray-400 ml-4">ETA: {order.estimatedTime}</span>
                          )}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-3 border-t border-gray-700">
                      {order.status === 'pending' && (
                        <Button size="sm" onClick={() => {
                          setRecentOrders(prev => prev.map(o =>
                            o.id === order.id ? { ...o, status: 'confirmed' } : o
                          ))
                        }}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirmer
                        </Button>
                      )}
                      {order.status === 'confirmed' && !order.deliverer && (
                        <select
                          className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm"
                          onChange={(e) => handleAssignDeliverer(order.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="">Assigner un livreur</option>
                          {deliverers.filter(d => d.status === 'available').map(deliverer => (
                            <option key={deliverer.id} value={deliverer.id}>
                              {deliverer.name} ({deliverer.vehicleType})
                            </option>
                          ))}
                        </select>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Livreurs */}
          <TabsContent value="deliverers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestion des livreurs</h2>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Ajouter un livreur
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {deliverers.map((deliverer) => (
                <Card key={deliverer.id} className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-red-500">
                            {deliverer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{deliverer.name}</CardTitle>
                          <CardDescription>#{deliverer.id}</CardDescription>
                        </div>
                      </div>
                      <Badge className={`${getDelivererStatusColor(deliverer.status)} text-white`}>
                        {getDelivererStatusText(deliverer.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Téléphone</p>
                        <p className="font-medium">{deliverer.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Véhicule</p>
                        <p className="font-medium">{deliverer.vehicleType}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Note moyenne</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{deliverer.rating}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400">Livraisons totales</p>
                        <p className="font-medium">{deliverer.totalDeliveries}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-700">
                      <div className="flex justify-between items-center text-sm">
                        <span>Aujourd'hui: {deliverer.todayDeliveries} livraisons</span>
                        <span className="text-green-400 font-medium">{deliverer.earnings.toLocaleString()} CFA</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Appeler
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Navigation className="h-4 w-4 mr-1" />
                        Localiser
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Analyses */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analyses et rapports</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Répartition des commandes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Pizza Mafé', percentage: 35, color: 'bg-red-500' },
                      { name: 'Spaghetti au Thiéboudienne', percentage: 28, color: 'bg-orange-500' },
                      { name: 'Tiramisu au Bissap', percentage: 20, color: 'bg-yellow-500' },
                      { name: 'Autres plats', percentage: 17, color: 'bg-gray-500' }
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${item.color}`}></div>
                        <span className="flex-1 text-sm">{item.name}</span>
                        <span className="text-sm font-medium">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Performance des livreurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Temps de livraison moyen</span>
                        <span>{stats.averageDeliveryTime} min</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Taux de réussite</span>
                        <span>{stats.completionRate}%</span>
                      </div>
                      <Progress value={stats.completionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Satisfaction client</span>
                        <span>4.8/5</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert className="bg-blue-900/50 border-blue-500">
              <BarChart3 className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                Les analyses complètes incluent les tendances de vente, la performance des livreurs et les retours clients.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
