"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, UtensilsCrossed, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Suivi", href: "/track" },
  { name: "Blog", href: "/blog" },
  { name: "À propos", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const { state, openCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Initialiser côté client pour éviter l'hydratation
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <header className="relative z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
              <Image
                src="https://res.cloudinary.com/dxy0fiahv/image/upload/v1747408260/terranoshopp_s9suuw.png"
                alt="Terrano Express Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
              Terrano-Express
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-red-400 font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={openCart}
              className="relative bg-transparent border-white/20 text-white hover:bg-white hover:text-black transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {isClient && state.itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                >
                  {state.itemCount}
                </Badge>
              )}
            </Button>

            {/* Login/Profile */}
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:flex bg-transparent border-white/20 text-white hover:bg-white hover:text-black"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-black border-white/10">
                <div className="flex flex-col pt-6">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <UtensilsCrossed className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Terrano-Express</span>
                  </div>

                  <nav className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-red-400 font-medium transition-colors py-2"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Cart Button */}
                  <Button
                    onClick={() => {
                      setIsOpen(false)
                      openCart()
                    }}
                    className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white relative"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Panier
                    {isClient && state.itemCount > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-white text-red-500">
                        {state.itemCount}
                      </Badge>
                    )}
                  </Button>

                  <div className="flex flex-col gap-3 mt-8 pt-8 border-t border-white/10">
                    <Button className="bg-red-500 text-white hover:bg-red-600">
                      Se connecter
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black">
                      Créer un compte
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
