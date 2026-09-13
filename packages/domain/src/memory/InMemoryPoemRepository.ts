import { DiscoveryCard, DiscoveryFilters, Poem } from '../models';
import { PoemRepository } from '../repositories/PoemRepository';
import { getSeedDiscoveryCards, SEED_POETS } from '../fixtures/seedPoets';

export class InMemoryPoemRepository implements PoemRepository {
  private poems: Map<string, Poem> = new Map();
  private cards: DiscoveryCard[] = [];

  constructor(initialCards: DiscoveryCard[] = getSeedDiscoveryCards()) {
    this.cards = [...initialCards];
    for (const p of SEED_POETS) {
      this.poems.set(p.poem.id, p.poem);
    }
  }

  async getDiscoveryQueue(
    userId: string,
    filters?: DiscoveryFilters,
    limitCount: number = 10
  ): Promise<DiscoveryCard[]> {
    // Filter out cards from the user themselves
    let result = this.cards.filter(c => c.author.id !== userId);

    if (filters?.language) {
      result = result.filter(c => c.poem.language === filters.language);
    }
    if (filters?.minAge !== undefined) {
      result = result.filter(c => c.author.age >= (filters.minAge as number));
    }
    if (filters?.maxAge !== undefined) {
      result = result.filter(c => c.author.age <= (filters.maxAge as number));
    }

    return result.slice(0, limitCount);
  }

  async getPoemById(id: string): Promise<Poem | null> {
    return this.poems.get(id) || null;
  }

  async createPoem(poemData: Omit<Poem, 'id' | 'createdAt'>): Promise<Poem> {
    const id = `poem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newPoem: Poem = {
      ...poemData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.poems.set(id, newPoem);
    return newPoem;
  }

  async getUserPoems(authorId: string): Promise<Poem[]> {
    return Array.from(this.poems.values()).filter(p => p.authorId === authorId);
  }
}
