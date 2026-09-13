import {
  Auth,
  onAuthStateChanged as fbOnAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  User as FbUser,
} from 'firebase/auth';
import { User, AuthRepository } from '@rhymance/domain';

export class FirebaseAuthRepository implements AuthRepository {
  constructor(private auth: Auth) {}

  private mapUser(fbUser: FbUser | null): User | null {
    if (!fbUser) return null;
    return {
      id: fbUser.uid,
      email: fbUser.email || `poet_${fbUser.uid.slice(0, 6)}@rhymance.app`,
      createdAt: fbUser.metadata?.creationTime || new Date().toISOString(),
      onboardingCompleted: true,
      role: 'user',
      status: 'active',
    };
  }

  getCurrentUser(): User | null {
    return this.mapUser(this.auth.currentUser);
  }

  async signIn(email: string, password?: string): Promise<User> {
    let cred;
    if (password) {
      try {
        cred = await signInWithEmailAndPassword(this.auth, email, password);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          cred = await createUserWithEmailAndPassword(this.auth, email, password);
        } else {
          throw err;
        }
      }
    } else {
      cred = await signInAnonymously(this.auth);
    }

    return this.mapUser(cred.user)!;
  }

  async signOut(): Promise<void> {
    await fbSignOut(this.auth);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const unsubscribe = fbOnAuthStateChanged(this.auth, (fbUser) => {
      callback(this.mapUser(fbUser));
    });
    return unsubscribe;
  }
}
