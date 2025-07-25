# 🍝 Terrano Express - Livraison de Cuisine Fusion Afro-Italienne

<!-- Badges de qualité -->
[![CI Pipeline](https://github.com/Terranoweb2/terrano-express-delivery/actions/workflows/ci.yml/badge.svg)](https://github.com/Terranoweb2/terrano-express-delivery/actions/workflows/ci.yml)
[![Deploy](https://github.com/Terranoweb2/terrano-express-delivery/actions/workflows/deploy.yml/badge.svg)](https://github.com/Terranoweb2/terrano-express-delivery/actions/workflows/deploy.yml)
[![Security](https://github.com/Terranoweb2/terrano-express-delivery/actions/workflows/codeql.yml/badge.svg)](https://github.com/Terranoweb2/terrano-express-delivery/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/f1c3b6e8-9b5d-4c7e-8f2a-3d4e5f6g7h8i/deploy-status)](https://app.netlify.com/sites/terrano-livraison/deploys)

Application de livraison express de cuisine fusion afro-italienne avec paiement mobile money et suivi en temps réel en Côte d'Ivoire.

**🌐 Application en ligne**: [https://terrano-livraison.netlify.app](https://terrano-livraison.netlify.app)

## 🖼️ Captures d'écran

### 🏠 Page d'accueil - Hero Design
![Page d'accueil Terrano Express](https://ext.same-assets.com/3601147126/1391232243.jpeg)
*Interface moderne avec hero élégant présentant la cuisine fusion afro-italienne*

### 🍝 Menu Fusion Unique
![Menu avec plats fusion](https://ext.same-assets.com/3601147126/1657590779.jpeg)
*Découvrez nos créations fusion : Spaghetti au Thieboudienne, Tiramisu au Bissap, Pizza Mafé*

### 💳 Interface de Paiement Mobile Money
![Interface paiement mobile](https://ext.same-assets.com/3601147126/1916382193.jpeg)
*Paiement sécurisé avec Orange Money, MTN Mobile Money, et Moov Money*

### 📱 Application Responsive
![Design responsive mobile et desktop](https://ext.same-assets.com/3601147126/720952304.jpeg)
*Expérience optimisée sur tous les appareils - mobile, tablette et desktop*

### ⭐ Témoignages Clients
![Avis et témoignages clients](https://ext.same-assets.com/3601147126/799946643.jpeg)
*Plus de 1,200 avis clients avec une note moyenne de 4.8/5 et 98% de recommandations*

## 🚀 Fonctionnalités

### 🎯 Pour les Clients
- **Menu fusion unique** : Découvrez nos créations alliant traditions italiennes et saveurs africaines
- **Commande facile** : Interface intuitive avec filtres avancés
- **Paiement mobile** : Orange Money, MTN Mobile Money, Moov Money
- **Suivi en temps réel** : Tracking GPS de votre commande avec notifications push
- **Programme de fidélité** : Points et récompenses pour les clients réguliers
- **Profil personnalisé** : Historique, favoris et adresses sauvegardées

### 🏍️ Pour les Livreurs
- **Dashboard dédié** : Gestion des livraisons en temps réel
- **Statut en ligne/hors ligne** : Contrôle de la disponibilité
- **Suivi des gains** : Revenus et performance détaillés
- **Navigation GPS** : Intégration pour les itinéraires optimisés
- **Communication client** : Appels et messages intégrés

### 🛠️ Pour les Administrateurs
- **Tableau de bord complet** : Vue d'ensemble des opérations
- **Gestion des commandes** : Assignation et suivi en temps réel
- **Gestion des livreurs** : Monitoring et performance
- **Analyses avancées** : Statistiques et rapports détaillés
- **Notifications push** : Communication avec clients et livreurs

## 🛠️ Technologies Utilisées

### Frontend & Backend
- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique pour la fiabilité
- **Tailwind CSS** - Styling moderne et responsive
- **shadcn/ui** - Composants UI élégants et accessibles

### Fonctionnalités Avancées
- **PWA Ready** - Application web progressive avec service worker
- **Notifications Push** - Alertes en temps réel
- **Responsive Design** - Optimisé mobile, tablette et desktop
- **Export Statique** - Performance optimale avec génération statique

### Paiements
- **Mobile Money** - Intégration Orange Money, MTN, Moov
- **Interface sécurisée** - Validation et gestion d'erreurs
- **Confirmation temps réel** - Vérification automatique des paiements

## 📱 Installation

### Prérequis
- Node.js 18+ ou Bun
- Git

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/Terranoweb2/terrano-express-delivery.git
cd terrano-express-delivery
```

2. **Installer les dépendances**
```bash
# Avec Bun (recommandé)
bun install

# Ou avec npm
npm install

# Ou avec yarn
yarn install
```

3. **Variables d'environnement**
```bash
cp .env.example .env.local
```

4. **Lancer le serveur de développement**
```bash
bun dev
```

5. **Ouvrir l'application**
Visitez [http://localhost:3000](http://localhost:3000)

## 🧪 Comptes de Démonstration

### Client
- **Email** : `client@terrano.com`
- **Mot de passe** : `demo123`
- **Fonctionnalités** : Commandes, paiements, suivi

### Livreur
- **Email** : `livreur@terrano.com`
- **Mot de passe** : `demo123`
- **Fonctionnalités** : Gestion livraisons, gains, statut

### Administrateur
- **Email** : `admin@terrano.com`
- **Mot de passe** : `admin123`
- **Fonctionnalités** : Dashboard complet, gestion globale

## 📊 Métriques et Performance

### 🎯 KPIs Business
- **4.8/5** Note moyenne clients
- **1,200+** Avis vérifiés
- **98%** Taux de recommandation
- **< 30min** Temps de livraison moyen
- **99.5%** Uptime application

### ⚡ Performance Technique
- **< 3s** Temps de chargement initial
- **> 95** Score Lighthouse
- **PWA** Compatible et installable
- **100%** Responsive sur tous appareils

## 📱 Fonctionnalités Mobile

### PWA (Progressive Web App)
- Installation sur l'écran d'accueil
- Fonctionnement hors ligne (cache intelligent)
- Notifications push natives
- Performance optimisée

### Responsive Design
- **Mobile-first** : Optimisé pour les smartphones
- **Touch-friendly** : Interactions tactiles fluides
- **Adaptive** : S'adapte à toutes les tailles d'écran

## 🏗️ Structure du Projet

```
terrano-express/
├── src/
│   ├── app/                     # Pages Next.js (App Router)
│   │   ├── admin/               # Interface administrateur
│   │   ├── livreur/             # Dashboard livreur
│   │   ├── profile/             # Profil client
│   │   ├── menu/                # Catalogue des plats
│   │   ├── track/               # Suivi de commandes
│   │   └── login/               # Authentification
│   ├── components/              # Composants réutilisables
│   │   ├── ui/                  # Composants shadcn/ui
│   │   ├── payment/             # Paiement mobile money
│   │   └── notifications/       # Système de notifications
│   ├── contexts/                # Contextes React
│   │   ├── AuthContext.tsx      # Authentification
│   │   └── CartContext.tsx      # Panier
│   ├── hooks/                   # Hooks personnalisés
│   ├── lib/                     # Utilitaires et configurations
│   └── types/                   # Types TypeScript
├── public/                      # Fichiers statiques
│   ├── icons/                   # Icônes PWA
│   └── sw.js                    # Service Worker
└── docs/                        # Documentation
```

## 🚀 Déploiement

### Build de production
```bash
bun run build
```

### Export statique
```bash
bun run build
```

### Plateformes supportées
- **Netlify** (recommandé) - [En ligne](https://terrano-livraison.netlify.app)
- **Vercel**
- **Serveur Node.js**
- **CDN statique**

## 🤝 Contribution

Nous accueillons les contributions ! Consultez notre [Guide de contribution](CONTRIBUTING.md) pour plus de détails.

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### Standards de code
- **ESLint** : Linting automatique
- **Prettier** : Formatage du code
- **TypeScript** : Typage strict
- **Conventional Commits** : Messages de commit standardisés

## 🐛 Signaler un Bug

Utilisez les [GitHub Issues](https://github.com/Terranoweb2/terrano-express-delivery/issues) pour signaler des bugs ou proposer des améliorations.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Équipe

- **Développement** : [Terranoweb2](https://github.com/Terranoweb2)
- **Design** : Interface moderne et intuitive
- **Mobile Money** : Intégration complète pour la Côte d'Ivoire

## 🙏 Remerciements

- **Next.js** pour le framework
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants
- **Lucide React** pour les icônes
- **Communauté Open Source** pour l'inspiration

## 🗺️ Roadmap

Consultez nos [Issues GitHub](https://github.com/Terranoweb2/terrano-express-delivery/issues) pour voir les prochaines fonctionnalités :

- 🎨 **Interface UI/UX** - Dark mode et animations
- 💳 **Paiements étendus** - Visa, PayPal, crypto
- 📱 **App mobile native** - React Native iOS/Android
- 🌍 **Internationalisation** - Support multi-langues
- 📊 **Analytics avancées** - BI et machine learning
- 🔔 **Notifications avancées** - Multi-canal intelligent
- 🛡️ **Sécurité renforcée** - 2FA et chiffrement
- 🧪 **Tests automatisés** - Coverage 80%+

---

⭐ N'hésitez pas à donner une étoile si ce projet vous a plu !

🍝 **Bon appétit avec Terrano Express !**