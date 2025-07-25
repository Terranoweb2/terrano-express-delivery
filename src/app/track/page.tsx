"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, MapPin, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrackPage() {
  const [orderId, setOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleTrackOrder = () => {
    if (orderId.trim()) {
      router.push(`/track/${orderId.trim()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrackOrder();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <MapPin className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                Suivez votre <span className="text-red-500">Commande</span>
              </h1>
              <p className="text-xl text-gray-300">
                Suivez votre livraison en temps réel et connaissez la position exacte de votre livreur
              </p>
            </div>

            {/* Formulaire de recherche */}
            <Card className="bg-gray-900 border-white/10 max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-center">Entrez votre numéro de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Ex: CMD001, ORD123..."
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-gray-800 border-white/20 text-white focus:border-red-500 h-12 text-center text-lg"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Votre numéro de téléphone (optionnel)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-gray-800 border-white/20 text-white focus:border-red-500"
                  />
                </div>
                <Button
                  onClick={handleTrackOrder}
                  disabled={!orderId.trim()}
                  className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-lg"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Suivre ma commande
                </Button>
              </CardContent>
            </Card>

            {/* Commandes de démonstration */}
            <div className="mt-8">
              <p className="text-gray-400 mb-4">Ou essayez avec une commande de démonstration :</p>
              <div className="flex flex-wrap gap-2 justify-center bg-[#000000] rounded-[17px] xl:mx-[179px] xl:px-[34px]">
                {['CMD001', 'CMD002', 'CMD003'].map((demo) => (
                  <Button
                    key={demo}
                    variant="outline"
                    onClick={() => router.push(`/track/${demo}`)}
                    className="border-white/20 text-white hover:bg-white hover:text-black bg-[#113536]"
                  >
                    {demo}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fonctionnalités */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Tracking GPS <span className="text-red-500">Ultra-précis</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Suivez votre commande en temps réel avec notre système de géolocalisation avancé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-white/10">
              <CardContent className="p-6 text-center">
                <Navigation className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Position en Temps Réel</h3>
                <p className="text-gray-400">
                  Voyez exactement où se trouve votre livreur sur la carte
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-white/10">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Temps d'Arrivée</h3>
                <p className="text-gray-400">
                  Estimation précise du temps de livraison mis à jour en continu
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-white/10">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Statut Détaillé</h3>
                <p className="text-gray-400">
                  Suivez chaque étape de votre commande de la préparation à la livraison
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Comment ça marche ?
            </h2>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Passez votre commande</h3>
                  <p className="text-gray-400">
                    Après avoir passé votre commande, vous recevrez un numéro de suivi par SMS et email
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Entrez votre numéro</h3>
                  <p className="text-gray-400">
                    Saisissez votre numéro de commande dans le champ ci-dessus pour accéder au suivi
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Suivez en temps réel</h3>
                  <p className="text-gray-400">
                    Regardez votre livreur se diriger vers vous et recevez des notifications à chaque étape
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-red-900/50 to-black">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Vous n'avez pas encore commandé ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Découvrez notre menu et passez votre première commande pour expérimenter notre système de tracking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/menu')}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium"
            >
              Voir le menu
            </Button>
            <Button
              onClick={() => router.push('/about')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-medium bg-[#4e3172]"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
