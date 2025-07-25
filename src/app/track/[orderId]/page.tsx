import { notFound } from 'next/navigation'
import OrderTrackingClient from '@/components/OrderTrackingClient'

// Générer les paramètres statiques pour l'export
export async function generateStaticParams() {
  // Générer quelques IDs de commande exemple pour l'export statique
  return [
    { orderId: 'CMD001' },
    { orderId: 'CMD002' },
    { orderId: 'CMD003' },
  ]
}

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function OrderTrackingPage({ params }: PageProps) {
  const { orderId } = await params

  if (!orderId) {
    notFound()
  }

  return <OrderTrackingClient orderId={orderId} />
}
