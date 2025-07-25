import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Award } from "lucide-react"
import Image from "next/image"

const teamMembers = [
  {
    name: "Kwame Asante",
    position: "Chef Exécutif",
    image: "https://media.istockphoto.com/id/2030133420/photo/happy-black-cook-serving-a-meal-in-the-kitchen-in-restaurant-and-looking-at-camera.jpg?s=612x612&w=0&k=20&c=FD82J5GsVYSB9BzPCpc0qSXa_lbHIm-8LHI-tpGkviE=",
    experience: "15 ans d'expérience",
    specialty: "Fusion afro-italienne créative"
  },
  {
    name: "Aminata Traoré",
    position: "Chef Pâtissière",
    image: "https://i.guim.co.uk/img/media/bca87367f3abab5631714d68828a01b828784e60/1607_501_5275_3165/master/5275.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=b3ac5439285e9388919446e3bc7b9152",
    experience: "12 ans d'expérience",
    specialty: "Desserts aux épices africaines"
  },
  {
    name: "Sekou Diallo",
    position: "Sommelier",
    image: "https://daily.sevenfifty.com/wp-content/uploads/2020/09/SFD_Tinashe-Nyamudoka-Kumusha-Wines_Tinashe-Kumusha-beach_credit-Gavin-Whithers-_2520x1420.jpg",
    experience: "10 ans d'expérience",
    specialty: "Vins italiens et spiritueux africains"
  },
  {
    name: "Fatoumata Kone",
    position: "Directrice",
    image: "https://news.gsu.edu/files/2024/06/dami-olukoya.jpg",
    experience: "8 ans d'expérience",
    specialty: "Hospitalité africaine moderne"
  }
]

const values = [
  {
    icon: Users,
    title: "Tradition Familiale",
    description: "Nos recettes se transmettent de génération en génération, préservant l'authenticité de la cuisine italienne."
  },
  {
    icon: Award,
    title: "Qualité Premium",
    description: "Nous sélectionnons les meilleurs ingrédients italiens pour garantir une expérience culinaire exceptionnelle."
  },
  {
    icon: MapPin,
    title: "Origine Authentique",
    description: "Nos chefs sont originaires d'Italie et apportent leur savoir-faire traditionnel dans chaque plat."
  },
  {
    icon: Clock,
    title: "Passion Quotidienne",
    description: "Chaque jour, nous préparons nos plats avec amour et dédication pour vous offrir le meilleur."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                À <span className="text-red-500">Propos</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Depuis 1985, Terrano Express fusionne les traditions culinaires italiennes et ouest-africaines,
                créant des moments inoubliables autour de la table.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
              <Image
                src="https://res.cloudinary.com/dxy0fiahv/image/upload/v1747408260/terranoshopp_s9suuw.png"
                alt="Terrano Express Logo"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Notre <span className="text-red-500">Histoire</span>
            </h2>

            <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
              <p>
                L'histoire de Foodbia commence en 1985 lorsque <strong className="text-white">Nonna Maria Rossi</strong>
                quitte sa Toscane natale pour s'installer en France avec ses recettes familiales secrètes.
                Son rêve était simple : créer une fusion unique entre les saveurs italiennes et ouest-africaines avec le monde entier.
              </p>

              <p>
                Ce qui a commencé comme une petite trattoria familiale s'est transformé en une institution
                culinaire respectée. Nous avons préservé l'esprit traditionnel tout en évoluant avec notre temps,
                en utilisant les meilleures technologies pour vous offrir une expérience moderne.
              </p>

              <p>
                Aujourd'hui, dirigé par la troisième génération de la famille Rossi, Foodbia continue de
                célébrer l'art de vivre à l'italienne. Chaque plat raconte une histoire, chaque ingrédient
                est choisi avec soin, et chaque client devient membre de notre grande famille.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500 mb-2">38</div>
                <div className="text-gray-400">Années d'expérience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500 mb-2">50k+</div>
                <div className="text-gray-400">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500 mb-2">15</div>
                <div className="text-gray-400">Spécialités authentiques</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-bold text-center mb-16">
            Nos <span className="text-red-500">Valeurs</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-black/50 border-white/10 text-center p-6 hover:border-red-500/50 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-bold text-center mb-16">
            Notre <span className="text-red-500">Équipe</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-gray-900 border-white/10 overflow-hidden hover:border-red-500/50 transition-all duration-300 group">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <Badge variant="outline" className="border-red-500 text-red-500 mb-3">
                    {member.position}
                  </Badge>
                  <p className="text-sm text-gray-400 mb-2">{member.experience}</p>
                  <p className="text-sm text-gray-300">{member.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-bold text-center mb-16">
            Notre <span className="text-red-500">Restaurant</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
                alt="Salle principale"
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&h=400&fit=crop"
                alt="Cuisine ouverte"
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop"
                alt="Terrasse"
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
