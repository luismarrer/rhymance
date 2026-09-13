<p align="center">
  <img src="logo.png" alt="Rhymance Logo" width="180">
</p>

<h1 align="center">💕 Rhymance</h1>

<p align="center">
  <strong>Where Poetry Meets Love</strong><br>
  A dating app that connects people through poetry — swipe verses, not selfies.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-6.0-bc52ee?style=flat-square&logo=astro&logoColor=white" alt="Astro">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.2-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/React%20Native-Expo-0081CB?style=flat-square&logo=react&logoColor=white" alt="React Native">
  <img src="https://img.shields.io/badge/Firebase-BaaS-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase">
</p>

---

## 📖 About & Product Vision

**Rhymance** reimagines online dating by replacing photos with poetry. Instead of judging profiles by appearance, users discover deeper connections through literary sensitivity and shared emotions — swiping on verses instead of selfies.

This repository is transitioning into a **pnpm workspaces monorepo** consisting of:
- **`apps/marketing`**: The Astro-based landing page introducing the product, showcasing its core experience, and driving recruiter engagement.
- **`apps/app`**: The Expo / React Native product application running on Web, iOS, and Android.
- **`packages/`**: Shared configurations, domain layers, UI design systems, and Firebase integrations.

> [!NOTE]
> This application is currently in **Prototype / Active Development** (Alpha). Features described on the marketing page reflect the target cross-platform MVP and are being rolled out systematically in phases.

---

## 📚 Project Documentation

Detailed architecture, database designs, and development guides are located in the `docs/` folder:

### Development & DevOps
* 🛠️ [Local Setup Guide](file:///Users/luis/Dev/rhymance/docs/local-setup-guide.md) — How to configure dependencies, start workspaces, and run the Firebase emulator.
* 🚀 [Deployment Guide](file:///Users/luis/Dev/rhymance/docs/deployment-guide.md) — Steps for deploying the Astro website and publishing Firebase configuration scripts.
* 🧪 [Testing Guide](file:///Users/luis/Dev/rhymance/docs/testing-guide.md) — Unit, integration, and rules testing workflows.

### Architecture & Design
* 🏗️ [Architecture Overview](file:///Users/luis/Dev/rhymance/docs/architecture-overview.md) — Topologies, monorepo structures, and clean coding contracts.
* 🗄️ [Data Model Documentation](file:///Users/luis/Dev/rhymance/docs/data-model-documentation.md) — Firestore collection specifications, documents, and relationships.
* 🔐 [Security Model](file:///Users/luis/Dev/rhymance/docs/security-model.md) — Auth requirements, database/storage security rules, and block integrations.
* 💡 [ADR-001: Select Firebase](file:///Users/luis/Dev/rhymance/docs/decisions/ADR-001-select-firebase-as-primary-backend.md) — Architectural decision record explaining the choice of Firebase over Supabase.

### Store Submission & Compliance
* 🍏 [App Store Preparation Checklist](file:///Users/luis/Dev/rhymance/docs/app-store-preparation-checklist.md) — Asset lists and Apple metadata requirements.
* 🤖 [Google Play Preparation Checklist](file:///Users/luis/Dev/rhymance/docs/google-play-preparation-checklist.md) — Package mappings, adaptive icons, and Data Safety requirements.
* ⚖️ [Privacy & Moderation Documentation](file:///Users/luis/Dev/rhymance/docs/privacy-and-moderation-documentation.md) — User moderation, community rules, blocking systems, and account deletion rules.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Marketing Site** | [Astro](https://astro.build/) | Static site rendering & component architecture |
| **Mobile & Web App** | [Expo](https://expo.dev/) + React Native | Cross-platform runtime for iOS, Android, and Web |
| **App Routing** | Expo Router | Native file-based navigation |
| **Styling** | Tailwind CSS / NativeWind | Modern visual utility framework |
| **Backend Suite** | Firebase | Serverless database, authentication, push messaging, cloud storage, and functions |
| **Monorepo Manager** | `pnpm` workspaces | Fast dependency management and module isolation |

---

## 🚀 Quick Start (Development)

To boot up the local dev environment (Astro landing page, Expo web runtime, and Firebase Local Emulator Suite) running concurrently:

```bash
# Install root dependencies
pnpm install

# Start local services concurrently
pnpm run dev
```

For more detailed setup options, consult the [Local Setup Guide](file:///Users/luis/Dev/rhymance/docs/local-setup-guide.md).

---

## 📁 Repository Target Layout

```text
rhymance/
├── apps/
│   ├── marketing/           # Astro + Tailwind CSS landing website
│   └── app/                 # Expo + React Native application (iOS, Android, Web)
├── packages/
│   ├── domain/              # Business rules, domain models, and interfaces
│   ├── shared/              # Standard utility types and functions
│   ├── ui/                  # Reusable cross-platform design tokens and buttons
│   ├── firebase/            # Shared Firebase client repositories
│   └── config/              # Shared compiler/lint configurations
├── firebase/                # Firestore rules, JSON config, functions logic
├── docs/                    # Architectural decisions and guides
├── pnpm-workspace.yaml      # Monorepo workspaces definition
└── package.json             # Root workspace coordinator
```

---

## 👨‍💻 Author

Crafted with passion by **Luis Marrero** :)
