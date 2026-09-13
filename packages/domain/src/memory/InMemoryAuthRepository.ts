import { User } from '../models';
import { AuthRepository } from '../repositories/AuthRepository';

export const DEMO_USER: User = {
  id: 'user_recruiter',
  email: 'recruiter@rhymance.demo',
  createdAt: '2026-04-01T00:00:00Z',
  onboardingCompleted: true,
  role: 'user',
  status: 'active',
};

export class InMemoryAuthRepository implements AuthRepository {
  private currentUser: User | null;
  private listeners: Set<(user: User | null) => void> = new Set();

  constructor(initialUser: User | null = DEMO_USER) {
    this.currentUser = initialUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async signIn(email: string): Promise<User> {
    const user: User = {
      id: `user_${email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      createdAt: new Date().toISOString(),
      onboardingCompleted: true,
      role: 'user',
      status: 'active',
    };
    this.currentUser = user;
    this.notify();
    return user;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.notify();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }
}
