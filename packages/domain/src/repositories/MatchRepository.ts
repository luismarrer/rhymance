import { Match, Swipe } from '../models';

export interface SwipeResult {
  swipe: Swipe;
  isMatch: boolean;
  match?: Match;
}

export interface MatchRepository {
  recordSwipe(swipe: Swipe): Promise<SwipeResult>;
  getMatches(userId: string): Promise<Match[]>;
  getMatchById(matchId: string): Promise<Match | null>;
  unmatch(matchId: string): Promise<void>;
}
