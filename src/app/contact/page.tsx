"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Adresse",
    details: ["123 Rue de la Gastronomie", "75008 Paris, France"],
    color: "text-red-500"
  },
  {
    icon: Phone,
    title: "Téléphone",
    details: ["+33 1 42 86 77 89", "+33 6 12 34 56 78"],
    color: "text-blue-500"
  },
  {
    icon: Mail,
    title: "Email",
    details: ["contact@foodbia.fr", "reservation@foodbia.fr"],
    color: "text-green-500"
  },
  {
    icon: Clock,
    title: "Horaires",
    details: ["Lun-Dim: 12h00 - 14h30", "Lun-Dim: 19h00 - 23h00"],
    color: "text-yellow-500"
  }
]

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    alert("Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.")
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="text-red-500">Contactez</span> Nous
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Une question, une réservation ou simplement envie de nous dire bonjour ?
            Nous sommes là pour vous accompagner dans votre expérience culinaire.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="bg-gray-900 border-white/10 text-center hover:border-red-500/50 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-white/10`}>
                    <info.icon className={`h-8 w-8 ${info.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-400 text-sm mb-1">{detail}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form & Map */}
      <div className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="bg-black border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Nom complet *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-gray-800 border-white/20 text-white focus:border-red-500"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-white">Téléphone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-white/20 text-white focus:border-red-500"
                          placeholder="Votre téléphone"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-white/20 text-white focus:border-red-500"
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-white">Sujet *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-white/20 text-white focus:border-red-500"
                        placeholder="Objet de votre message"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="bg-gray-800 border-white/20 text-white focus:border-red-500"
                        placeholder="Écrivez votre message ici..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-medium"
                    >
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <Card className="bg-gray-900 border-white/10">
                <CardContent className="p-0">
                  <div className="h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/10"></div>
                    <div className="text-center z-10">
                      <MapPin className="h-16 w-16 text-red-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Notre Emplacement</h3>
                      <p className="text-gray-400">123 Rue de la Gastronomie</p>
                      <p className="text-gray-400">75008 Paris, France</p>
                      <Button variant="outline" className="mt-4 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                        Voir sur Maps
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Hours */}
              <Card className="bg-gray-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Informations Importantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge variant="outline" className="border-green-500 text-green-500 mb-2">
                      Réservation recommandée
                    </Badge>
                    <p className="text-gray-400 text-sm">
                      Pour garantir votre table, nous recommandons de réserver à l'avance,
                      surtout le weekend.
                    </p>
                  </div>

                  <div>
                    <Badge variant="outline" className="border-blue-500 text-blue-500 mb-2">
                      Groupes & Événements
                    </Badge>
                    <p className="text-gray-400 text-sm">
                      Nous accueillons les groupes et organisons des événements privés.
                      Contactez-nous pour plus d'informations.
                    </p>
                  </div>

                  <div>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500 mb-2">
                      Livraison & Emporter
                    </Badge>
                    <p className="text-gray-400 text-sm">
                      Service de livraison disponible dans un rayon de 5km.
                      Commandes à emporter avec 15% de réduction.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="bg-gray-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Suivez-nous</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="icon"
                        className="border-white/20 text-white hover:bg-red-500 hover:border-red-500"
                        asChild
                      >
                        <a href={social.href} target="_blank" rel="noopener noreferrer">
                          <social.icon className="h-5 w-5" />
                        </a>
                      </Button>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-4">
                    Restez connectés pour découvrir nos dernières créations et événements spéciaux !
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
