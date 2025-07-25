"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Plus, Star, Search, Filter, X, SlidersHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  isPopular?: boolean
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  spiceLevel?: number
}

const menuItems: MenuItem[] = [
  // Entrées Fusion Afro-Italienne
  {
    id: "1",
    name: "Suya Bruschetta",
    description: "Pain grillé aux épices suya, tomates fraîches, basilic africain et huile de palme",
    price: 9500,
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/cb/19/1a/suya-a-delicious-african.jpg?w=900&h=500&s=1",
    category: "appetizers",
    rating: 4.9,
    isPopular: true,
    isVegetarian: true,
    spiceLevel: 2
  },
  {
    id: "2",
    name: "Crevettes Peri-Peri",
    description: "Crevettes grillées aux épices peri-peri ouest-africaines, citron vert et coriandre",
    price: 13500,
    image: "https://s3-media0.fl.yelpcdn.com/bphoto/EA7Wq13hk7PKgZ4xl5hUJQ/1000s.jpg",
    category: "appetizers",
    rating: 4.8,
    spiceLevel: 3,
    isPopular: true
  },
  {
    id: "3",
    name: "Burrata aux Épices Berbères",
    description: "Burrata crémeuse infusée aux épices berbères, roquette et huile d'argan",
    price: 12800,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=400&fit=crop",
    category: "appetizers",
    rating: 4.7,
    isVegetarian: true,
    isGlutenFree: true
  },

  // Plats Principaux Fusion Afro-Italienne
  {
    id: "4",
    name: "Spaghetti Jollof Style",
    description: "Pâtes fraîches aux épices jollof, tomates, piment scotch bonnet et parmesan",
    price: 16800,
    image: "https://s3-media0.fl.yelpcdn.com/bphoto/rHHvhRF8QPjee5B7c54jzw/1000s.jpg",
    category: "main",
    rating: 4.9,
    isPopular: true,
    spiceLevel: 3
  },
  {
    id: "5",
    name: "Risotto aux Champignons et Feuilles de Baobab",
    description: "Risotto crémeux aux champignons africains, feuilles de baobab et fromage de chèvre",
    price: 18200,
    image: "https://travelandmunchies.com/wp-content/uploads/2022/10/IMG_3237-1-scaled.jpg",
    category: "main",
    rating: 4.8,
    isVegetarian: true,
    isGlutenFree: true,
    spiceLevel: 1
  },
  {
    id: "6",
    name: "Suya Beef Ragu",
    description: "Bœuf aux épices suya, pâtes pappardelle et sauce tomate épicée",
    price: 22500,
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&h=400&fit=crop",
    category: "main",
    rating: 4.9,
    spiceLevel: 3,
    isPopular: true
  },
  {
    id: "7",
    name: "Pizza Plantain & Chorizo",
    description: "Base tomate harissa, mozzarella, plantain caramélisé et chorizo épicé",
    price: 15800,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&h=400&fit=crop",
    category: "main",
    rating: 4.7,
    spiceLevel: 2
  },
  {
    id: "13",
    name: "Linguine aux Crevettes et Sauce Mafé",
    description: "Linguine aux crevettes, sauce mafé au beurre de cacahuète et légumes africains",
    price: 19500,
    image: "https://www.lemon8-app.com/seo/image?item_id=7424627148201427461&index=0&sign=850b2b2037aed6a111cd917d8f259b9e",
    category: "main",
    rating: 4.8,
    spiceLevel: 2
  },

  // Desserts Fusion Afro-Italienne
  {
    id: "8",
    name: "Tiramisu au Bissap",
    description: "Mascarpone à l'hibiscus, café africain et essence de baobab",
    price: 7200,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop",
    category: "desserts",
    rating: 4.9,
    isPopular: true,
    isVegetarian: true
  },
  {
    id: "9",
    name: "Panna Cotta à la Mangue et Gingembre",
    description: "Crème vanillée infusée au gingembre, coulis de mangue africaine",
    price: 6800,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=400&fit=crop",
    category: "desserts",
    rating: 4.8,
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: "10",
    name: "Gelato aux Saveurs Africaines",
    description: "3 boules: coco-ananas, sorbet bissap et vanille-karité",
    price: 6500,
    image: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500&h=400&fit=crop",
    category: "desserts",
    rating: 4.7,
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: "14",
    name: "Cannoli au Beurre de Karité",
    description: "Cannoli siciliens garnis de ricotta au beurre de karité et miel d'acacia",
    price: 7500,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500&h=400&fit=crop",
    category: "desserts",
    rating: 4.6,
    isVegetarian: true
  },

  // Boissons
  {
    id: "11",
    name: "Espresso Italien",
    description: "Café espresso authentique, grains Arabica premium",
    price: 2300,
    image: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=500&h=400&fit=crop",
    category: "drinks",
    rating: 4.8,
    isVegan: true,
    isGlutenFree: true
  },
  {
    id: "12",
    name: "Vin Rouge Chianti",
    description: "Chianti Classico DOCG, verre 150ml",
    price: 5900,
    image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&h=400&fit=crop",
    category: "drinks",
    rating: 4.6,
    isVegan: true,
    isGlutenFree: true
  },
  // Fusion Afro-Italienne
  {
    id: "fusion1",
    name: "Spaghetti au Thieboudienne",
    description: "Pâtes fraîches aux saveurs du riz sénégalais, poisson, légumes et épices africaines",
    price: 18500,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d288?w=500&h=400&fit=crop",
    category: "main",
    rating: 4.9,
    isPopular: true,
    spiceLevel: 2
  },
  {
    id: "fusion2",
    name: "Risotto au Fonio et Crevettes",
    description: "Risotto moderne au fonio ouest-africain, crevettes grillées et feuilles de bissap",
    price: 19800,
    image: "https://images.unsplash.com/photo-1563379091-4ab5109f2e85?w=500&h=400&fit=crop",
    category: "main",
    rating: 4.8,
    isPopular: true,
    spiceLevel: 1
  },
  {
    id: "fusion3",
    name: "Pizza Mafé",
    description: "Base italienne, sauce mafé à l'arachide, bœuf épicé, légumes africains",
    price: 16700,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop",
    category: "main",
    rating: 4.7,
    spiceLevel: 3
  },
  {
    id: "fusion4",
    name: "Tiramisu au Bissap",
    description: "Tiramisu revisité avec infusion de bissap, mascarpone et biscuits à la vanille",
    price: 8900,
    image: "https://images.unsplash.com/photo-1567396900267-56d9b7dc5b58?w=500&h=400&fit=crop",
    category: "desserts",
    rating: 4.9,
    isPopular: true
  },
  {
    id: "fusion5",
    name: "Bruschetta au Kedjenou",
    description: "Pain grillé italien garni de kedjenou de poulet ivoirien aux épices",
    price: 9500,
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500&h=400&fit=crop",
    category: "appetizers",
    rating: 4.6,
    spiceLevel: 2
  },
  // Nouveaux plats fusion afro-italienne
  {
    id: "fusion6",
    name: "Attieké Carbonara",
    description: "Semoule de manioc ivoirienne revisitée façon carbonara, pancetta et œufs fermiers",
    price: 17200,
    image: "https://cdn.5280.com/2024/02/RasKassas_Joni-Schrantz_201092-1-1-1280x720.jpg",
    category: "main",
    rating: 4.8,
    isPopular: true,
    spiceLevel: 1
  },
  {
    id: "fusion7",
    name: "Penne au Sauce Arachide",
    description: "Pâtes italiennes dans une sauce crémeuse aux arachides et épices africaines",
    price: 16800,
    image: "https://cdn.shopify.com/s/files/1/1353/1137/files/7ea855bb-8fca-4c62-a32c-98c448d26141.png?v=1748918522",
    category: "main",
    rating: 4.7,
    spiceLevel: 2
  },
  {
    id: "fusion8",
    name: "Calzone au Yassa",
    description: "Chausson italien farci au poulet yassa sénégalais, oignons et citron vert",
    price: 15900,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop",
    category: "main",
    rating: 4.6,
    spiceLevel: 2
  },
  {
    id: "fusion9",
    name: "Gelato au Baobab",
    description: "Glace artisanale italienne parfumée au fruit de baobab et éclats de kola",
    price: 7500,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=400&fit=crop",
    category: "desserts",
    rating: 4.9,
    isPopular: true
  },
  {
    id: "fusion10",
    name: "Cannelloni aux Feuilles de Manioc",
    description: "Pâtes farcies aux feuilles de manioc, viande fumée et sauce tomate épicée",
    price: 18900,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=400&fit=crop",
    category: "main",
    rating: 4.7,
    spiceLevel: 3
  },
  {
    id: "fusion11",
    name: "Gnocchi au Plantain et Sauce Ndolé",
    description: "Gnocchi italiens au plantain, sauce ndolé camerounaise aux arachides et épinards",
    price: 17800,
    image: "https://s3-media0.fl.yelpcdn.com/bphoto/88aPSSGsjO6R6l8lAEvnbg/1000s.jpg",
    category: "main",
    rating: 4.8,
    isVegetarian: true,
    spiceLevel: 2
  },
  {
    id: "fusion12",
    name: "Salade Panzanella aux Épices Berbères",
    description: "Salade toscane traditionnelle revisitée avec légumes africains et vinaigrette harissa",
    price: 12500,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=400&fit=crop",
    category: "appetizers",
    rating: 4.6,
    isVegetarian: true,
    spiceLevel: 2
  },
  {
    id: "fusion13",
    name: "Infusion Bissap-Basilic",
    description: "Thé glacé à l'hibiscus et basilic frais, miel d'acacia et citron vert",
    price: 4500,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=400&fit=crop",
    category: "drinks",
    rating: 4.7,
    isVegan: true,
    isGlutenFree: true
  },
]

const categories = [
  { id: "all", name: "Tous", count: menuItems.length },
  { id: "appetizers", name: "Entrées", count: menuItems.filter(item => item.category === "appetizers").length },
  { id: "main", name: "Plats principaux", count: menuItems.filter(item => item.category === "main").length },
  { id: "desserts", name: "Desserts", count: menuItems.filter(item => item.category === "desserts").length },
  { id: "drinks", name: "Boissons", count: menuItems.filter(item => item.category === "drinks").length },
]

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'rating' | 'popular'

interface Filters {
  category: string
  priceRange: [number, number]
  dietary: string[]
  rating: number
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [isClient, setIsClient] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    category: "all",
    priceRange: [0, 25000],
    dietary: [],
    rating: 0
  })
  const { addItem } = useCart()

  // Initialiser côté client pour éviter l'hydratation
  useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredAndSortedItems = useMemo(() => {
    console.log('🔍 Filtrage des items:', {
      totalItems: menuItems.length,
      selectedCategory,
      searchQuery,
      filters,
      sortBy
    });

    const filtered = menuItems.filter(item => {
      // Search query filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false
      }

      // Price range filter
      if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) {
        return false
      }

      // Rating filter
      if (item.rating < filters.rating) {
        return false
      }

      // Dietary filters
      if (filters.dietary.includes('vegetarian') && !item.isVegetarian) {
        return false
      }
      if (filters.dietary.includes('vegan') && !item.isVegan) {
        return false
      }
      if (filters.dietary.includes('glutenFree') && !item.isGlutenFree) {
        return false
      }

      return true
    })

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [selectedCategory, searchQuery, sortBy, filters])

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description
    })
  }

  const toggleDietaryFilter = (filter: string) => {
    setFilters(prev => ({
      ...prev,
      dietary: prev.dietary.includes(filter)
        ? prev.dietary.filter(f => f !== filter)
        : [...prev.dietary, filter]
    }))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy('name')
    setFilters({
      category: "all",
      priceRange: [0, 25000],
      dietary: [],
      rating: 0
    })
  }

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (filters.dietary.length > 0 ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 25000 ? 1 : 0)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            Notre <span className="text-red-500">Menu</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Découvrez nos spécialités italiennes authentiques, préparées avec passion et des ingrédients de première qualité
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-20 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10 py-6">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Rechercher un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-white/20 text-white focus:border-red-500"
              />
            </div>

            <div className="flex gap-2">
              {/* Advanced Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white hover:text-black relative bg-[#26225e]"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtres
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-black border-white/10">
                  <SheetHeader>
                    <SheetTitle className="text-white">Filtres avancés</SheetTitle>
                    <SheetDescription className="text-gray-400">
                      Affinez votre recherche pour trouver le plat parfait
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 mt-6">
                    {/* Price Range */}
                    <div>
                      <Label className="text-white mb-3 block">Prix (CFA)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.priceRange[0]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            priceRange: [Number(e.target.value), prev.priceRange[1]]
                          }))}
                          className="bg-gray-900 border-white/20 text-white"
                        />
                        <span className="text-gray-400">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.priceRange[1]}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            priceRange: [prev.priceRange[0], Number(e.target.value)]
                          }))}
                          className="bg-gray-900 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    {/* Dietary Restrictions */}
                    <div>
                      <Label className="text-white mb-3 block">Régimes alimentaires</Label>
                      <div className="space-y-2">
                        {[
                          { id: 'vegetarian', label: 'Végétarien' },
                          { id: 'vegan', label: 'Végétalien' },
                          { id: 'glutenFree', label: 'Sans gluten' }
                        ].map((diet) => (
                          <Button
                            key={diet.id}
                            variant={filters.dietary.includes(diet.id) ? "default" : "outline"}
                            onClick={() => toggleDietaryFilter(diet.id)}
                            className={`w-full justify-start ${
                              filters.dietary.includes(diet.id)
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "border-white/20 text-white hover:bg-white hover:text-black"
                            }`}
                          >
                            {diet.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <Label className="text-white mb-3 block">Note minimum</Label>
                      <div className="space-y-2">
                        {[4.5, 4.0, 3.5, 0].map((rating) => (
                          <Button
                            key={rating}
                            variant={filters.rating === rating ? "default" : "outline"}
                            onClick={() => setFilters(prev => ({ ...prev, rating }))}
                            className={`w-full justify-start ${
                              filters.rating === rating
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "border-white/20 text-white hover:bg-white hover:text-black"
                            }`}
                          >
                            {rating > 0 ? (
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                {rating}+
                              </div>
                            ) : (
                              "Toutes les notes"
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white hover:text-black bg-[#38029c]"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white hover:text-black"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Trier
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border-white/10">
                  <DropdownMenuLabel className="text-white">Trier par</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => setSortBy('name')}
                    className="text-white hover:bg-gray-800"
                  >
                    Nom (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy('price-asc')}
                    className="text-white hover:bg-gray-800"
                  >
                    Prix (croissant)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy('price-desc')}
                    className="text-white hover:bg-gray-800"
                  >
                    Prix (décroissant)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy('rating')}
                    className="text-white hover:bg-gray-800"
                  >
                    Note
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy('popular')}
                    className="text-white hover:bg-gray-800"
                  >
                    Popularité
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Category Filter */}
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
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <p className="text-gray-400">
              {filteredAndSortedItems.length} plat{filteredAndSortedItems.length > 1 ? 's' : ''} trouvé{filteredAndSortedItems.length > 1 ? 's' : ''}
            </p>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="h-4 w-4 mr-2" />
                Effacer tous les filtres
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-6 lg:px-12 py-12">
        {!isClient ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-white">Chargement du menu...</div>
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-white mb-4">Aucun plat trouvé</h3>
            <p className="text-gray-400 mb-6">
              Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
            </p>
            <Button onClick={clearFilters} className="bg-red-500 hover:bg-red-600 text-white">
              Réinitialiser la recherche
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedItems.map((item) => (
              <Card key={item.id} className="bg-gray-900 border-white/10 overflow-hidden hover:border-red-500/50 transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {item.isPopular && (
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                      Populaire
                    </Badge>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {item.isVegetarian && (
                      <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                        Végétarien
                      </Badge>
                    )}
                    {item.isVegan && (
                      <Badge variant="secondary" className="bg-green-700 text-white text-xs">
                        Vegan
                      </Badge>
                    )}
                    {item.isGlutenFree && (
                      <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                        Sans gluten
                      </Badge>
                    )}
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">{item.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-300">{item.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-500">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(item.price)}
                  </span>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleAddToCart(item)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
