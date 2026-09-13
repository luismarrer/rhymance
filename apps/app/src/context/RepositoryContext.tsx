import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createMockRepositories,
  RepositoryBundle,
  User,
  DEMO_USER,
} from '@rhymance/domain';
import {
  createFirebaseRepositories,
  FirebaseConfig,
} from '@rhymance/firebase';

export type BackendMode = 'sandbox' | 'firebase';

interface RepositoryContextValue extends RepositoryBundle {
  currentUser: User | null;
  backendMode: BackendMode;
  firebaseConfigured: boolean;
  switchToFirebase: (customConfig?: Partial<FirebaseConfig>) => boolean;
  switchToSandbox: () => void;
  resetDemoData: () => void;
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null);

const envFirebaseConfig: FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  useEmulators: process.env.EXPO_PUBLIC_USE_EMULATORS === 'true',
};

const hasValidFirebaseEnv = !!(
  envFirebaseConfig.apiKey &&
  envFirebaseConfig.projectId &&
  envFirebaseConfig.apiKey !== 'mock-api-key'
);

export const RepositoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [backendMode, setBackendMode] = useState<BackendMode>('sandbox');
  const [repositories, setRepositories] = useState<RepositoryBundle>(() => createMockRepositories());
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USER);

  useEffect(() => {
    const unsub = repositories.authRepository.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, [repositories]);

  const switchToSandbox = () => {
    const mockBundle = createMockRepositories();
    setRepositories(mockBundle);
    setBackendMode('sandbox');
    setCurrentUser(mockBundle.authRepository.getCurrentUser());
  };

  const switchToFirebase = (customConfig?: Partial<FirebaseConfig>): boolean => {
    const activeConfig: FirebaseConfig = {
      ...envFirebaseConfig,
      ...customConfig,
    };

    if (!activeConfig.apiKey || !activeConfig.projectId) {
      console.warn('[Rhymance] Credenciales de Firebase incompletas. Se mantiene el modo Sandbox.');
      return false;
    }

    try {
      const fbBundle = createFirebaseRepositories(activeConfig);
      setRepositories(fbBundle);
      setBackendMode('firebase');
      setCurrentUser(fbBundle.authRepository.getCurrentUser());
      console.log('[Rhymance] Conectado exitosamente a Firebase');
      return true;
    } catch (err) {
      console.error('[Rhymance] Error inicializando Firebase:', err);
      return false;
    }
  };

  const resetDemoData = () => {
    if (backendMode === 'sandbox') {
      const fresh = createMockRepositories();
      setRepositories(fresh);
      setCurrentUser(fresh.authRepository.getCurrentUser());
    }
  };

  const value: RepositoryContextValue = {
    ...repositories,
    currentUser,
    backendMode,
    firebaseConfigured: hasValidFirebaseEnv,
    switchToFirebase,
    switchToSandbox,
    resetDemoData,
  };

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  );
};

export function useRepositories(): RepositoryContextValue {
  const ctx = useContext(RepositoryContext);
  if (!ctx) {
    throw new Error('useRepositories must be used within a RepositoryProvider');
  }
  return ctx;
}
