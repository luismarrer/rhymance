import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { Profile, ProfileRepository } from '@rhymance/domain';

export class FirestoreProfileRepository implements ProfileRepository {
  constructor(private db: Firestore) {}

  async getProfile(userId: string): Promise<Profile | null> {
    const d = await getDoc(doc(this.db, 'profiles', userId));
    if (!d.exists()) return null;
    return d.data() as Profile;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const ref = doc(this.db, 'profiles', userId);
    await setDoc(
      ref,
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const updated = await this.getProfile(userId);
    return updated!;
  }

  async createProfile(profile: Profile): Promise<Profile> {
    const ref = doc(this.db, 'profiles', profile.userId);
    await setDoc(ref, {
      ...profile,
      updatedAt: serverTimestamp(),
    });
    return profile;
  }
}
