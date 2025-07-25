"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Smartphone,
  CheckCircle,
  Loader2,
  AlertCircle,
  Clock,
  CreditCard,
  Phone
} from "lucide-react"

interface PaymentProvider {
  id: string
  name: string
  logo: string
  color: string
  code: string
  description: string
}

interface MobileMoneyPaymentProps {
  amount: number
  orderId: string
  onSuccess: (transactionId: string) => void
  onCancel: () => void
  isOpen: boolean
}

const paymentProviders: PaymentProvider[] = [
  {
    id: 'orange',
    name: 'Orange Money',
    logo: '🟠',
    color: 'bg-orange-500',
    code: '#144#',
    description: 'Composez #144# pour effectuer le paiement'
  },
  {
    id: 'mtn',
    name: 'MTN Mobile Money',
    logo: '🟡',
    color: 'bg-yellow-500',
    code: '*133#',
    description: 'Composez *133# pour effectuer le paiement'
  },
  {
    id: 'moov',
    name: 'Moov Money',
    logo: '🔵',
    color: 'bg-blue-500',
    code: '*555#',
    description: 'Composez *555# pour effectuer le paiement'
  }
]

export default function MobileMoneyPayment({
  amount,
  orderId,
  onSuccess,
  onCancel,
  isOpen
}: MobileMoneyPaymentProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [step, setStep] = useState<'select' | 'payment' | 'processing' | 'success' | 'error'>('select')
  const [transactionId, setTransactionId] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(120) // 2 minutes pour le paiement

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setError('')
  }

  const handlePhoneSubmit = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Veuillez entrer un numéro de téléphone valide')
      return
    }

    // Validation du numéro selon l'opérateur
    const provider = paymentProviders.find(p => p.id === selectedProvider)
    if (!provider) return

    const cleanPhone = phoneNumber.replace(/\s/g, '')

    // Validation basique des préfixes ivoiriens
    const validPrefixes = {
      orange: ['07', '08', '09'],
      mtn: ['05', '06'],
      moov: ['01', '02', '03']
    }

    const prefix = cleanPhone.substring(cleanPhone.length - 10, cleanPhone.length - 8)
    const expectedPrefixes = validPrefixes[provider.id as keyof typeof validPrefixes]

    if (!expectedPrefixes.includes(prefix)) {
      setError(`Ce numéro ne correspond pas à l'opérateur ${provider.name}`)
      return
    }

    setError('')
    setStep('payment')
    startPaymentProcess()
  }

  const startPaymentProcess = () => {
    setStep('processing')
    const mockTransactionId = `TXN${Date.now()}`
    setTransactionId(mockTransactionId)

    // Simulation du processus de paiement
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          // Simuler un paiement réussi (80% de chance)
          if (Math.random() > 0.2) {
            setStep('success')
            setTimeout(() => onSuccess(mockTransactionId), 2000)
          } else {
            setStep('error')
            setError('Le paiement a échoué. Veuillez réessayer.')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleRetry = () => {
    setStep('select')
    setCountdown(120)
    setError('')
    setTransactionId('')
  }

  const selectedProviderData = paymentProviders.find(p => p.id === selectedProvider)

  return (
    <Dialog open={isOpen} onOpenChange={() => step === 'processing' ? null : onCancel()}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Paiement Mobile Money
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Montant à payer: <span className="font-bold text-green-400">{amount.toLocaleString()} CFA</span>
          </DialogDescription>
        </DialogHeader>

        {/* Étape 1: Sélection du fournisseur */}
        {step === 'select' && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Choisissez votre opérateur</Label>
            <RadioGroup value={selectedProvider} onValueChange={handleProviderSelect}>
              {paymentProviders.map((provider) => (
                <div key={provider.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={provider.id} id={provider.id} />
                  <Label
                    htmlFor={provider.id}
                    className="flex items-center gap-3 flex-1 cursor-pointer p-3 rounded-lg border border-gray-700 hover:border-gray-600"
                  >
                    <span className="text-2xl">{provider.logo}</span>
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-sm text-gray-400">{provider.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedProvider && (
              <div className="space-y-3">
                <Separator className="bg-gray-700" />
                <Label htmlFor="phone" className="text-sm font-medium">
                  Numéro de téléphone {selectedProviderData?.name}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="07 12 34 56 78"
                    className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                  />
                </div>
                {error && (
                  <Alert className="bg-red-900/50 border-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Annuler
              </Button>
              <Button
                onClick={handlePhoneSubmit}
                disabled={!selectedProvider || !phoneNumber}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {/* Étape 2: Instructions de paiement */}
        {step === 'payment' && selectedProviderData && (
          <div className="space-y-4">
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{selectedProviderData.logo}</span>
                  {selectedProviderData.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-300 mb-1">Étapes à suivre:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Composez <strong className="text-green-400">{selectedProviderData.code}</strong> sur votre téléphone</li>
                    <li>Sélectionnez "Paiement marchand"</li>
                    <li>Entrez le montant: <strong className="text-green-400">{amount.toLocaleString()} CFA</strong></li>
                    <li>Entrez le code marchand: <strong className="text-blue-400">TERRANO</strong></li>
                    <li>Confirmez avec votre code PIN</li>
                  </ol>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>Numéro: {phoneNumber}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CreditCard className="h-4 w-4" />
                  <span>Référence: {orderId}</span>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-blue-900/50 border-blue-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                Une fois le paiement effectué, cliquez sur "J'ai payé" pour confirmer.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Retour
              </Button>
              <Button
                onClick={startPaymentProcess}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                J'ai payé
              </Button>
            </div>
          </div>
        )}

        {/* Étape 3: Traitement en cours */}
        {step === 'processing' && (
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <h3 className="text-lg font-semibold">Vérification du paiement...</h3>
              <p className="text-sm text-gray-400">
                Nous vérifions votre paiement auprès de votre opérateur
              </p>
            </div>

            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Temps restant:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono">{formatTime(countdown)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((120 - countdown) / 120) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Transaction ID: {transactionId}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Étape 4: Succès */}
        {step === 'success' && (
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center space-y-3">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="text-xl font-semibold text-green-400">Paiement réussi !</h3>
              <p className="text-sm text-gray-400">
                Votre commande a été confirmée et sera traitée sous peu.
              </p>
            </div>

            <Card className="bg-green-900/20 border-green-500/50">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Montant:</span>
                    <span className="font-semibold">{amount.toLocaleString()} CFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction:</span>
                    <span className="font-mono">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commande:</span>
                    <span>{orderId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => onSuccess(transactionId)} className="w-full bg-green-600 hover:bg-green-700">
              Continuer
            </Button>
          </div>
        )}

        {/* Étape 5: Erreur */}
        {step === 'error' && (
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center space-y-3">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <h3 className="text-xl font-semibold text-red-400">Paiement échoué</h3>
              <p className="text-sm text-gray-400">{error}</p>
            </div>

            <Alert className="bg-red-900/50 border-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                Vérifiez votre solde et réessayez. Si le problème persiste, contactez votre opérateur.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Annuler
              </Button>
              <Button
                onClick={handleRetry}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
