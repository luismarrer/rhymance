import { RepositoryBundle } from '@rhymance/domain';
import { FirebaseConfig, initializeFirebaseServices } from './config';
import { FirestorePoemRepository } from './repositories/FirestorePoemRepository';
import { FirestoreMatchRepository } from './repositories/FirestoreMatchRepository';
import { FirestoreConversationRepository } from './repositories/FirestoreConversationRepository';
import { FirestoreProfileRepository } from './repositories/FirestoreProfileRepository';
import { FirebaseAuthRepository } from './repositories/FirebaseAuthRepository';

export function createFirebaseRepositories(config: FirebaseConfig): RepositoryBundle {
  const { db, auth } = initializeFirebaseServices(config);

  return {
    authRepository: new FirebaseAuthRepository(auth),
    poemRepository: new FirestorePoemRepository(db),
    matchRepository: new FirestoreMatchRepository(db),
    conversationRepository: new FirestoreConversationRepository(db),
    profileRepository: new FirestoreProfileRepository(db),
  };
}
