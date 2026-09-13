import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  where,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import {
  Match,
  Swipe,
  MatchRepository,
  SwipeResult,
  createMatchId,
} from '@rhymance/domain';

export class FirestoreMatchRepository implements MatchRepository {
  constructor(private db: Firestore) {}

  async recordSwipe(swipe: Swipe): Promise<SwipeResult> {
    const swipeDocId = `${swipe.swiperId}_${swipe.targetId}`;
    const swipeRef = doc(this.db, 'swipes', swipeDocId);

    await setDoc(swipeRef, {
      swiperId: swipe.swiperId,
      targetId: swipe.targetId,
      type: swipe.type,
      createdAt: serverTimestamp(),
    });

    if (swipe.type !== 'like') {
      return { swipe, isMatch: false };
    }

    // Check for reciprocal like
    const reciprocalId = `${swipe.targetId}_${swipe.swiperId}`;
    const reciprocalDoc = await getDoc(doc(this.db, 'swipes', reciprocalId));

    if (reciprocalDoc.exists() && reciprocalDoc.data().type === 'like') {
      const matchId = createMatchId(swipe.swiperId, swipe.targetId);
      const [first, second] = [swipe.swiperId, swipe.targetId].sort();

      const matchData: Match = {
        id: matchId,
        users: [first, second],
        matchedAt: new Date().toISOString(),
        poemId: `poem_${swipe.targetId}`,
        active: true,
      };

      const matchRef = doc(this.db, 'matches', matchId);
      await setDoc(matchRef, {
        ...matchData,
        matchedAt: serverTimestamp(),
      });

      // Ensure conversation document is created
      const convRef = doc(this.db, 'conversations', matchId);
      await setDoc(
        convRef,
        {
          matchId,
          participants: [first, second],
          unreadCount: {
            [first]: 0,
            [second]: 0,
          },
        },
        { merge: true }
      );

      return {
        swipe,
        isMatch: true,
        match: matchData,
      };
    }

    return { swipe, isMatch: false };
  }

  async getMatches(userId: string): Promise<Match[]> {
    const q = query(
      collection(this.db, 'matches'),
      where('users', 'array-contains', userId),
      where('active', '==', true)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        users: data.users as [string, string],
        matchedAt: data.matchedAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
        poemId: data.poemId,
        active: data.active,
      };
    });
  }

  async getMatchById(matchId: string): Promise<Match | null> {
    const d = await getDoc(doc(this.db, 'matches', matchId));
    if (!d.exists()) return null;
    const data = d.data();
    return {
      id: d.id,
      users: data.users as [string, string],
      matchedAt: data.matchedAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      poemId: data.poemId,
      active: data.active,
    };
  }

  async unmatch(matchId: string): Promise<void> {
    await updateDoc(doc(this.db, 'matches', matchId), {
      active: false,
    });
  }
}
