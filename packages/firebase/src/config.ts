import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  useEmulators?: boolean;
  emulatorHost?: string;
}

export interface FirebaseServices {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
}

let services: FirebaseServices | null = null;

export function initializeFirebaseServices(config: FirebaseConfig): FirebaseServices {
  if (services) {
    return services;
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  const db = getFirestore(app);
  const auth = getAuth(app);

  if (config.useEmulators) {
    const host = config.emulatorHost || 'localhost';
    try {
      connectFirestoreEmulator(db, host, 8080);
      connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
      console.log(`[Firebase] Emulators connected at ${host}:8080 (firestore), 9099 (auth)`);
    } catch (e) {
      // Ignored if already connected in hot reload
    }
  }

  services = { app, db, auth };
  return services;
}
