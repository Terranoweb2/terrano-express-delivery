import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="text-xl font-bold">Terrano-Express</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Service de livraison ultra-rapide par moto en Côte d'Ivoire.
              Tracking GPS en temps réel et notifications push.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/menu" className="text-gray-400 hover:text-white transition-colors">Menu</Link></li>
              <li><Link href="/track" className="text-gray-400 hover:text-white transition-colors">Suivi</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-500" />
                <span className="text-gray-400">+225 07 12 34 56 78</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-500" />
                <span className="text-gray-400">contact@terrano-express.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-gray-400">Boulevard Lagunaire, Cocody, Abidjan</span>
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="font-semibold mb-4">Horaires</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-gray-400">Lun - Dim: 8h - 23h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2025 Terrano-Express. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
