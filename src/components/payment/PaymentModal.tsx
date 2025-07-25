"use client"

import { useState } from "react"
import { PaymentData } from "@/types/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  currency: string
  onPaymentSuccess: (paymentData: PaymentData) => void
}

type PaymentMethod = 'card' | 'mobile_money' | 'cash_on_delivery'

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  currency = 'XOF',
  onPaymentSuccess
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mobile_money')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')

  // Formulaire Mobile Money
  const [mobileMoneyData, setMobileMoneyData] = useState({
    provider: 'orange_money',
    phoneNumber: '',
    pin: ''
  })

  // Formulaire Carte Bancaire
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const mobileMoneyProviders = [
    {
      id: 'orange_money',
      name: 'Orange Money',
      logo: '🔶',
      countries: ['Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso'],
      format: '+225 XX XX XX XX'
    },
    {
      id: 'mtn_momo',
      name: 'MTN Mobile Money',
      logo: '🟡',
      countries: ['Côte d\'Ivoire', 'Ghana', 'Cameroun'],
      format: '+225 XX XX XX XX'
    },
    {
      id: 'moov_money',
      name: 'Moov Money',
      logo: '🔵',
      countries: ['Côte d\'Ivoire', 'Burkina Faso', 'Togo'],
      format: '+225 XX XX XX XX'
    }
  ]

  const paymentMethods = [
    {
      id: 'mobile_money' as PaymentMethod,
      name: 'Mobile Money',
      description: 'Orange Money, MTN, Moov Money',
      icon: Smartphone,
      popular: true,
      available: true
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Carte Bancaire',
      description: 'Visa, Mastercard',
      icon: CreditCard,
      popular: false,
      available: true
    },
    {
      id: 'cash_on_delivery' as PaymentMethod,
      name: 'Paiement à la livraison',
      description: 'Espèces lors de la réception',
      icon: Banknote,
      popular: false,
      available: true
    }
  ]

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus('processing')

    try {
      // Simulation du processus de paiement
      await new Promise(resolve => setTimeout(resolve, 3000))

      if (selectedMethod === 'mobile_money') {
        // Logique Mobile Money
        const paymentData: PaymentData = {
          paymentMethod: 'mobile_money',
          transactionId: `MM${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'completed',
          amount: totalAmount,
          currency,
          timestamp: new Date().toISOString(),
          providerDetails: {
            provider: mobileMoneyData.provider,
            phoneNumber: mobileMoneyData.phoneNumber,
          }
        }
        onPaymentSuccess(paymentData)
      } else if (selectedMethod === 'card') {
        // Logique Stripe
        const paymentData: PaymentData = {
          paymentMethod: 'card',
          transactionId: `CARD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'completed',
          amount: totalAmount,
          currency,
          timestamp: new Date().toISOString(),
          providerDetails: {
            cardLast4: '1234', // Simulation
          }
        }
        onPaymentSuccess(paymentData)
      } else {
        // Paiement à la livraison
        const paymentData: PaymentData = {
          paymentMethod: 'cash_on_delivery',
          transactionId: `COD${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'pending',
          amount: totalAmount,
          currency,
          timestamp: new Date().toISOString(),
        }
        onPaymentSuccess(paymentData)
      }

      setPaymentStatus('success')
      setTimeout(() => {
        onClose()
        setIsProcessing(false)
        setPaymentStatus('idle')
      }, 2000)

    } catch (error) {
      setPaymentStatus('error')
      setIsProcessing(false)
    }
  }

  const renderPaymentForm = () => {
    if (selectedMethod === 'mobile_money') {
      return (
        <div className="space-y-6">
          {/* Sélection du fournisseur */}
          <div>
            <Label className="text-white mb-3 block">Choisir votre opérateur</Label>
            <div className="grid gap-3">
              {mobileMoneyProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className={`cursor-pointer transition-all ${
                    mobileMoneyData.provider === provider.id
                      ? 'bg-red-500/20 border-red-500'
                      : 'bg-gray-800 border-white/10'
                  }`}
                  onClick={() => setMobileMoneyData(prev => ({ ...prev, provider: provider.id }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.logo}</span>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{provider.name}</h4>
                        <p className="text-gray-400 text-sm">{provider.countries.join(', ')}</p>
                      </div>
                      {mobileMoneyData.provider === provider.id && (
                        <CheckCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Numéro de téléphone */}
          <div>
            <Label htmlFor="phoneNumber" className="text-white">Numéro de téléphone</Label>
            <Input
              id="phoneNumber"
              value={mobileMoneyData.phoneNumber}
              onChange={(e) => setMobileMoneyData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="+225 01 02 03 04 05"
              className="bg-gray-800 border-white/20 text-white focus:border-red-500"
            />
          </div>

          {/* Code PIN */}
          <div>
            <Label htmlFor="pin" className="text-white">Code PIN Mobile Money</Label>
            <Input
              id="pin"
              type="password"
              value={mobileMoneyData.pin}
              onChange={(e) => setMobileMoneyData(prev => ({ ...prev, pin: e.target.value }))}
              placeholder="****"
              maxLength={4}
              className="bg-gray-800 border-white/20 text-white focus:border-red-500"
            />
          </div>
        </div>
      )
    }

    if (selectedMethod === 'card') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber" className="text-white">Numéro de carte</Label>
            <Input
              id="cardNumber"
              value={cardData.cardNumber}
              onChange={(e) => setCardData(prev => ({ ...prev, cardNumber: e.target.value }))}
              placeholder="1234 5678 9012 3456"
              className="bg-gray-800 border-white/20 text-white focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate" className="text-white">Date d'expiration</Label>
              <Input
                id="expiryDate"
                value={cardData.expiryDate}
                onChange={(e) => setCardData(prev => ({ ...prev, expiryDate: e.target.value }))}
                placeholder="MM/AA"
                className="bg-gray-800 border-white/20 text-white focus:border-red-500"
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="text-white">CVV</Label>
              <Input
                id="cvv"
                value={cardData.cvv}
                onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                placeholder="123"
                className="bg-gray-800 border-white/20 text-white focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cardholderName" className="text-white">Nom du titulaire</Label>
            <Input
              id="cardholderName"
              value={cardData.cardholderName}
              onChange={(e) => setCardData(prev => ({ ...prev, cardholderName: e.target.value }))}
              placeholder="DUPONT MARIE"
              className="bg-gray-800 border-white/20 text-white focus:border-red-500"
            />
          </div>
        </div>
      )
    }

    if (selectedMethod === 'cash_on_delivery') {
      return (
        <div className="text-center py-8">
          <Banknote className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Paiement à la livraison</h3>
          <p className="text-gray-400">
            Vous paierez en espèces lors de la réception de votre commande.
          </p>
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mt-4">
            <p className="text-yellow-200 text-sm">
              💡 Astuce: Préparez l'appoint pour faciliter la livraison
            </p>
          </div>
        </div>
      )
    }
  }

  if (paymentStatus === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-black border-white/10 max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">Paiement réussi !</h3>
            <p className="text-gray-400">Votre commande a été confirmée.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">Finaliser le paiement</DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sélection de la méthode de paiement */}
          <div>
            <h3 className="text-white font-semibold mb-4">Méthode de paiement</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? 'bg-red-500/20 border-red-500'
                      : 'bg-gray-800 border-white/10'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <method.icon className="h-6 w-6 text-white" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">{method.name}</h4>
                          {method.popular && (
                            <Badge className="bg-red-500 text-white text-xs">Populaire</Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Formulaire de paiement */}
          <div>
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-2">Récapitulatif</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total à payer</span>
                <span className="text-2xl font-bold text-red-500">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {renderPaymentForm()}

            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white h-12"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Traitement en cours...
                </div>
              ) : (
                `Payer ${formatPrice(totalAmount)}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
