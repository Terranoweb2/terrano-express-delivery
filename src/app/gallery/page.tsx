"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight, Camera, Users, ChefHat, Utensils } from "lucide-react"
import Image from "next/image"

interface GalleryImage {
  id: string
  src: string
  alt: string
  category: string
  title: string
  description: string
}

const galleryImages: GalleryImage[] = [
  // Restaurant Interior
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    alt: "Salle principale",
    category: "restaurant",
    title: "Salle principale",
    description: "Notre magnifique salle principale avec une ambiance chaleureuse et élégante"
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    alt: "Tables dressées",
    category: "restaurant",
    title: "Tables dressées",
    description: "Nos tables soigneusement préparées pour vous accueillir"
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=600&fit=crop",
    alt: "Cuisine ouverte",
    category: "restaurant",
    title: "Cuisine ouverte",
    description: "Notre cuisine ouverte où la magie culinaire opère"
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop",
    alt: "Terrasse",
    category: "restaurant",
    title: "Terrasse d'été",
    description: "Notre belle terrasse pour profiter des soirées d'été"
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&h=600&fit=crop",
    alt: "Bar à vin",
    category: "restaurant",
    title: "Cave à vins",
    description: "Notre sélection de vins italiens d'exception"
  },

  // Food Photography
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1621996346565-e3dbc353d288?w=800&h=600&fit=crop",
    alt: "Spaghetti Carbonara",
    category: "food",
    title: "Spaghetti Carbonara",
    description: "Notre signature : des pâtes fraîches dans la plus pure tradition italienne"
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop",
    alt: "Tiramisu maison",
    category: "food",
    title: "Tiramisu maison",
    description: "Le dessert emblématique de l'Italie, préparé selon la recette traditionnelle"
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop",
    alt: "Pizza Margherita",
    category: "food",
    title: "Pizza Margherita",
    description: "La reine des pizzas avec ses ingrédients simples et authentiques"
  },
  {
    id: "9",
    src: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop",
    alt: "Risotto aux champignons",
    category: "food",
    title: "Risotto aux champignons porcini",
    description: "Un risotto crémeux aux champignons porcini et truffe noire"
  },
  {
    id: "10",
    src: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&h=600&fit=crop",
    alt: "Bruschetta",
    category: "food",
    title: "Bruschetta classique",
    description: "Entrée traditionnelle avec tomates fraîches et basilic du jardin"
  },
  {
    id: "11",
    src: "https://images.unsplash.com/photo-1563379091-4ab5109f2e85?w=800&h=600&fit=crop",
    alt: "Crevettes à l'ail",
    category: "food",
    title: "Crevettes à l'ail",
    description: "Crevettes fraîches sautées à l'ail et persil"
  },

  // Team
  {
    id: "12",
    src: "https://images.unsplash.com/photo-1583394293214-28a4b3dd8f18?w=800&h=600&fit=crop",
    alt: "Chef Marco",
    category: "team",
    title: "Chef Marco Rossi",
    description: "Notre chef exécutif originaire de Toscane"
  },
  {
    id: "13",
    src: "https://images.unsplash.com/photo-1594736797933-d0cbe1b04240?w=800&h=600&fit=crop",
    alt: "Chef Sofia",
    category: "team",
    title: "Chef Pâtissière Sofia",
    description: "Spécialiste des desserts italiens authentiques"
  },
  {
    id: "14",
    src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop",
    alt: "Sommelier Giuseppe",
    category: "team",
    title: "Giuseppe, notre sommelier",
    description: "Expert en vins italiens et accords mets-vins"
  },

  // Events
  {
    id: "15",
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
    alt: "Soirée dégustation",
    category: "events",
    title: "Soirée dégustation de vins",
    description: "Nos soirées mensuelles autour des vins d'Italie"
  },
  {
    id: "16",
    src: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&h=600&fit=crop",
    alt: "Cours de cuisine",
    category: "events",
    title: "Cours de cuisine italienne",
    description: "Apprenez à cuisiner comme un vrai chef italien"
  },
  {
    id: "17",
    src: "https://images.unsplash.com/photo-1529543544282-ea669407fca4?w=800&h=600&fit=crop",
    alt: "Événement privé",
    category: "events",
    title: "Événements privés",
    description: "Organisez vos événements dans notre restaurant"
  }
]

const categories = [
  { id: "all", name: "Tout", icon: Camera, count: galleryImages.length },
  { id: "restaurant", name: "Restaurant", icon: Utensils, count: galleryImages.filter(img => img.category === "restaurant").length },
  { id: "food", name: "Nos plats", icon: ChefHat, count: galleryImages.filter(img => img.category === "food").length },
  { id: "team", name: "Équipe", icon: Users, count: galleryImages.filter(img => img.category === "team").length },
  { id: "events", name: "Événements", icon: Camera, count: galleryImages.filter(img => img.category === "events").length }
]

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filteredImages = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory)

  const openLightbox = (image: GalleryImage) => {
    setLightboxImage(image)
    setLightboxIndex(filteredImages.findIndex(img => img.id === image.id))
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % filteredImages.length
    setLightboxIndex(nextIndex)
    setLightboxImage(filteredImages[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
    setLightboxIndex(prevIndex)
    setLightboxImage(filteredImages[prevIndex])
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            Notre <span className="text-red-500">Galerie</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Plongez dans l'univers de Foodbia à travers nos photos. Découvrez notre restaurant, nos plats signature et notre équipe passionnée.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-20 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10 py-6">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-transparent border-white/20 text-white hover:bg-white hover:text-black"
                } rounded-full px-6 py-2`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Card
              key={image.id}
              className="bg-gray-900 border-white/10 overflow-hidden hover:border-red-500/50 transition-all duration-300 group cursor-pointer"
              onClick={() => openLightbox(image)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 p-3 rounded-full">
                      <Camera className="h-6 w-6 text-black" />
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className={`${
                        image.category === 'restaurant' ? 'bg-blue-600' :
                        image.category === 'food' ? 'bg-green-600' :
                        image.category === 'team' ? 'bg-purple-600' :
                        'bg-orange-600'
                      } text-white text-xs`}
                    >
                      {categories.find(cat => cat.id === image.category)?.name}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1 truncate">{image.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{image.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Aucune image trouvée</h3>
            <p className="text-gray-400">Sélectionnez une autre catégorie pour voir plus de photos.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <Dialog open={!!lightboxImage} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-4xl w-full bg-black border-white/10 p-0 overflow-hidden">
            <div className="relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Image */}
              <div className="relative aspect-video w-full">
                <Image
                  src={lightboxImage.src}
                  alt={lightboxImage.alt}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Image info */}
              <div className="bg-black/90 text-white p-6">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-2xl font-bold">{lightboxImage.title}</h2>
                  <Badge
                    variant="secondary"
                    className={`${
                      lightboxImage.category === 'restaurant' ? 'bg-blue-600' :
                      lightboxImage.category === 'food' ? 'bg-green-600' :
                      lightboxImage.category === 'team' ? 'bg-purple-600' :
                      'bg-orange-600'
                    } text-white`}
                  >
                    {categories.find(cat => cat.id === lightboxImage.category)?.name}
                  </Badge>
                </div>
                <p className="text-gray-300">{lightboxImage.description}</p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-400 text-sm">
                    {lightboxIndex + 1} / {filteredImages.length}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white hover:text-black">
                      Partager
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white hover:text-black">
                      Télécharger
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Call to Action */}
      <div className="bg-gray-900/50 py-16 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vivez l'expérience <span className="text-red-500">Foodbia</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Réservez votre table dès maintenant et découvrez par vous-même la magie de notre cuisine italienne authentique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3">
              Réserver une table
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black px-8 py-3">
              Voir le menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
