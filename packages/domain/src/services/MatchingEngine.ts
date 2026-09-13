import { Match, Swipe } from '../models';

/**
 * Creates canonical alphabetical match document ID between two users
 */
export function createMatchId(userA: string, userB: string): string {
  const [first, second] = [userA, userB].sort();
  return `${first}_${second}`;
}

/**
 * Evaluates whether a swipe produces a mutual match based on recorded swipes
 */
export function evaluateMutualSwipe(
  currentSwipe: Swipe,
  targetSwipes: Swipe[],
  poemId: string
): { isMatch: boolean; match?: Match } {
  if (currentSwipe.type !== 'like') {
    return { isMatch: false };
  }

  // Check if target user has liked current user
  const reciprocalLike = targetSwipes.find(
    s => s.swiperId === currentSwipe.targetId && s.targetId === currentSwipe.swiperId && s.type === 'like'
  );

  if (!reciprocalLike) {
    return { isMatch: false };
  }

  const [first, second] = [currentSwipe.swiperId, currentSwipe.targetId].sort();
  const match: Match = {
    id: `${first}_${second}`,
    users: [first, second],
    matchedAt: new Date().toISOString(),
    poemId,
    active: true,
  };

  return { isMatch: true, match };
}
