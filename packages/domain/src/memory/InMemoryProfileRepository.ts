import { Profile } from '../models';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { SEED_POETS } from '../fixtures/seedPoets';

export class InMemoryProfileRepository implements ProfileRepository {
  private profiles: Map<string, Profile> = new Map();

  constructor(initialProfiles?: Profile[]) {
    if (initialProfiles) {
      for (const p of initialProfiles) {
        this.profiles.set(p.userId, p);
      }
    } else {
      for (const poet of SEED_POETS) {
        this.profiles.set(poet.profile.userId, poet.profile);
      }
    }
  }

  async getProfile(userId: string): Promise<Profile | null> {
    return this.profiles.get(userId) || null;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const existing = this.profiles.get(userId);
    if (!existing) {
      throw new Error(`Profile for user ${userId} not found`);
    }

    const updated: Profile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.profiles.set(userId, updated);
    return updated;
  }

  async createProfile(profile: Profile): Promise<Profile> {
    this.profiles.set(profile.userId, profile);
    return profile;
  }
}
