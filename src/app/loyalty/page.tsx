"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Users, Calendar } from "lucide-react"

interface Reward {
  id: string
  title: string
  description: string
  points: number
  icon: React.ComponentType<{ className?: string }>
  category: string
  available: boolean
}

interface UserData {
  name: string
  tier: 'bronze' | 'silver' | 'gold'
  points: number
  totalSpent: number
  visits: number
}

const rewards: Reward[] = [
  {
    id: "1",
    title: "Café offert",
    description: "Un espresso italien gratuit",
    points: 100,
    icon: Gift,
    category: "boisson",
    available: true
  },
  {
    id: "2",
    title: "Dessert gratuit",
    description: "Tiramisu ou panna cotta au choix",
    points: 250,
    icon: Gift,
    category: "dessert",
    available: true
  }
]

const userData: UserData = {
  name: "Marco",
  tier: "gold",
  points: 750,
  totalSpent: 450,
  visits: 12
}

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">
          Programme de <span className="text-red-500">Fidélité</span>
        </h1>

        <div className="grid gap-6">
          {rewards.map((reward) => {
            const IconComponent = reward.icon
            return (
              <Card key={reward.id} className="bg-gray-900 border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <IconComponent className="h-8 w-8 text-red-500" />
                    <CardTitle className="text-white">{reward.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{reward.description}</p>
                  <p className="text-red-500 font-bold mt-2">{reward.points} points</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
