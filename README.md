# 🍽️ RésaFacile — Frontend

Outil de réservation en ligne pour restaurants : chaque établissement dispose d'une page de réservation publique et d'un cahier de réservations numérique pour gérer son service au quotidien.

**Démo :** [resafacile.vercel.app](https://resafacile.vercel.app) · **API :** [resafacile-backend](https://github.com/romainauthier-1/resafacile-backend)

![Next.js](https://img.shields.io/badge/Next.js-12-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white)

---

## Fonctionnalités

**Côté restaurant**

- **Inscription en trois étapes** : compte, établissement, services. Les informations de l'établissement (raison sociale, adresse) sont pré-remplies à partir du **numéro SIRET** via l'API SIRENE de l'INSEE.
- **Cahier de réservations** : vue par semaine, réservations regroupées par jour avec le nombre de réservations et de couverts.
- **Gestion des réservations** : prise de réservation (téléphone, sur place), modification, annulation.
- **Gestion des services** : fermeture ou réouverture d'un service à une date précise (jour férié, privatisation…).

**Côté client**

- **Page de réservation publique** par restaurant (`/reserver/<slug>`) : date, heure, nombre de couverts, occasion.
- **Confirmation par SMS** au client et notification par SMS au restaurant (envoi optionnel, via l'API).
- Les créneaux sont contrôlés côté API : jours d'ouverture, horaires des services, fermetures exceptionnelles et dates passées.

## Stack technique

| Domaine     | Choix                                              |
| ----------- | -------------------------------------------------- |
| Framework   | Next.js 12 (Pages Router), React 18                |
| État        | Redux Toolkit + redux-persist (localStorage)       |
| Style       | Tailwind CSS 3, Lucide icons                       |
| Feedback    | react-toastify                                     |
| Déploiement | Vercel                                             |

## Installation

Prérequis : Node.js 18+, [corepack](https://nodejs.org/api/corepack.html) (fourni avec Node, active la bonne version de Yarn), et l'[API RésaFacile](https://github.com/romainauthier-1/resafacile-backend) lancée en local (ou l'URL déployée).

```bash
git clone https://github.com/romainauthier-1/resafacile-frontend.git
cd resafacile-frontend
corepack enable
yarn install
cp .env.example .env    # renseigner NEXT_PUBLIC_BACKEND_URL
yarn dev                # http://localhost:3001
```

| Variable                  | Rôle                                         |
| ------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_BACKEND_URL` | URL de l'API (ex. `http://localhost:4000`)   |

## Structure

```
pages/
  index.jsx               cahier de réservations (espace restaurant)
  reserver/[slug]/        page de réservation publique
  ReservationForm.jsx     formulaire de réservation (création / modification)
components/
  Modal.jsx               connexion et inscription du restaurant
  StepAccount / StepRestaurant / StepServices   étapes de l'inscription
  BookingCard.jsx         carte d'une réservation
reducers/                 restaurant connecté, réservations, restaurant réservé
```

---

Romain Authier — [GitHub](https://github.com/romainauthier-1)
