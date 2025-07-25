"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Mail, Phone, MapPin, User, Lock, Loader2, AlertCircle, Truck, UserIcon, Car, IdCard } from "lucide-react"
import Link from 'next/link'

// Import conditionnel pour éviter les erreurs d'export statique
let useAuth: any = () => ({
  login: () => Promise.resolve(false),
  register: () => Promise.resolve(false),
  isLoading: false,
  isAuthenticated: false
})

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useAuth = require('@/contexts/AuthContext').useAuth
}

export default function LoginPage() {
  const router = useRouter()
  const { login, register, isLoading, isAuthenticated } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Formulaire de connexion
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    userType: 'client' // client, livreur, admin
  })

  // Formulaire d'inscription
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    userType: 'client',
    // Champs spécifiques aux livreurs
    vehicleType: '',
    licenseNumber: '',
    emergencyContact: ''
  })

  // Rediriger si déjà connecté
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      // Redirection selon le type d'utilisateur
      const userType = localStorage.getItem('userType') || 'client'
      switch (userType) {
        case 'client':
          router.push('/profile')
          break
        case 'livreur':
          router.push('/livreur/dashboard')
          break
        case 'admin':
          router.push('/admin')
          break
        default:
          router.push('/profile')
      }
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!loginForm.email || !loginForm.password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    const success = await login(loginForm.email, loginForm.password, loginForm.userType)
    if (success) {
      setSuccess('Connexion réussie ! Redirection...')
      if (typeof window !== 'undefined') {
        localStorage.setItem('userType', loginForm.userType)
      }
      setTimeout(() => {
        switch (loginForm.userType) {
          case 'client':
            router.push('/profile')
            break
          case 'livreur':
            router.push('/livreur/dashboard')
            break
          case 'admin':
            router.push('/admin')
            break
          default:
            router.push('/profile')
        }
      }, 1000)
    } else {
      setError('Email, mot de passe ou type de compte incorrect')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { name, email, phone, password, confirmPassword, address, userType, vehicleType, licenseNumber, emergencyContact } = registerForm

    if (!name || !email || !phone || !password || !address) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    // Validation spécifique pour les livreurs
    if (userType === 'livreur') {
      if (!vehicleType || !licenseNumber || !emergencyContact) {
        setError('Veuillez remplir tous les champs requis pour les livreurs')
        return
      }
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    const success = await register({
      name,
      email,
      phone,
      password,
      address,
      userType,
      vehicleType,
      licenseNumber,
      emergencyContact
    })
    if (success) {
      setSuccess('Inscription réussie ! Redirection...')
      localStorage.setItem('userType', userType)
      setTimeout(() => {
        switch (userType) {
          case 'client':
            router.push('/profile')
            break
          case 'livreur':
            router.push('/livreur/dashboard')
            break
          default:
            router.push('/profile')
        }
      }, 1000)
    } else {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.')
    }
  }

  const handleDemoLogin = async (type: string) => {
    const demoCredentials = {
      client: { email: 'client@terrano.com', password: 'demo123' },
      livreur: { email: 'livreur@terrano.com', password: 'demo123' },
      admin: { email: 'admin@terrano.com', password: 'admin123' }
    }

    const creds = demoCredentials[type as keyof typeof demoCredentials]
    setLoginForm({
      email: creds.email,
      password: creds.password,
      userType: type
    })

    const success = await login(creds.email, creds.password, type)
    if (success) {
      setSuccess(`Connexion démo ${type} réussie ! Redirection...`)
      localStorage.setItem('userType', type)
      setTimeout(() => {
        switch (type) {
          case 'client':
            router.push('/profile')
            break
          case 'livreur':
            router.push('/livreur/dashboard')
            break
          case 'admin':
            router.push('/admin')
            break
        }
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Terrano-Express</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Bienvenue</h1>
          <p className="text-gray-400">Connectez-vous selon votre profil</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
            <TabsTrigger value="login" className="text-white data-[state=active]:bg-red-500">
              Connexion
            </TabsTrigger>
            <TabsTrigger value="register" className="text-white data-[state=active]:bg-red-500">
              Inscription
            </TabsTrigger>
          </TabsList>

          {/* Messages d'erreur/succès */}
          {error && (
            <Alert className="mt-4 bg-red-900/50 border-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 bg-green-900/50 border-green-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          {/* Onglet Connexion */}
          <TabsContent value="login">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Se connecter</CardTitle>
                <CardDescription className="text-gray-400">
                  Choisissez votre type de compte et connectez-vous
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="userType" className="text-white">Type de compte</Label>
                    <Select value={loginForm.userType} onValueChange={(value) => setLoginForm(prev => ({ ...prev, userType: value }))}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-red-500">
                        <SelectValue placeholder="Sélectionnez votre type de compte" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="client">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            Client
                          </div>
                        </SelectItem>
                        <SelectItem value="livreur">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            Livreur
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <IdCard className="h-4 w-4" />
                            Administrateur
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="votre@email.com"
                        className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-white">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <Separator className="bg-gray-700" />
                  <div className="text-center mt-4 space-y-2">
                    <p className="text-sm text-gray-400 mb-3">Comptes de démonstration :</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleDemoLogin('client')}
                        disabled={isLoading}
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-sm"
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        Demo Client
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDemoLogin('livreur')}
                        disabled={isLoading}
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-sm"
                      >
                        <Car className="mr-2 h-4 w-4" />
                        Demo Livreur
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDemoLogin('admin')}
                        disabled={isLoading}
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-sm"
                      >
                        <IdCard className="mr-2 h-4 w-4" />
                        Demo Admin
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Inscription */}
          <TabsContent value="register">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Créer un compte</CardTitle>
                <CardDescription className="text-gray-400">
                  Rejoignez Terrano Express selon votre profil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="registerUserType" className="text-white">Type de compte</Label>
                    <Select value={registerForm.userType} onValueChange={(value) => setRegisterForm(prev => ({ ...prev, userType: value }))}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-red-500">
                        <SelectValue placeholder="Sélectionnez votre type de compte" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="client">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            Client - Commander des repas
                          </div>
                        </SelectItem>
                        <SelectItem value="livreur">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            Livreur - Effectuer des livraisons
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-white">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Votre nom complet"
                        className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="votre@email.com"
                        className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+225 XX XX XX XX XX"
                        className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-white">Adresse</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="address"
                        value={registerForm.address}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Votre adresse complète"
                        className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Champs spécifiques aux livreurs */}
                  {registerForm.userType === 'livreur' && (
                    <>
                      <div>
                        <Label htmlFor="vehicleType" className="text-white">Type de véhicule</Label>
                        <Select value={registerForm.vehicleType} onValueChange={(value) => setRegisterForm(prev => ({ ...prev, vehicleType: value }))}>
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-red-500">
                            <SelectValue placeholder="Sélectionnez votre véhicule" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="moto">Moto</SelectItem>
                            <SelectItem value="scooter">Scooter</SelectItem>
                            <SelectItem value="voiture">Voiture</SelectItem>
                            <SelectItem value="velo">Vélo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="licenseNumber" className="text-white">Numéro de permis</Label>
                        <div className="relative">
                          <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="licenseNumber"
                            value={registerForm.licenseNumber}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
                            placeholder="Numéro de permis de conduire"
                            className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="emergencyContact" className="text-white">Contact d'urgence</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="emergencyContact"
                            value={registerForm.emergencyContact}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                            placeholder="Numéro d'urgence"
                            className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="register-password" className="text-white">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password" className="text-white">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="••••••••"
                        className="pl-10 bg-gray-800 border-gray-600 text-white focus:border-red-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription...
                      </>
                    ) : (
                      `Créer mon compte ${registerForm.userType}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
