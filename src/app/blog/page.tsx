import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Heart, MessageCircle, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "L'Art de la Fusion Afro-Italienne : Quand Deux Mondes se Rencontrent",
    excerpt: "Découvrez comment notre chef Kwame Asante marie les traditions culinaires italiennes avec les saveurs authentiques de l'Afrique de l'Ouest.",
    content: "La cuisine fusion afro-italienne représente bien plus qu'une simple combinaison d'ingrédients...",
    author: "Kwame Asante",
    date: "2024-07-20",
    readTime: "5 min",
    image: "https://cdn.5280.com/2024/02/RasKassas_Joni-Schrantz_201092-1-1-1280x720.jpg",
    category: "Cuisine",
    tags: ["fusion", "afro-italien", "tradition", "innovation"],
    featured: true
  },
  {
    id: "2",
    title: "Le Fonio : La Céréale Africaine qui Révolutionne nos Risottos",
    excerpt: "Plongez dans l'histoire du fonio, cette céréale millénaire d'Afrique de l'Ouest qui apporte une texture unique à nos risottos modernes.",
    content: "Le fonio est une céréale ancestrale d'Afrique de l'Ouest qui révolutionne notre approche des risottos...",
    author: "Aminata Traoré",
    date: "2024-07-18",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=300&fit=crop",
    category: "Ingrédients",
    tags: ["fonio", "céréales", "afrique", "risotto"],
    featured: false
  },
  {
    id: "3",
    title: "Du Bissap au Tiramisu : Une Romance Gustative",
    excerpt: "L'histoire de notre dessert signature qui unit la fleur d'hibiscus africaine à la douceur italienne du mascarpone.",
    author: "Aminata Traoré",
    date: "2024-07-15",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1567396900267-56d9b7dc5b58?w=500&h=300&fit=crop",
    category: "Desserts",
    tags: ["bissap", "tiramisu", "fusion", "dessert"],
    featured: true
  },
  {
    id: "4",
    title: "Les Épices Secrètes de Notre Sauce Mafé Italienne",
    excerpt: "Découvrez les secrets de notre sauce mafé revisitée qui transforme une simple pizza en voyage culinaire transcontinental.",
    author: "Sekou Diallo",
    date: "2024-07-12",
    readTime: "6 min",
    image: "https://cdn.shopify.com/s/files/1/1353/1137/files/7ea855bb-8fca-4c62-a32c-98c448d26141.png?v=1748918522",
    category: "Sauces",
    tags: ["mafé", "épices", "arachide", "pizza"],
    featured: false
  },
  {
    id: "5",
    title: "Voyage Culinaire : De la Toscane à la Côte d'Ivoire",
    excerpt: "Retracez l'incroyable histoire de Mama Aisha Diallo-Rossi et comment son parcours a donné naissance à Terrano Express.",
    author: "Fatoumata Kone",
    date: "2024-07-10",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop",
    category: "Histoire",
    tags: ["histoire", "toscane", "côte d'ivoire", "famille"],
    featured: true
  },
  {
    id: "5",
    title: "Les Épices Suya : De Lagos à Milan",
    excerpt: "Découvrez comment les épices traditionnelles nigérianes transforment nos plats italiens classiques en créations extraordinaires.",
    author: "Sekou Diabaté",
    date: "2024-07-12",
    readTime: "6 min",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/cb/19/1a/suya-a-delicious-african.jpg?w=900&h=500&s=1",
    category: "Épices",
    tags: ["suya", "épices", "nigeria", "italien"],
    featured: false
  },
  {
    id: "6",
    title: "Plantain Gnocchi : Une Innovation Afro-Italienne",
    excerpt: "Comment le plantain ouest-africain révolutionne la préparation traditionnelle des gnocchis italiens.",
    author: "Fatoumata Keita",
    date: "2024-07-10",
    readTime: "5 min",
    image: "https://s3-media0.fl.yelpcdn.com/bphoto/88aPSSGsjO6R6l8lAEvnbg/1000s.jpg",
    category: "Innovation",
    tags: ["plantain", "gnocchi", "innovation", "tradition"],
    featured: true
  },
  {
    id: "7",
    title: "L'Huile de Palme Rouge en Cuisine Moderne",
    excerpt: "Explorez les bienfaits et les applications culinaires de l'huile de palme rouge dans notre cuisine fusion contemporaine.",
    author: "Kwame Asante",
    date: "2024-07-08",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=300&fit=crop",
    category: "Ingrédients",
    tags: ["huile de palme", "moderne", "bienfaits", "cuisine"],
    featured: false
  },
  {
    id: "8",
    title: "Le Mariage du Parmesan et du Fromage de Chèvre Peul",
    excerpt: "Une exploration gustative de l'alliance entre les fromages italiens et les traditions fromagères ouest-africaines.",
    author: "Aminata Traoré",
    date: "2024-07-05",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&h=300&fit=crop",
    category: "Fromages",
    tags: ["parmesan", "fromage peul", "tradition", "fusion"],
    featured: false
  },
  {
    id: "9",
    title: "Pasta al Ndolé : Quand le Cameroun Rencontre l'Italie",
    excerpt: "L'histoire fascinante de notre création signature qui unit la sauce ndolé camerounaise aux pâtes italiennes.",
    author: "Sekou Diabaté",
    date: "2024-07-02",
    readTime: "5 min",
    image: "https://s3-media0.fl.yelpcdn.com/bphoto/rHHvhRF8QPjee5B7c54jzw/1000s.jpg",
    category: "Signature",
    tags: ["ndolé", "cameroun", "pasta", "signature"],
    featured: true
  }
];

const categories = ["Tous", "Cuisine", "Ingrédients", "Desserts", "Sauces", "Histoire", "Épices", "Innovation", "Fromages", "Signature"];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Blog <span className="text-red-500">Culinaire</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Explorez l'univers fascinant de la cuisine fusion afro-italienne à travers nos récits,
              recettes et découvertes culinaires.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-bold text-center mb-16">
            Articles <span className="text-red-500">Vedettes</span>
          </h2>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {featuredPosts.map((post, index) => (
              <Card key={post.id} className={`bg-gray-900 border-white/10 overflow-hidden hover:border-red-500/50 transition-all duration-300 group ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                <div className={`relative overflow-hidden ${index === 0 ? 'h-80' : 'h-48'}`}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{post.author}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="mr-4">{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className={`font-bold text-white mb-3 group-hover:text-red-500 transition-colors ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                    {post.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-800 text-xs rounded-full text-gray-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" className="text-red-500 hover:text-red-400 p-0">
                    Lire la suite
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* All Posts */}
      <div className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-bold text-center mb-16">
            Tous nos <span className="text-red-500">Articles</span>
          </h2>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-red-500 hover:border-red-500"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="bg-black/50 border-white/10 overflow-hidden hover:border-red-500/50 transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{post.author}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        24
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        8
                      </span>
                      <span className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1" />
                        12
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <Card className="bg-gradient-to-r from-red-500 to-orange-500 border-none">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                Restez informé de nos découvertes culinaires
              </h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Recevez nos derniers articles, recettes exclusives et conseils de nos chefs
                pour créer la fusion afro-italienne chez vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 rounded-lg text-black"
                />
                <Button className="bg-white text-red-500 hover:bg-gray-100 px-8">
                  S'abonner
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
