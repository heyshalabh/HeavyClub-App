# HeavyClub

**Train. Track. Repeat.**

A simple, modern workout tracker PWA. Built for college gyms and ready to grow into a community platform.

## Features

- Email/password + Google authentication
- Fast mobile-first workout logger (search or free-text exercises)
- Sets, reps, weight, warm-ups, RPE, notes, rest timer
- Workout history with search
- Progress charts (volume, frequency, exercise progression)
- Automatic PR detection
- Goals & achievements
- Consistency calendar & streaks
- Starter templates (Push / Pull / Legs / Upper / Lower / Full Body)
- Exercise library
- Gym club (join code, challenges, announcements)
- Dark / Light / System themes
- PWA installable, offline draft protection
- Data export (JSON)
- Privacy-first Firebase security rules

## Tech Stack

- React 18 + TypeScript + Vite
- Firebase Auth, Firestore, Storage
- Recharts, Lucide icons, Zustand, date-fns
- vite-plugin-pwa

## Setup

### 1. Install

```bash
cd heavyclub
npm install
```

### 2. Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password + Google
3. Create a **Firestore** database
4. Enable **Storage**
5. Copy config into `.env`:

```bash
cp .env.example .env
# Fill in VITE_FIREBASE_* values
```

6. Deploy security rules:

```bash
# Install Firebase CLI if needed
firebase login
firebase init firestore storage
# Use the included firestore.rules and storage.rules
firebase deploy --only firestore:rules,storage
```

### 3. Firestore Indexes

Create composite indexes when prompted by the console, or add:

- Collection: `users/{uid}/workouts`  
  Fields: `startedAt` Desc

### 4. Run

```bash
npm run dev
```

### 5. Build & Deploy

```bash
npm run build
# Deploy `dist/` to Vercel or Firebase Hosting
```

**Vercel:** connect the repo, set env vars, deploy.

**Firebase Hosting:**

```bash
firebase init hosting
firebase deploy --only hosting
```

## Project Structure

```
src/
  components/   # layout, ui
  pages/        # routes
  services/     # Firebase API
  store/        # Zustand
  lib/          # firebase, exercise seed data
  types/        # TypeScript types
  utils/        # helpers
  styles/       # global CSS
```

## Security

- Users can only read/write their own workouts, goals, PRs, templates
- Public profile data is controlled by `visibility` field
- Club admins cannot access private workout history
- Storage limited to image uploads under the user’s path
- Never commit service account keys; use env vars only

## Branding

© 2026 HeavyClub. All rights reserved.  
Built by Shalabh Suman

---

HeavyClub is free. No premium plans, no fake stats. Train. Track. Repeat.
