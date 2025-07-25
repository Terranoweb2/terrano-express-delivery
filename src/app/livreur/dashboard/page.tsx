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
  CheckCircle,
  XCircle,
  Navigation,
  Phone,
  User,
  TrendingUp,
  Calendar,
  AlertCircle,
  LogOut
} from "lucide-react"
import Link from 'next/link'

// Import conditionnel pour éviter les erreurs d'export statique
let useAuth: any = () => ({ logout: () => {}, user: null, isAuthenticated: false })

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useAuth = require('@/contexts/AuthContext').useAuth
}

interface Delivery {
  id: string
  customerName: string
  customerPhone: string
  address: string
  items: { name: string; quantity: number }[]
  status: 'pending' | 'accepted' | 'pickup' | 'delivery' | 'completed' | 'cancelled'
  createdAt: string
  estimatedTime: string
  amount: number
  distance: string
}

interface DeliveryStats {
  totalDeliveries: number
  completedToday: number
  earnings: number
  rating: number
  onTimeDeliveries: number
}

export default function LivreurDashboard() {
  const router = useRouter()
  const { logout, user } = useAuth()
  const [activeTab, setActiveTab] = useState('deliveries')
  const [isOnline, setIsOnline] = useState(false)

  const [stats, setStats] = useState<DeliveryStats>({
    totalDeliveries: 127,
    completedToday: 8,
    earnings: 45000,
    rating: 4.8,
    onTimeDeliveries: 96
  })

  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: 'DEL001',
      customerName: 'Aminata Traoré',
      customerPhone: '+225 07 12 34 56 78',
      address: 'Cocody, Boulevard Lagunaire, Résidence Palmier',
      items: [
        { name: 'Tiramisu au Bissap', quantity: 2 },
        { name: 'Pizza Mafé', quantity: 1 }
      ],
      status: 'accepted',
      createdAt: '2025-01-25T14:30:00Z',
      estimatedTime: '30 min',
      amount: 22000,
      distance: '2.5 km'
    },
    {
      id: 'DEL002',
      customerName: 'Kouadio Jean',
      customerPhone: '+225 05 87 65 43 21',
      address: 'Marcory, Zone 4, près du marché',
      items: [
        { name: 'Spaghetti au Thiéboudienne', quantity: 1 }
      ],
      status: 'pickup',
      createdAt: '2025-01-25T15:00:00Z',
      estimatedTime: '20 min',
      amount: 15000,
      distance: '4.2 km'
    }
  ])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userType = localStorage.getItem('userType')
      if (userType !== 'livreur') {
        router.push('/login')
      }
    }
  }, [router])

  const handleStatusUpdate = (deliveryId: string, newStatus: Delivery['status']) => {
    setDeliveries(prev => prev.map(delivery =>
      delivery.id === deliveryId
        ? { ...delivery, status: newStatus }
        : delivery
    ))
  }

  const handleLogout = () => {
    if (logout) logout()
    router.push('/login')
  }

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'accepted': return 'bg-blue-500'
      case 'pickup': return 'bg-orange-500'
      case 'delivery': return 'bg-purple-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'accepted': return 'Acceptée'
      case 'pickup': return 'Récupération'
      case 'delivery': return 'En livraison'
      case 'completed': return 'Terminée'
      case 'cancelled': return 'Annulée'
      default: return 'Inconnu'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header avec statut en ligne */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Terrano-Express</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{isOnline ? 'En ligne' : 'Hors ligne'}</span>
              <Button
                size="sm"
                variant={isOnline ? "destructive" : "default"}
                onClick={() => setIsOnline(!isOnline)}
                className="ml-2"
              >
                {isOnline ? 'Se déconnecter' : 'Se connecter'}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Livreur</p>
              <p className="font-semibold">{user?.name || 'Moussa Konaté'}</p>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-red-500">MK</AvatarFallback>
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
        {/* Alertes */}
        {!isOnline && (
          <Alert className="mb-6 bg-yellow-900/50 border-yellow-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-yellow-200">
              Vous êtes hors ligne. Connectez-vous pour recevoir de nouvelles livraisons.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-400">Total livraisons</p>
                  <p className="text-2xl font-bold">{stats.totalDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-gray-400">Aujourd'hui</p>
                  <p className="text-2xl font-bold">{stats.completedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-400">Gains du mois</p>
                  <p className="text-2xl font-bold">{stats.earnings.toLocaleString()} CFA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">Note moyenne</p>
                  <p className="text-2xl font-bold">{stats.rating}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-400">Ponctualité</p>
                  <p className="text-2xl font-bold">{stats.onTimeDeliveries}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="deliveries" className="text-white data-[state=active]:bg-red-500">
              Livraisons
            </TabsTrigger>
            <TabsTrigger value="earnings" className="text-white data-[state=active]:bg-red-500">
              Revenus
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-red-500">
              Profil
            </TabsTrigger>
          </TabsList>

          {/* Onglet Livraisons */}
          <TabsContent value="deliveries" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Livraisons actives</h2>
              <Badge variant="secondary">{deliveries.filter(d => ['accepted', 'pickup', 'delivery'].includes(d.status)).length} en cours</Badge>
            </div>

            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <Card key={delivery.id} className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Commande #{delivery.id}</CardTitle>
                      <Badge className={`${getStatusColor(delivery.status)} text-white`}>
                        {getStatusText(delivery.status)}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      {new Date(delivery.createdAt).toLocaleString('fr-FR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Client
                        </h4>
                        <p className="text-sm">{delivery.customerName}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {delivery.customerPhone}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Adresse
                        </h4>
                        <p className="text-sm">{delivery.address}</p>
                        <p className="text-sm text-gray-400">{delivery.distance} • {delivery.estimatedTime}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Articles
                      </h4>
                      <div className="space-y-1">
                        {delivery.items.map((item, index) => (
                          <p key={index} className="text-sm">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div>
                        <span className="text-lg font-bold text-green-400">
                          {delivery.amount.toLocaleString()} CFA
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {delivery.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(delivery.id, 'cancelled')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Refuser
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(delivery.id, 'accepted')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accepter
                            </Button>
                          </>
                        )}
                        {delivery.status === 'accepted' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(delivery.id, 'pickup')}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Récupéré
                          </Button>
                        )}
                        {delivery.status === 'pickup' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(delivery.id, 'delivery')}
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            En livraison
                          </Button>
                        )}
                        {delivery.status === 'delivery' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(delivery.id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Livré
                          </Button>
                        )}
                        {['accepted', 'pickup', 'delivery'].includes(delivery.status) && (
                          <Button size="sm" variant="outline">
                            <Navigation className="h-4 w-4 mr-1" />
                            GPS
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Revenus */}
          <TabsContent value="earnings" className="space-y-6">
            <h2 className="text-2xl font-bold">Revenus et Performance</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle>Revenus mensuels</CardTitle>
                  <CardDescription>Progression de vos gains</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Objectif mensuel</span>
                        <span>{stats.earnings.toLocaleString()}/60,000 CFA</span>
                      </div>
                      <Progress value={(stats.earnings / 60000) * 100} className="h-2" />
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-2xl font-bold text-green-400">{stats.earnings.toLocaleString()} CFA</p>
                      <p className="text-sm text-gray-400">75% de l'objectif atteint</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Vos indicateurs clés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Note moyenne</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{stats.rating}/5</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraisons à temps</span>
                      <span className="text-green-400">{stats.onTimeDeliveries}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taux d'acceptation</span>
                      <span className="text-blue-400">92%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold">Profil Livreur</h2>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-red-500 text-lg">MK</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">Moussa Konaté</h3>
                    <p className="text-gray-400">Livreur depuis 2 ans</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{stats.rating}/5 • {stats.totalDeliveries} livraisons</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <p className="text-sm text-gray-400">Email: moussa@terrano.com</p>
                    <p className="text-sm text-gray-400">Téléphone: +225 07 12 34 56 78</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Véhicule</h4>
                    <p className="text-sm text-gray-400">Type: Moto</p>
                    <p className="text-sm text-gray-400">Immatriculation: AB 1234 CI</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
