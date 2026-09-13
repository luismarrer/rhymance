import { Poem, DiscoveryFilters, DiscoveryCard } from '../models';

export interface PoemRepository {
  getDiscoveryQueue(userId: string, filters?: DiscoveryFilters, limitCount?: number): Promise<DiscoveryCard[]>;
  getPoemById(id: string): Promise<Poem | null>;
  createPoem(poem: Omit<Poem, 'id' | 'createdAt'>): Promise<Poem>;
  getUserPoems(authorId: string): Promise<Poem[]>;
}
