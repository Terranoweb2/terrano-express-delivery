import { Button } from "@/components/ui/button"
import { Truck, Package, UtensilsCrossed, MapPin, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Testimonials from "@/components/Testimonials"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 rounded-full bg-orange-500/20 blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-red-500/15 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-yellow-500/10 blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 lg:px-12 pt-12 lg:pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Excellence et </span>
                <span className="text-red-500">Goût</span>
                <span className="text-white"> dans Chaque </span>
                <span className="text-red-500">Bouchée</span>
                <span className="text-white"> &</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 font-medium">
                Éveillez vos Sens Culinaires
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="bg-white text-black border-white hover:bg-gray-100 px-6 py-3 rounded-full font-medium"
                asChild
              >
                <Link href="/menu">
                  <Search className="w-4 h-4 mr-2" />
                  Trouvez Vos Recettes Préférées
                </Link>
              </Button>
              <Button
                className="bg-red-500 text-white hover:bg-red-600 px-8 py-3 rounded-full font-medium"
                asChild
              >
                <Link href="/menu">
                  Découvrir Maintenant
                </Link>
              </Button>
            </div>

            {/* Navigation Icons */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <Truck className="h-6 w-6 text-black" />
                </div>
                <span className="text-sm font-medium">Livraison Rapide</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <Package className="h-6 w-6 text-black" />
                </div>
                <span className="text-sm font-medium">À Emporter</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <UtensilsCrossed className="h-6 w-6 text-black" />
                </div>
                <span className="text-sm font-medium">Sur Place</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-red-500">Comment Commander</span>
              </div>
            </div>
          </div>

          {/* Right Content - Food Image */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Enhanced decorative splash effects */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-white rounded-full opacity-60 blur-sm animate-pulse"></div>
              <div className="absolute top-5 -left-5 w-12 h-12 bg-green-400 rounded-full opacity-40 blur-sm animate-pulse delay-500"></div>
              <div className="absolute -bottom-5 right-1/4 w-16 h-16 bg-red-400 rounded-full opacity-50 blur-sm animate-pulse delay-1000"></div>
              <div className="absolute top-1/3 -right-12 w-8 h-8 bg-orange-400 rounded-full opacity-30 blur-sm animate-pulse delay-300"></div>
              <div className="absolute bottom-1/4 -left-8 w-10 h-10 bg-yellow-400 rounded-full opacity-40 blur-sm animate-pulse delay-700"></div>

              {/* Main food image */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <img
                  src="https://media.istockphoto.com/id/1128915783/photo/delicious-appetizing-classic-spaghetti-pasta-with-tomato-sauce-parmesan-cheese-and-fresh.jpg?s=612x612&w=0&k=20&c=UqLauvhesSHXpjA4FgOsPbjmuAytffqnhwEl0Mt5eHU="
                  alt="Delicious spaghetti with tomato sauce"
                  className="w-full h-full object-cover"
                />
                {/* Overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
              </div>

              {/* Additional floating decorative elements */}
              <div className="absolute top-1/4 -right-8 w-6 h-6 bg-yellow-400 rounded-full opacity-70 animate-bounce"></div>
              <div className="absolute bottom-1/3 -left-6 w-4 h-4 bg-green-400 rounded-full opacity-60 animate-bounce delay-1000"></div>
              <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-white rounded-full opacity-80 animate-ping"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Preview */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nos <span className="text-red-500">Spécialités</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Découvrez quelques-unes de nos créations les plus appréciées
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="group">
              <div className="relative h-64 mb-4 overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1621996346565-e3dbc353d288?w=500&h=400&fit=crop"
                  alt="Spaghetti au Thieboudienne"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Spaghetti au Thieboudienne</h3>
              <p className="text-gray-400 mb-3">Pâtes fraîches aux saveurs du riz sénégalais et épices</p>
              <span className="text-2xl font-bold text-red-500">15.000 CFA</span>
            </div>

            <div className="group">
              <div className="relative h-64 mb-4 overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop"
                  alt="Tiramisu"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tiramisu au Bissap</h3>
              <p className="text-gray-400 mb-3">Mascarpone, infusion de bissap et vanille africaine</p>
              <span className="text-2xl font-bold text-red-500">6.500 CFA</span>
            </div>

            <div className="group">
              <div className="relative h-64 mb-4 overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&h=400&fit=crop"
                  alt="Pizza Mafé"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pizza Mafé</h3>
              <p className="text-gray-400 mb-3">Base italienne, sauce mafé, bœuf épicé</p>
              <span className="text-2xl font-bold text-red-500">16.500 CFA</span>
            </div>
          </div>

          <div className="text-center">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium"
              asChild
            >
              <Link href="/menu">
                Voir tout le menu
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-red-900/50 to-black">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt pour une livraison <span className="text-red-500">ultra-rapide</span> ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Commandez dès maintenant et faites-vous livrer nos saveurs authentiques directement chez vous
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium"
              asChild
            >
              <Link href="/menu">
                Commander maintenant
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-medium"
              asChild
            >
              <Link href="/about">
                Notre histoire
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
