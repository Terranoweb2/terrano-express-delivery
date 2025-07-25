"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Clock,
  Package,
  Truck,
  CheckCircle,
  Star,
  Phone,
  MessageCircle,
  Navigation
} from "lucide-react"
import Link from 'next/link'

interface TrackingStep {
  id: string
  title: string
  description: string
  timestamp: string
  completed: boolean
  current: boolean
}

interface OrderTracking {
  orderId: string
  status: 'confirmed' | 'preparing' | 'pickup' | 'delivery' | 'delivered'
  estimatedTime: string
  deliveryAddress: string
  deliverer?: {
    name: string
    phone: string
    rating: number
    vehicleType: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  steps: TrackingStep[]
}

interface OrderTrackingClientProps {
  orderId: string
}

export default function OrderTrackingClient({ orderId }: OrderTrackingClientProps) {
  const [orderData, setOrderData] = useState<OrderTracking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const mockData: OrderTracking = {
        orderId: orderId || 'CMD001',
        status: 'delivery',
        estimatedTime: '15 minutes',
        deliveryAddress: 'Cocody, Boulevard Lagunaire, Résidence Palmier, Apt 12',
        deliverer: {
          name: 'Moussa Konaté',
          phone: '+225 05 87 65 43 21',
          rating: 4.8,
          vehicleType: 'Moto'
        },
        items: [
          { name: 'Tiramisu au Bissap', quantity: 2, price: 6500 },
          { name: 'Pizza Mafé', quantity: 1, price: 16500 }
        ],
        total: 29500,
        steps: [
          {
            id: '1',
            title: 'Commande confirmée',
            description: 'Votre commande a été reçue et confirmée',
            timestamp: '14:30',
            completed: true,
            current: false
          },
          {
            id: '2',
            title: 'Préparation en cours',
            description: 'Le restaurant prépare votre commande',
            timestamp: '14:35',
            completed: true,
            current: false
          },
          {
            id: '3',
            title: 'Prêt pour récupération',
            description: 'Commande prête, en attente du livreur',
            timestamp: '14:50',
            completed: true,
            current: false
          },
          {
            id: '4',
            title: 'En cours de livraison',
            description: 'Le livreur est en route vers votre adresse',
            timestamp: '15:00',
            completed: false,
            current: true
          },
          {
            id: '5',
            title: 'Livré',
            description: 'Commande livrée avec succès',
            timestamp: '',
            completed: false,
            current: false
          }
        ]
      }
      setOrderData(mockData)
      setLoading(false)
    }, 1000)
  }, [orderId])

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'confirmed': return 20
      case 'preparing': return 40
      case 'pickup': return 60
      case 'delivery': return 80
      case 'delivered': return 100
      default: return 0
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Chargement du suivi de commande...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Commande introuvable</h1>
          <p className="text-gray-400 mb-4">Aucune commande trouvée avec l'ID : {orderId}</p>
          <Button asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* En-tête de commande */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Suivi de commande</h1>
          <p className="text-gray-400">Commande #{orderData.orderId}</p>
        </div>

        {/* Barre de progression principale */}
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">État de la livraison</h3>
                <p className="text-gray-400">Temps estimé: {orderData.estimatedTime}</p>
              </div>
              <Badge
                variant="secondary"
                className="bg-orange-500 text-white px-3 py-1"
              >
                En cours de livraison
              </Badge>
            </div>
            <Progress value={getStatusProgress(orderData.status)} className="h-3 mb-2" />
            <p className="text-sm text-gray-400">
              {getStatusProgress(orderData.status)}% terminé
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Étapes de livraison */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Étapes de livraison</CardTitle>
                <CardDescription>Suivez l'avancement de votre commande</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderData.steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-500'
                            : step.current
                              ? 'bg-orange-500'
                              : 'bg-gray-600'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <span className="text-white text-sm">{index + 1}</span>
                          )}
                        </div>
                        {index < orderData.steps.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-600'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          step.current ? 'text-orange-400' : step.completed ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-500">{step.description}</p>
                        {step.timestamp && (
                          <p className="text-xs text-gray-600 mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {step.timestamp}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations latérales */}
          <div className="space-y-6">
            {/* Livreur */}
            {orderData.deliverer && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Votre livreur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">{orderData.deliverer.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {orderData.deliverer.rating} • {orderData.deliverer.vehicleType}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Adresse de livraison */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{orderData.deliveryAddress}</p>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  <Navigation className="h-4 w-4 mr-2" />
                  Voir sur la carte
                </Button>
              </CardContent>
            </Card>

            {/* Récapitulatif de commande */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} CFA</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-green-400">{orderData.total.toLocaleString()} CFA</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
