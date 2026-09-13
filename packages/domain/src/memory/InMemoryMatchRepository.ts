import { Match, Swipe } from '../models';
import { MatchRepository, SwipeResult } from '../repositories/MatchRepository';
import { evaluateMutualSwipe } from '../services/MatchingEngine';

export class InMemoryMatchRepository implements MatchRepository {
  private swipes: Swipe[] = [];
  private matches: Map<string, Match> = new Map();

  constructor(initialSwipes: Swipe[] = []) {
    this.swipes = [...initialSwipes];
  }

  async recordSwipe(swipe: Swipe): Promise<SwipeResult> {
    this.swipes.push(swipe);

    if (swipe.type !== 'like') {
      return { swipe, isMatch: false };
    }

    // Evaluate mutual match using domain MatchingEngine
    // Check if target poet has reciprocal like
    const evaluation = evaluateMutualSwipe(
      swipe,
      this.swipes,
      `poem_${swipe.targetId}`
    );

    if (evaluation.isMatch && evaluation.match) {
      this.matches.set(evaluation.match.id, evaluation.match);
      return {
        swipe,
        isMatch: true,
        match: evaluation.match,
      };
    }

    return { swipe, isMatch: false };
  }

  async getMatches(userId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      m => m.active && (m.users[0] === userId || m.users[1] === userId)
    );
  }

  async getMatchById(matchId: string): Promise<Match | null> {
    return this.matches.get(matchId) || null;
  }

  async unmatch(matchId: string): Promise<void> {
    const existing = this.matches.get(matchId);
    if (existing) {
      this.matches.set(matchId, { ...existing, active: false });
    }
  }

  // Helper for tests/demo to inject a reciprocal like from another poet
  addReciprocalLike(swiperId: string, targetId: string) {
    this.swipes.push({
      swiperId,
      targetId,
      type: 'like',
      createdAt: new Date().toISOString(),
    });
  }

  // Helper to directly inject a match
  addMatch(match: Match) {
    this.matches.set(match.id, match);
  }
}
