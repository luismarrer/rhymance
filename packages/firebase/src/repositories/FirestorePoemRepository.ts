import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import {
  Poem,
  DiscoveryCard,
  DiscoveryFilters,
  PoemRepository,
  Profile,
  calculateAge,
} from '@rhymance/domain';

export class FirestorePoemRepository implements PoemRepository {
  constructor(private db: Firestore) {}

  async getDiscoveryQueue(
    userId: string,
    filters?: DiscoveryFilters,
    limitCount: number = 15
  ): Promise<DiscoveryCard[]> {
    const poemsRef = collection(this.db, 'poems');
    let q = query(
      poemsRef,
      where('moderationStatus', '==', 'approved'),
      limit(limitCount * 2)
    );

    if (filters?.language) {
      q = query(q, where('language', '==', filters.language));
    }

    const snapshot = await getDocs(q);
    const cards: DiscoveryCard[] = [];

    for (const d of snapshot.docs) {
      const data = d.data();
      const authorId = data.authorId;

      // Filter out user's own poems
      if (authorId === userId) continue;

      const poem: Poem = {
        id: d.id,
        authorId: data.authorId,
        title: data.title,
        body: data.body,
        language: data.language || 'es',
        style: data.style || 'Verso libre',
        moderationStatus: data.moderationStatus || 'approved',
        originalityConfirmed: !!data.originalityConfirmed,
        context: data.context,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      };

      // Fetch author profile
      let authorSummary: DiscoveryCard['author'] = {
        id: authorId,
        firstName: 'Poeta',
        age: 24,
        city: 'España',
        country: 'España',
        biography: 'Amante de la poesía y la literatura.',
        poeticStyles: [poem.style],
        interests: ['Poesía', 'Arte'],
        photoUrl: undefined,
      };

      try {
        const profileDoc = await getDoc(doc(this.db, 'profiles', authorId));
        if (profileDoc.exists()) {
          const prof = profileDoc.data() as Profile;
          authorSummary = {
            id: authorId,
            firstName: prof.firstName || 'Poeta',
            age: calculateAge(prof.dob),
            city: prof.location?.city || 'España',
            country: prof.location?.country || 'España',
            biography: prof.biography || '',
            poeticStyles: prof.poeticStyles || [poem.style],
            interests: prof.interests || [],
            photoUrl: prof.photos?.[0]?.url,
          };
        }
      } catch (err) {
        // Fallback to default author summary
      }

      if (filters?.minAge && authorSummary.age < filters.minAge) continue;
      if (filters?.maxAge && authorSummary.age > filters.maxAge) continue;

      cards.push({ poem, author: authorSummary });

      if (cards.length >= limitCount) break;
    }

    return cards;
  }

  async getPoemById(id: string): Promise<Poem | null> {
    const d = await getDoc(doc(this.db, 'poems', id));
    if (!d.exists()) return null;
    const data = d.data();
    return {
      id: d.id,
      authorId: data.authorId,
      title: data.title,
      body: data.body,
      language: data.language,
      style: data.style,
      moderationStatus: data.moderationStatus,
      originalityConfirmed: data.originalityConfirmed,
      context: data.context,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    };
  }

  async createPoem(poemData: Omit<Poem, 'id' | 'createdAt'>): Promise<Poem> {
    const docRef = await addDoc(collection(this.db, 'poems'), {
      ...poemData,
      createdAt: serverTimestamp(),
    });

    return {
      ...poemData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
  }

  async getUserPoems(authorId: string): Promise<Poem[]> {
    const q = query(
      collection(this.db, 'poems'),
      where('authorId', '==', authorId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        authorId: data.authorId,
        title: data.title,
        body: data.body,
        language: data.language,
        style: data.style,
        moderationStatus: data.moderationStatus,
        originalityConfirmed: data.originalityConfirmed,
        context: data.context,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      };
    });
  }
}
