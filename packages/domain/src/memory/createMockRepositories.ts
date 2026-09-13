import { Profile } from '../models';
import { InMemoryAuthRepository, DEMO_USER } from './InMemoryAuthRepository';
import { InMemoryPoemRepository } from './InMemoryPoemRepository';
import { InMemoryMatchRepository } from './InMemoryMatchRepository';
import { InMemoryConversationRepository } from './InMemoryConversationRepository';
import { InMemoryProfileRepository } from './InMemoryProfileRepository';
import { AuthRepository } from '../repositories/AuthRepository';
import { PoemRepository } from '../repositories/PoemRepository';
import { MatchRepository } from '../repositories/MatchRepository';
import { ConversationRepository } from '../repositories/ConversationRepository';
import { ProfileRepository } from '../repositories/ProfileRepository';

export interface RepositoryBundle {
  authRepository: AuthRepository;
  poemRepository: PoemRepository;
  matchRepository: MatchRepository;
  conversationRepository: ConversationRepository;
  profileRepository: ProfileRepository;
}

export function createMockRepositories(): RepositoryBundle {
  const authRepository = new InMemoryAuthRepository(DEMO_USER);
  const poemRepository = new InMemoryPoemRepository();
  const matchRepository = new InMemoryMatchRepository();
  const conversationRepository = new InMemoryConversationRepository();
  const profileRepository = new InMemoryProfileRepository();

  // Create demo recruiter profile
  const demoProfile: Profile = {
    userId: DEMO_USER.id,
    firstName: 'Poeta Visitante',
    dob: '2000-01-01',
    genderIdentity: 'No binario',
    datingPreferences: ['Masculino', 'Femenino', 'No binario'],
    location: {
      city: 'Madrid',
      country: 'España',
    },
    biography: 'Explorando almas a través de la poesía en Rhymance. Modo Reclutador / Demo Activo.',
    interests: ['Poesía libre', 'Metáforas', 'Música', 'Café'],
    poeticStyles: ['Verso libre', 'Prosa poética'],
    favoriteWriters: ['Federico García Lorca', 'Pablo Neruda', 'Emily Dickinson'],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=80',
        moderationStatus: 'approved',
      },
    ],
    primaryPoemId: 'poem_demo_user',
    notificationPreferences: {
      push: true,
      email: false,
    },
    updatedAt: new Date().toISOString(),
  };
  profileRepository.createProfile(demoProfile);

  // Pre-configure reciprocal likes for Limary and Álex so swiping on them in Demo mode triggers an instant match!
  matchRepository.addReciprocalLike('poet_limary', DEMO_USER.id);
  matchRepository.addReciprocalLike('poet_alex', DEMO_USER.id);

  // Pre-seed an existing match and conversation with Elena to demonstrate chat functionality
  const elenaMatchId = `poet_elena_${DEMO_USER.id}`;
  matchRepository.addMatch({
    id: elenaMatchId,
    users: ['poet_elena', DEMO_USER.id],
    matchedAt: '2026-04-10T15:00:00Z',
    poemId: 'poem_elena_1',
    active: true,
  });

  conversationRepository.ensureConversation(
    elenaMatchId,
    ['poet_elena', DEMO_USER.id],
    'Tu poema me recordó a los atardeceres de Granada... ¿cuánto tiempo llevas escribiendo versos?'
  );

  return {
    authRepository,
    poemRepository,
    matchRepository,
    conversationRepository,
    profileRepository,
  };
}
