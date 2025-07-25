# 🍝 Terrano Express - Livraison de Cuisine Fusion Afro-Italienne

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Application de livraison express de cuisine fusion afro-italienne avec paiement mobile money et suivi en temps réel en Côte d'Ivoire.

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

## 🎨 Captures d'écran

### Page d'accueil
![Page d'accueil Terrano Express](https://via.placeholder.com/800x400/000000/FFFFFF?text=Terrano+Express+Home)

### Menu fusion
![Menu avec plats fusion](https://via.placeholder.com/800x400/ef4444/FFFFFF?text=Menu+Fusion+Afro-Italien)

### Paiement Mobile Money
![Interface paiement mobile](https://via.placeholder.com/800x400/f97316/FFFFFF?text=Paiement+Mobile+Money)

## 🚀 Installation

### Prérequis
- Node.js 18+ ou Bun
- Git

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/terrano-express.git
cd terrano-express
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

## 🎯 Structure du Projet

```
terrano-express/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── admin/             # Interface administrateur
│   │   ├── livreur/           # Dashboard livreur
│   │   ├── profile/           # Profil client
│   │   ├── menu/              # Catalogue des plats
│   │   ├── track/             # Suivi de commandes
│   │   └── login/             # Authentification
│   ├── components/            # Composants réutilisables
│   │   ├── ui/                # Composants shadcn/ui
│   │   ├── payment/           # Paiement mobile money
│   │   └── notifications/     # Système de notifications
│   ├── contexts/              # Contextes React
│   │   ├── AuthContext.tsx    # Authentification
│   │   └── CartContext.tsx    # Panier
│   ├── hooks/                 # Hooks personnalisés
│   ├── lib/                   # Utilitaires et configurations
│   └── types/                 # Types TypeScript
├── public/                    # Fichiers statiques
│   ├── icons/                 # Icônes PWA
│   └── sw.js                  # Service Worker
└── docs/                      # Documentation
```

## 🌍 Déploiement

### Build de production
```bash
bun run build
```

### Export statique
```bash
bun run build
```

### Plateformes supportées
- **Vercel** (recommandé)
- **Netlify**
- **Serveur Node.js**
- **CDN statique**

## 🤝 Contribution

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

Utilisez les [GitHub Issues](https://github.com/votre-username/terrano-express/issues) pour signaler des bugs ou proposer des améliorations.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Équipe

- **Développement** : [Votre Nom](https://github.com/votre-username)
- **Design** : Interface moderne et intuitive
- **Mobile Money** : Intégration complète pour la Côte d'Ivoire

## 🙏 Remerciements

- **Next.js** pour le framework
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants
- **Lucide React** pour les icônes
- **Communauté Open Source** pour l'inspiration

---

⭐ N'hésitez pas à donner une étoile si ce projet vous a plu !

🍝 **Bon appétit avec Terrano Express !**
