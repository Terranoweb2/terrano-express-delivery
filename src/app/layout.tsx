import { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CartProvider } from "@/contexts/CartContext"
import CartSidebar from "@/components/CartSidebar"
import { NotificationProvider } from "@/hooks/useNotifications"
import NotificationToast from "@/components/notifications/NotificationToast"
import ServiceWorkerInit from "@/components/ServiceWorkerInit"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Terrano-Express - Livraison Ultra-Rapide en Côte d'Ivoire",
  description: "Service de livraison express par moto en Côte d'Ivoire. Commandez et suivez votre livreur en temps réel avec notifications push.",
  keywords: "livraison, moto, Côte d'Ivoire, Abidjan, nourriture, express, tracking GPS, notifications push",
  authors: [{ name: "Terrano Express" }],
  creator: "Terrano Express",
  publisher: "Terrano Express",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://terrano-express.com'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-CI': '/fr',
      'fr': '/fr',
    },
  },
  openGraph: {
    title: "Terrano-Express - Livraison Ultra-Rapide",
    description: "Livraison express par moto avec tracking GPS en temps réel",
    url: 'https://terrano-express.com',
    siteName: 'Terrano Express',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Terrano Express - Livraison par moto',
      },
    ],
    locale: 'fr_CI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Terrano-Express - Livraison Ultra-Rapide",
    description: "Livraison express par moto avec tracking GPS en temps réel",
    images: ['/twitter-image.jpg'],
    creator: '@terranoexpress',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/icons/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#EF4444',
      },
    ],
  },
  applicationName: 'Terrano Express',
  referrer: 'origin-when-cross-origin',
  category: 'food',
  classification: 'Business',
  other: {
    'msapplication-TileColor': '#EF4444',
    'msapplication-TileImage': '/icons/mstile-144x144.png',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#EF4444',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/icons/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#EF4444" />
        <meta name="msapplication-TileColor" content="#EF4444" />
        <meta name="theme-color" content="#EF4444" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Terrano Express" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Terrano Express" />


      </head>
      <body className={`${inter.className} antialiased bg-[#492759]`}>
        <NotificationProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <CartSidebar />
            <NotificationToast position="top-right" maxNotifications={3} />
            <ServiceWorkerInit />
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
