import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Configuration pour l'Afrique de l'Ouest avec devise XOF CFA
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

// Fonction utilitaire pour convertir les prix en centimes CFA
export const formatPriceCFA = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Configuration des méthodes de paiement pour l'Afrique de l'Ouest
export const paymentMethods = {
  card: {
    name: 'Carte Bancaire',
    description: 'Visa, Mastercard',
    icon: '💳',
    enabled: true,
  },
  mobileMoney: {
    name: 'Mobile Money',
    description: 'Orange Money, MTN Money, Moov Money',
    icon: '📱',
    enabled: true,
    providers: [
      { name: 'Orange Money', code: 'orange_money', countries: ['CI', 'SN', 'BF', 'ML'] },
      { name: 'MTN Mobile Money', code: 'mtn_momo', countries: ['CI', 'GH', 'CM'] },
      { name: 'Moov Money', code: 'moov_money', countries: ['CI', 'BF', 'TG'] },
    ]
  },
  cashOnDelivery: {
    name: 'Paiement à la livraison',
    description: 'Espèces à réception',
    icon: '💵',
    enabled: true,
  }
}

// Fonction pour créer une session de paiement Stripe
export const createPaymentIntent = async (
  amount: number, // Montant en francs CFA
  currency: string = 'xof',
  metadata: Record<string, string> = {}
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe attend des centimes, mais XOF n'a pas de centimes
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        app: 'terrano-express',
        region: 'west-africa',
      },
      payment_method_types: ['card'],
      // Configuration spécifique pour l'Afrique de l'Ouest
      statement_descriptor: 'Terrano Express',
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Erreur création payment intent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

// Fonction pour créer une session de checkout
export const createCheckoutSession = async (
  items: Array<{
    name: string
    description: string
    amount: number // En francs CFA
    quantity: number
    image?: string
  }>,
  customerEmail?: string,
  successUrl?: string,
  cancelUrl?: string
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'xof',
          product_data: {
            name: item.name,
            description: item.description,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.amount),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/panier`,
      customer_email: customerEmail,
      metadata: {
        app: 'terrano-express',
        region: 'west-africa',
      },
      // Configuration locale pour l'Afrique de l'Ouest
      locale: 'fr',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['CI', 'SN', 'BF', 'ML', 'GH', 'TG', 'BJ', 'NE'],
      },
    })

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    }
  } catch (error) {
    console.error('Erreur création session checkout:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

// Fonction pour vérifier le statut d'un paiement
export const verifyPayment = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return {
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    }
  } catch (error) {
    console.error('Erreur vérification paiement:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

// Fonction pour traiter les webhooks Stripe
export const handleWebhook = async (
  signature: string,
  body: string,
  endpointSecret: string
) => {
  try {
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Logique pour confirmer la commande
        console.log('Paiement réussi:', paymentIntent.id)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        // Logique pour gérer l'échec du paiement
        console.log('Paiement échoué:', failedPayment.id)
        break

      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Erreur webhook:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur webhook'
    }
  }
}

export { stripePromise }
export default stripe
