# Local Setup Guide

This guide describes how to configure the Rhymance monorepo environment for local development.

---

## Prerequisites

Ensure you have the following installed on your machine:
* **Node.js**: Version 20.0.0 or higher.
* **pnpm**: Version 9.0.0 or higher (required for workspaces).
* **Java Development Kit (JDK)**: Version 11 or higher (required to run the Firebase Local Emulator Suite).
* **Expo Go** or **Xcode (for iOS Simulators)** & **Android Studio (for Android Emulators)**.
* **Firebase CLI**: Installed globally or via npx.

---

## 1. Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/luismarrer/rhymance.git
   cd rhymance
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

---

## 2. Configuration & Environments

We configure client and backend settings using environment variables.

### Client Applications (`apps/app`)
Copy the template environment file:
```bash
cp apps/app/.env.example apps/app/.env
```
Fill in the following values (for development, these will connect to the local emulators):
```ini
EXPO_PUBLIC_USE_EMULATORS=true
EXPO_PUBLIC_FIREBASE_API_KEY=mock-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=rhymance-dev.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=rhymance-dev
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=rhymance-dev.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234:web:abcd
```

### Firebase Services (`firebase/`)
To run local functions, navigate to `firebase/functions` and initialize dependencies:
```bash
cd firebase/functions
pnpm install
cp .env.example .env
```

---

## 3. Running the Firebase Emulator Suite

The emulator suite runs Firestore, Auth, Storage, and Cloud Functions locally without writing to production databases.

From the root directory:
```bash
pnpm --filter firebase run emulate
# or navigate to firebase/ and run:
firebase emulators:start --import=./seed --export-on-exit
```

The emulator UI will be available at [http://localhost:4000](http://localhost:4000).

---

## 4. Running the Development Servers

Use the following workspace scripts to run components concurrently or individually:

### Run Marketing Site (Astro)
```bash
pnpm --filter marketing dev
```
Available at [http://localhost:4321](http://localhost:4321).

### Run Mobile App (Expo)
```bash
pnpm --filter app start
```
Options in terminal:
* Press `w` to run in web browser.
* Press `a` to run in Android Emulator.
* Press `i` to run in iOS Simulator.

### Run All Dev Targets Concurrently
```bash
pnpm run dev
```

---

## 5. Troubleshooting

### Java Command Not Found
If the Firebase emulators fail to start with a Java error, check if Java is installed and on your PATH:
```bash
java -version
```
If not, install the JDK from Adoptium (OpenJDK) or your preferred package manager (e.g., `brew install openjdk`).

### Port Conflicts
If you receive a port conflict error (e.g., port 8080 or 9099 already in use), locate the process and terminate it:
```bash
lsof -i :8080
kill -9 <PID>
```
Alternatively, adjust ports inside `firebase/firebase.json`.
