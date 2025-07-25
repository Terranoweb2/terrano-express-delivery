"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Plus, Minus, Trash2, ShoppingBag, CreditCard, Truck } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import { useState } from "react"

export default function CartSidebar() {
  const { state, increaseQuantity, decreaseQuantity, removeItem, clearCart, closeCart } = useCart()
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart')

  const handleCheckout = () => {
    if (state.items.length === 0) return
    setStep('checkout')
  }

  const handlePlaceOrder = () => {
    setStep('confirmation')
    // Simulate order processing
    setTimeout(() => {
      clearCart()
      setStep('cart')
      closeCart()
    }, 3000)
  }

  const handleClose = () => {
    setStep('cart')
    closeCart()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price)
  }

  const renderCartContent = () => {
    if (state.items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Votre panier est vide</h3>
          <p className="text-gray-400 mb-6">Ajoutez des délicieux plats de notre menu</p>
          <Button
            onClick={closeCart}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Découvrir le menu
          </Button>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 px-6 pb-4">
          <div className="space-y-4">
            {state.items.map((item) => (
              <Card key={item.id} className="bg-gray-900 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{item.name}</h4>
                      <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-white/20 text-white hover:bg-white hover:text-black"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="text-white font-medium w-8 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-white/20 text-white hover:bg-white hover:text-black"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-red-500 font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-white/10 p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Sous-total</span>
              <span>{formatPrice(state.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>TVA (20%)</span>
              <span>{formatPrice(state.tax)}</span>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Total</span>
              <span className="text-red-500">{formatPrice(state.total)}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={clearCart}
              className="flex-1 border-white/20 text-white hover:bg-white hover:text-black"
            >
              Vider le panier
            </Button>
            <Button
              onClick={handleCheckout}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Commander
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderCheckoutContent = () => (
    <div className="px-6 space-y-6">
      <div className="text-center">
        <CreditCard className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Finaliser la commande</h3>
        <p className="text-gray-400">Choisissez votre mode de livraison</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-900 border-white/10 cursor-pointer hover:border-red-500/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Truck className="h-6 w-6 text-red-500" />
              <div className="flex-1">
                <h4 className="text-white font-medium">Livraison à domicile</h4>
                <p className="text-gray-400 text-sm">15-25 minutes • Gratuit dès 25.000 CFA</p>
              </div>
              <Badge variant="secondary" className="bg-red-500 text-white">
                Recommandé
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-white/10 cursor-pointer hover:border-red-500/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-6 w-6 text-green-500" />
              <div className="flex-1">
                <h4 className="text-white font-medium">À emporter</h4>
                <p className="text-gray-400 text-sm">15-20 minutes • 15% de réduction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Sous-total</span>
            <span>{formatPrice(state.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>TVA (20%)</span>
            <span>{formatPrice(state.tax)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Livraison</span>
            <span className="text-green-500">Gratuit</span>
          </div>
          <Separator className="bg-white/10" />
          <div className="flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span className="text-red-500">{formatPrice(state.total)}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setStep('cart')}
            className="flex-1 border-white/20 text-white hover:bg-white hover:text-black"
          >
            Retour
          </Button>
          <Button
            onClick={handlePlaceOrder}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            Valider la commande
          </Button>
        </div>
      </div>
    </div>
  )

  const renderConfirmationContent = () => (
    <div className="flex flex-col items-center justify-center h-96 text-center px-6">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Commande confirmée !</h3>
      <p className="text-gray-400 mb-4">
        Votre commande #{Math.random().toString(36).substr(2, 9).toUpperCase()} a été reçue
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Temps estimé de livraison : 30-45 minutes
      </p>
      <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
        <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{ width: '25%' }}></div>
      </div>
      <p className="text-xs text-gray-500">
        Préparation en cours...
      </p>
    </div>
  )

  const getTitle = () => {
    switch (step) {
      case 'cart':
        return `Panier (${state.itemCount})`
      case 'checkout':
        return 'Commande'
      case 'confirmation':
        return 'Confirmation'
      default:
        return 'Panier'
    }
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:w-96 bg-black border-white/10 p-0">
        <SheetHeader className="p-6 pb-4 border-b border-white/10">
          <SheetTitle className="text-white text-lg font-bold">
            {getTitle()}
          </SheetTitle>
        </SheetHeader>

        {step === 'cart' && renderCartContent()}
        {step === 'checkout' && renderCheckoutContent()}
        {step === 'confirmation' && renderConfirmationContent()}
      </SheetContent>
    </Sheet>
  )
}
