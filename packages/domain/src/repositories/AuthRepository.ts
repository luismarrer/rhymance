import { User } from '../models';

export interface AuthRepository {
  getCurrentUser(): User | null;
  signIn(email: string): Promise<User>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
