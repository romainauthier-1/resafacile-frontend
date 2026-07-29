# 🍽️ ResaFacile — Frontend

> **Une interface web pour permettre à vos client.es de réserver dans votre restaurant** — Une application Next.js avec Redux pour gérer les réservations en ligne et en direct de manière intuitive.


[![Next.js](https://img.shields.io/badge/Next.js-12.1.6-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-2.11.2-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lucide React](https://img.shields.io/badge/Lucide_React-1.7.0-3B82F6?style=for-the-badge)](https://lucide.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📜 À propos du projet

**ResaFacile Frontend** est une **application web moderne** développée avec **Next.js** et **React**. Elle offre une expérience utilisateur intuitive pour :

- Inscrire son restaurant
- Permettre aux client.es d'effectuer une réservation en ligne via la page dédiée
- Envoyer des confirmations instantanées
- Recevoir les réservations directement sur le téléphone portable choisi
- Gérer les réservations en direct (cahier de réservation numérique)

L'application est conçue pour être simple, rapide et agréable à utiliser, avec une interface responsive qui s'adapte à tous les appareils.

---

## 🔧 Stack Technique

| Catégorie | Technologie | Version | Rôle |
|----------|-------------|---------|------|
| **Framework** | [Next.js](https://nextjs.org/) | 12.1.6 | Framework React avec SSR |
| **Librairie UI** | [React](https://reactjs.org/) | 18.1.0 | Construction de l'interface |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) | 2.11.2 | Gestion centralisée de l'état |
| **Persistance** | [Redux Persist](https://github.com/rt2zz/redux-persist) | 6.0.0 | Sauvegarde du state dans localStorage |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Framework CSS utility-first |
| **Icons** | [Lucide React](https://lucide.dev/) | 1.7.0 | Bibliothèque d'icônes |
| **Notifications** | [react-toastify](https://fkhadra.github.io/react-toastify/) | 11.0.5 | Notifications toast |
| **Preprocessor** | [PostCSS](https://postcss.org/) | 8.5.6 | Traitement CSS |
| **Autoprefixer** | [Autoprefixer](https://github.com/postcss/autoprefixer) | 10.5.0 | Préfixes vendeurs CSS |
| **Déploiement** | [Vercel](https://vercel.com/) | - | Hébergement optimisé pour Next.js |

---

## ✨ Fonctionnalités

### 🏠 Page d'Accueil

- Liste des restaurants disponibles
- Recherche et filtrage
- Affichage des informations principales
- Navigation vers les détails et réservation

### 📄 Détails des Restaurants

- Informations complètes du restaurant
- Horaires d'ouverture détaillés
- Liste des services proposés

### 📅 Formulaire de Réservation

- Saisies des informations : date, heure, nombre de personnes
- Sélection de l'occasion (anniversaire, professionnel, etc.)
- Validation et confirmation

### 📬 Gestion des Réservations

- Détails de chaque réservation
- Modification possible
- Annulation avec confirmation

### 🎨 Interface Utilisateur

- Design moderne et épuré
- Responsive (mobile, tablette, desktop)
- Animations fluides
- Loading states visuels
- Notifications toast pour le feedback

---

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- [ResaFacile Backend](https://github.com/dankysten/resaFacile-backend) **en cours d'exécution**

### Étapes

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/dankysten/resaFacile-frontend.git
   cd resaFacile-frontend
   ```

2. **Installer les dépendances**
   ```bash
   yarn install
   # ou
   npm install
   ```

3. **Configurer l'environnement**
   Créer un fichier `.env` à la racine avec la variable suivante :
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
   ```

4. **Lancer l'application**
   ```bash
   # Mode développement
   yarn dev
   # ou
   npm run dev
   
   # Mode production
   yarn build && yarn start
   # ou
   npm run build && npm start
   ```

5. **Accéder à l'application**
   ```
   ✓ Compiled successfully
   🔗 Local:   http://localhost:3001
   ```
   L'application sera disponible à l'URL : `http://localhost:3001`

---

## 📁 Structure du Projet

```
resaFacile-frontend/
├── package.json               # Dépendances et scripts
├── next.config.js             # Configuration Next.js
├── tailwind.config.js         # Configuration Tailwind CSS
├── postcss.config.js          # Configuration PostCSS
├── jest.config.js            # Configuration Jest
├── .env                       # Variables d'environnement
├── .gitignore                 # Fichiers ignorés par Git
│
├── pages/
│   ├── _app.jsx              # Configuration Redux & layout global
│   ├── Home.jsx              # Page d'accueil
│   ├── index.jsx             # Page principale avec formulaire
│   ├── ReservationForm.jsx    # Formulaire de réservation complet
│   └── reserver/
│       └── [slug].jsx        # Page de réservation par restaurant
│
├── components/
│   ├── BookingCard.jsx        # Carte de réservation
│   ├── Modal.jsx             # Composant modal
│   ├── StepAccount.jsx       # Étape 1 : Compte
│   ├── StepRestaurant.jsx    # Étape 2 : Restaurant
│   └── StepServices.jsx      # Étape 3 : Services
│
├── reducers/
│   ├── bookingRestaurant.js  # Reducer pour la réservation en cours
│   ├── bookings.js           # Reducer pour les réservations
│   └── connectedRestaurant.js # Reducer pour le restaurant connecté
│
├── styles/
│   └── globals.css           # Styles globaux
│
├── public/                   # Fichiers statiques
│
└── node_modules/             # Dépendances installées
```

---

## 🔌 Configuration Backend

L'application nécessite un backend fonctionnel. Par défaut, elle se connecte à :
```
http://localhost:4000
```

**Pour utiliser un backend déployé :**
1. Lancer le [ResaFacile Backend](../backend/README.md) ou utiliser l'URL déployée
2. Mettre à jour `.env` :
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://resafacile-backend.vercel.app
   ```

---

## 📡 Configuration Next.js

Le fichier `next.config.js` est configuré pour autoriser les images depuis :
- `localhost`
- `memorylane-backend.vercel.app`
- `res.cloudinary.com`

Cela permet à Next.js d'optimiser automatiquement les images provenant de ces sources.

---

## 🎨 Composants Principaux

### 🏠 pages/index.jsx
- Page principale avec le formulaire de connexion / inscription
- Si connecté : affichage du cahier de réservation numérique
- Gestion du flux multi-étapes
- Intégration des reducers

### 📋 ReservationForm.jsx
- Formulaire complet de réservation
- Validation des étapes
- Soumission vers le backend

### 🏪 pages/reserver/[slug].jsx
- Page dédiée à un restaurant spécifique
- Informations détaillées
- Formulaire de réservation client

### 📬 BookingCard.jsx
- Affichage d'une carte de réservation
- Informations client
- Détails de la réservation
- Modifier / supprimer la réservation

---

## 🚀 Déploiement sur Vercel

### Déploiement automatique
1. Pousser le code sur un dépôt GitHub
2. Importer le projet sur [Vercel](https://vercel.com/)
3. Configurer la **Environment Variable** :
   - `NEXT_PUBLIC_BACKEND_URL` = URL de ton backend (ex: `https://resafacile-backend.vercel.app`)
4. Vercel détectera automatiquement Next.js et configurera le déploiement

### Configuration recommandée
- **Node.js Version** : 18+
- **Build Command** : `yarn build` ou `npm run build`
- **Output Directory** : `.next`
- **Development Command** : `yarn dev` ou `npm run dev`

---

## 📝 Exemples d'Utilisation

### Parcourir les restaurants
1. Accéder à `http://localhost:3001`
2. Voir la liste des restaurants disponibles
3. Cliquer sur un restaurant pour voir les détails

### Effectuer une réservation
1. Sélectionner un restaurant
2. Cliquer sur "Réserver"
3. Remplir le formulaire multi-étapes :
   - Informations personnelles
   - Choix du service et horaire
   - Options supplémentaires
4. Confirmer la réservation
5. Recevoir une notification de confirmation par sms

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Ouvrir une issue pour signaler un bug ou proposer une amélioration
- Forker le projet et soumettre une Pull Request

---

## 📜 Licence

Ce projet est sous licence **[MIT](https://opensource.org/licenses/MIT)**.

---

## 👤 Auteur

📌 **Romain Authier**  
📧 [dankysten](https://github.com/dankysten)  
💼 Développeur Fullstack junior (ancien restaurateur)

---

> *"Réserver n'a jamais été aussi facile."* 🍽️✨
