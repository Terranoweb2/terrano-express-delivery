"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  MapPin,
  Clock,
  Star,
  Truck,
  DollarSign,
  User,
  Mail,
  Phone,
  Edit,
  Heart,
  ShoppingCart,
  CreditCard,
  Gift,
  LogOut,
  AlertCircle,
  CheckCircle,
  Eye
} from "lucide-react"
import Link from 'next/link'

// Import conditionnel pour éviter les erreurs d'export statique
let useAuth: any = () => ({ logout: () => {}, user: null, isAuthenticated: false })
let useCart: any = () => ({ state: { items: [] }, clearCart: () => {} })
let MobileMoneyPayment: any = () => null

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useAuth = require('@/contexts/AuthContext').useAuth
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useCart = require('@/contexts/CartContext').useCart
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  MobileMoneyPayment = require('@/components/payment/MobileMoneyPayment').default
}

interface Order {
  id: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'delivery' | 'completed' | 'cancelled'
  createdAt: string
  deliveryAddress: string
  paymentMethod: string
  estimatedTime?: string
}

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  joinDate: string
  totalOrders: number
  favoriteItems: string[]
  loyaltyPoints: number
}

export default function ProfilePage() {
  const router = useRouter()
  const { logout, user, isAuthenticated } = useAuth()
  const { state: cartState, clearCart } = useCart()
  const cart = cartState?.items || []

  const [activeTab, setActiveTab] = useState('orders')
  const [isEditing, setIsEditing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [pendingOrderId, setPendingOrderId] = useState('')

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Aminata Traoré',
    email: 'aminata.traore@email.com',
    phone: '+225 07 12 34 56 78',
    address: 'Cocody, Boulevard Lagunaire, Résidence Palmier, Apt 12',
    joinDate: '2023-03-15',
    totalOrders: 24,
    favoriteItems: ['Tiramisu au Bissap', 'Pizza Mafé', 'Spaghetti au Thiéboudienne'],
    loyaltyPoints: 1250
  })

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'CMD001',
      items: [
        { name: 'Tiramisu au Bissap', quantity: 2, price: 6500 },
        { name: 'Pizza Mafé', quantity: 1, price: 16500 }
      ],
      total: 29500,
      status: 'delivery',
      createdAt: '2025-01-25T14:30:00Z',
      deliveryAddress: 'Cocody, Boulevard Lagunaire',
      paymentMethod: 'Orange Money',
      estimatedTime: '25 min'
    },
    {
      id: 'CMD002',
      items: [
        { name: 'Spaghetti au Thiéboudienne', quantity: 1, price: 15000 }
      ],
      total: 15000,
      status: 'completed',
      createdAt: '2025-01-24T19:15:00Z',
      deliveryAddress: 'Cocody, Boulevard Lagunaire',
      paymentMethod: 'MTN Mobile Money'
    },
    {
      id: 'CMD003',
      items: [
        { name: 'Pizza Mafé', quantity: 2, price: 16500 },
        { name: 'Boisson locale', quantity: 2, price: 1500 }
      ],
      total: 36000,
      status: 'completed',
      createdAt: '2025-01-22T12:45:00Z',
      deliveryAddress: 'Cocody, Boulevard Lagunaire',
      paymentMethod: 'Moov Money'
    }
  ])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userType = localStorage.getItem('userType')
      if (!isAuthenticated || userType !== 'client') {
        router.push('/login')
      }
    }
  }, [isAuthenticated, router])

  const getStatusColor = (status: Order['status']) => {
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

  const getStatusText = (status: Order['status']) => {
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

  const handleLogout = () => {
    if (logout) logout()
    router.push('/login')
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Ici on sauvegarderait les modifications du profil
  }

  const calculateCartTotal = () => {
    return cart.reduce((total: number, item: any) => total + (item.price * item.quantity), 0)
  }

  const handlePayCart = () => {
    if (cart.length === 0) return

    const newOrderId = `CMD${Date.now()}`
    setPendingOrderId(newOrderId)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (transactionId: string) => {
    // Créer une nouvelle commande
    const newOrder: Order = {
      id: pendingOrderId,
      items: cart.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: calculateCartTotal(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      deliveryAddress: profile.address,
      paymentMethod: 'Mobile Money'
    }

    setOrders(prev => [newOrder, ...prev])
    if (clearCart) clearCart()
    setShowPayment(false)
    setActiveTab('orders')
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setPendingOrderId('')
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
              <p className="text-sm text-gray-400">Client</p>
              <p className="font-semibold">{profile.name}</p>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-red-500">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
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
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-400">Total commandes</p>
                  <p className="text-2xl font-bold">{profile.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Gift className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-400">Points fidélité</p>
                  <p className="text-2xl font-bold">{profile.loyaltyPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">Plats favoris</p>
                  <p className="text-2xl font-bold">{profile.favoriteItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-400">Membre depuis</p>
                  <p className="text-lg font-bold">
                    {new Date(profile.joinDate).getFullYear()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panier actuel */}
        {cart.length > 0 && (
          <Card className="bg-red-900/20 border-red-500/50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Panier actuel
              </CardTitle>
              <CardDescription>Finalisez votre commande</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} CFA</p>
                  </div>
                ))}
                <Separator className="bg-gray-700" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-400">{calculateCartTotal().toLocaleString()} CFA</span>
                </div>
                <Button onClick={handlePayCart} className="w-full bg-red-500 hover:bg-red-600">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payer avec Mobile Money
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="orders" className="text-white data-[state=active]:bg-red-500">
              Mes commandes
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-white data-[state=active]:bg-red-500">
              Favoris
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-red-500">
              Profil
            </TabsTrigger>
          </TabsList>

          {/* Onglet Commandes */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Historique des commandes</h2>
              <Badge variant="secondary">{orders.length} commandes</Badge>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
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
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Articles commandés
                      </h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>{(item.price * item.quantity).toLocaleString()} CFA</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                      <div>
                        <h4 className="font-semibold mb-1 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Livraison
                        </h4>
                        <p className="text-sm text-gray-400">{order.deliveryAddress}</p>
                        {order.estimatedTime && (
                          <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {order.estimatedTime}
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Paiement
                        </h4>
                        <p className="text-sm text-gray-400">{order.paymentMethod}</p>
                        <p className="text-lg font-bold text-green-400 mt-1">
                          {order.total.toLocaleString()} CFA
                        </p>
                      </div>
                    </div>

                    {order.status === 'delivery' && (
                      <div className="flex gap-2 pt-3 border-t border-gray-700">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Suivre ma commande
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Contacter le livreur
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Favoris */}
          <TabsContent value="favorites" className="space-y-6">
            <h2 className="text-2xl font-bold">Mes plats favoris</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.favoriteItems.map((item, index) => (
                <Card key={index} className="bg-gray-900 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{item}</h3>
                        <p className="text-sm text-gray-400">Plat favori</p>
                      </div>
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-red-500 hover:bg-red-600">
                      Commander à nouveau
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="bg-blue-900/50 border-blue-500">
              <Heart className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                Vos plats favoris sont automatiquement sauvegardés pour vous faciliter les commandes futures.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mon profil</h2>
              <Button
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                variant={isEditing ? "default" : "outline"}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Sauvegarder' : 'Modifier'}
              </Button>
            </div>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-red-500 text-lg">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-gray-400">Client depuis {new Date(profile.joinDate).getFullYear()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Gift className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">{profile.loyaltyPoints} points fidélité</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-800 border-gray-600 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-800 border-gray-600 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-800 border-gray-600 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="address" className="text-white">Adresse de livraison</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-800 border-gray-600 text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <Alert className="bg-blue-900/50 border-blue-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-blue-200">
                      Assurez-vous que vos informations sont exactes pour garantir une livraison réussie.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Programme de fidélité */}
            <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-yellow-400" />
                  Programme de fidélité
                </CardTitle>
                <CardDescription>Gagnez des points à chaque commande</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Points actuels:</span>
                    <span className="text-2xl font-bold text-yellow-400">{profile.loyaltyPoints}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Prochain palier (1500 pts):</span>
                    <span>{1500 - profile.loyaltyPoints} points restants</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${(profile.loyaltyPoints / 1500) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Obtenez 10% de réduction sur votre prochaine commande au prochain palier !
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de paiement Mobile Money */}
      {MobileMoneyPayment && (
        <MobileMoneyPayment
          isOpen={showPayment}
          amount={calculateCartTotal()}
          orderId={pendingOrderId}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  )
}
