"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  avatar?: string
  createdAt: string
  favoriteOrders: string[]
  totalOrders: number
  loyaltyPoints: number
  userType: 'client' | 'livreur' | 'admin'
  // Champs spécifiques aux livreurs
  vehicleType?: string
  licenseNumber?: string
  emergencyContact?: string
  rating?: number
  totalDeliveries?: number
  earnings?: number
  isOnline?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, userType?: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
}

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  address: string
  userType: string
  // Champs optionnels pour les livreurs
  vehicleType?: string
  licenseNumber?: string
  emergencyContact?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Initialiser côté client pour éviter l'hydratation
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    if (!isClient) return

    try {
      const savedUser = localStorage.getItem('terrano-user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isClient])

  const login = async (email: string, password: string, userType: string = 'client'): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulation d'une API de connexion
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Données utilisateur fictives selon le type
      let userData: User

      if (userType === 'client') {
        userData = {
          id: 'client_' + Date.now(),
          name: email.includes('client') ? 'Aminata Traoré' : 'Aissata Kone',
          email,
          phone: '+225 07 12 34 56 78',
          address: 'Cocody, Riviera Golf, Villa 25, Abidjan',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c371?w=150&h=150&fit=crop',
          createdAt: '2024-01-15',
          favoriteOrders: ['Spaghetti au Thieboudienne', 'Tiramisu au Bissap', 'Pizza Mafé'],
          totalOrders: 12,
          loyaltyPoints: 450,
          userType: 'client'
        }
      } else if (userType === 'livreur') {
        userData = {
          id: 'livreur_' + Date.now(),
          name: email.includes('livreur') ? 'Moussa Konaté' : 'Sekou Diarra',
          email,
          phone: '+225 05 87 65 43 21',
          address: 'Marcory, Zone 4, Abidjan',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
          createdAt: '2023-06-10',
          favoriteOrders: [],
          totalOrders: 0,
          loyaltyPoints: 0,
          userType: 'livreur',
          vehicleType: 'moto',
          licenseNumber: 'CI123456789',
          emergencyContact: '+225 07 98 76 54 32',
          rating: 4.8,
          totalDeliveries: 127,
          earnings: 45000,
          isOnline: false
        }
      } else if (userType === 'admin') {
        userData = {
          id: 'admin_' + Date.now(),
          name: 'Kwame Asante',
          email,
          phone: '+225 01 23 45 67 89',
          address: 'Plateau, Centre administratif, Abidjan',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
          createdAt: '2023-01-01',
          favoriteOrders: [],
          totalOrders: 0,
          loyaltyPoints: 0,
          userType: 'admin'
        }
      } else {
        return false
      }

      setUser(userData)
      if (isClient) {
        localStorage.setItem('terrano-user', JSON.stringify(userData))
        localStorage.setItem('userType', userType)
      }

      return true
    } catch (error) {
      console.error('Erreur connexion:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulation d'une API d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000))

      const baseUser = {
        id: `${userData.userType}_` + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=ef4444&color=fff&size=150`,
        createdAt: new Date().toISOString(),
        favoriteOrders: [],
        totalOrders: 0,
        userType: userData.userType as 'client' | 'livreur' | 'admin'
      }

      let newUser: User

      if (userData.userType === 'client') {
        newUser = {
          ...baseUser,
          loyaltyPoints: 100 // Points de bienvenue
        }
      } else if (userData.userType === 'livreur') {
        newUser = {
          ...baseUser,
          loyaltyPoints: 0,
          vehicleType: userData.vehicleType,
          licenseNumber: userData.licenseNumber,
          emergencyContact: userData.emergencyContact,
          rating: 5.0,
          totalDeliveries: 0,
          earnings: 0,
          isOnline: false
        }
      } else {
        newUser = {
          ...baseUser,
          loyaltyPoints: 0
        }
      }

      setUser(newUser)
      if (isClient) {
        localStorage.setItem('terrano-user', JSON.stringify(newUser))
        localStorage.setItem('userType', userData.userType)
      }

      return true
    } catch (error) {
      console.error('Erreur inscription:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    if (isClient) {
      localStorage.removeItem('terrano-user')
      localStorage.removeItem('userType')
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    try {
      // Simulation d'une API de mise à jour
      await new Promise(resolve => setTimeout(resolve, 500))

      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)

      if (isClient) {
        localStorage.setItem('terrano-user', JSON.stringify(updatedUser))
      }

      return true
    } catch (error) {
      console.error('Erreur mise à jour profil:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}
