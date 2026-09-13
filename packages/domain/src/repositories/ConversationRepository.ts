import { Conversation, Message } from '../models';

export interface ConversationRepository {
  getConversations(userId: string): Promise<Conversation[]>;
  getConversationById(matchId: string): Promise<Conversation | null>;
  getMessages(matchId: string, limitCount?: number): Promise<Message[]>;
  sendMessage(matchId: string, senderId: string, text: string): Promise<Message>;
  markConversationAsRead(matchId: string, userId: string): Promise<void>;
  subscribeToMessages?(matchId: string, callback: (messages: Message[]) => void): () => void;
}
