"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Testimonial {
  id: string
  name: string
  avatar: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Aissata Kone",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c371?w=150&h=150&fit=crop",
    rating: 5,
    comment: "Incroyable ! Le Spaghetti au Thieboudienne m'a rappelé mon enfance au Sénégal tout en découvrant l'Italie. Cette fusion afro-italienne est un pur génie culinaire !",
    date: "Il y a 2 jours",
    verified: true
  },
  {
    id: "2",
    name: "Giovanni Diallo",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    rating: 5,
    comment: "Étant à moitié italien et ivoirien, ce restaurant représente parfaitement mes deux cultures. Le Tiramisu au Bissap est révolutionnaire ! Merci Chef Kwame.",
    date: "Il y a 5 jours",
    verified: true
  },
  {
    id: "3",
    name: "Fatoumata Sow",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    rating: 4,
    comment: "La Pizza Mafé est une révélation ! Jamais je n'aurais imaginé que sauce arachide et mozzarella se marieraient si bien. Un voyage culinaire inoubliable.",
    date: "Il y a 1 semaine",
    verified: true
  },
  {
    id: "4",
    name: "Mamadou Bah",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    rating: 5,
    comment: "Un voyage gustatif en Italie ! Le chef Marco nous a préparé un osso buco d'exception. Service attentif et cadre romantique parfait pour un dîner en amoureux.",
    date: "Il y a 2 semaines",
    verified: true
  },
  {
    id: "5",
    name: "Camille Mercier",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    rating: 5,
    comment: "Bravo pour cette belle découverte ! Les desserts maison sont un délice, particulièrement la panna cotta. L'équipe est passionnée et ça se ressent dans l'assiette.",
    date: "Il y a 3 semaines",
    verified: true
  },
  {
    id: "6",
    name: "Alexandre Moreau",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 4,
    comment: "Belle découverte dans le quartier. Les risottos sont onctueux à souhait et la carte des vins bien fournie. Petit bémol sur l'attente mais ça vaut le coup !",
    date: "Il y a 1 mois",
    verified: false
  },
  {
    id: "7",
    name: "Amina Ouedraogo",
    avatar: "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=150&h=150&fit=crop",
    rating: 5,
    comment: "Le Gnocchi au Plantain et Sauce Ndolé m'a transportée ! Enfin un restaurant qui comprend vraiment la richesse de nos saveurs africaines mariées à l'excellence italienne.",
    date: "Il y a 4 jours",
    verified: true
  },
  {
    id: "8",
    name: "Alessandro Touré",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 5,
    comment: "Mes racines italiennes et maliennes se retrouvent parfaitement dans cette cuisine. Le Suya Beef Ragu est extraordinaire ! Bravo à l'équipe de Terrano Express.",
    date: "Il y a 6 jours",
    verified: true
  },
  {
    id: "9",
    name: "Khadija Cissé",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop",
    rating: 4,
    comment: "L'Attieké Carbonara est une création géniale ! J'ai découvert une nouvelle façon d'apprécier mes plats ivoiriens préférés. Livraison rapide et plat encore chaud.",
    date: "Il y a 1 semaine",
    verified: true
  },
  {
    id: "10",
    name: "Sekou Conté",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    rating: 5,
    comment: "La Bruschetta Suya m'a rappelé les saveurs de Conakry ! Cette fusion afro-italienne respecte nos traditions tout en innovant. Félicitations à Chef Aminata !",
    date: "Il y a 10 jours",
    verified: true
  },
  {
    id: "11",
    name: "Elena Traoré",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c371?w=150&h=150&fit=crop",
    rating: 5,
    comment: "Italienne mariée à un Malien, je cherchais depuis longtemps un endroit qui honore nos deux cultures. Terrano Express l'a fait ! Le Tiramisu au Bissap est divin.",
    date: "Il y a 2 semaines",
    verified: true
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-600"
        }`}
      />
    ))
  }

  return (
    <div className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ce que disent nos <span className="text-red-500">clients</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Découvrez les avis authentiques de nos clients qui ont vécu l'expérience Foodbia
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-2">4.8</div>
            <div className="flex justify-center mb-2">
              {renderStars(5)}
            </div>
            <div className="text-gray-400">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-2">1,200+</div>
            <div className="text-gray-400">Avis clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-2">98%</div>
            <div className="text-gray-400">Recommandations</div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-black border-white/10 max-w-3xl mx-auto">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          {testimonial.verified && (
                            <Badge
                              variant="secondary"
                              className="absolute -bottom-2 -right-2 bg-green-600 text-white text-xs px-2 py-1"
                            >
                              ✓
                            </Badge>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
                            <div className="flex items-center gap-1">
                              {renderStars(testimonial.rating)}
                            </div>
                            <span className="text-sm text-gray-500">{testimonial.date}</span>
                          </div>

                          <div className="relative">
                            <Quote className="absolute -top-2 -left-2 h-8 w-8 text-red-500/30" />
                            <p className="text-gray-300 leading-relaxed pl-6">
                              {testimonial.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black border-white/20 text-white hover:bg-red-500 hover:border-red-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black border-white/20 text-white hover:bg-red-500 hover:border-red-500"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-red-500" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
