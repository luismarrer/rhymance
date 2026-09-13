import { Profile } from '../models';

export interface ProfileRepository {
  getProfile(userId: string): Promise<Profile | null>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile>;
  createProfile(profile: Profile): Promise<Profile>;
}
