import { Conversation, Message } from '../models';
import { ConversationRepository } from '../repositories/ConversationRepository';

export class InMemoryConversationRepository implements ConversationRepository {
  private conversations: Map<string, Conversation> = new Map();
  private messagesByMatch: Map<string, Message[]> = new Map();
  private listeners: Map<string, Set<(messages: Message[]) => void>> = new Map();

  constructor(
    initialConversations: Conversation[] = [],
    initialMessages: Record<string, Message[]> = {}
  ) {
    for (const c of initialConversations) {
      this.conversations.set(c.matchId, c);
    }
    for (const [matchId, msgs] of Object.entries(initialMessages)) {
      this.messagesByMatch.set(matchId, [...msgs]);
    }
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(c => c.participants.includes(userId as any))
      .sort((a, b) => {
        const timeA = a.lastMessage?.timestamp || '';
        const timeB = b.lastMessage?.timestamp || '';
        return timeB.localeCompare(timeA);
      });
  }

  async getConversationById(matchId: string): Promise<Conversation | null> {
    return this.conversations.get(matchId) || null;
  }

  async getMessages(matchId: string, limitCount: number = 50): Promise<Message[]> {
    const list = this.messagesByMatch.get(matchId) || [];
    return list.slice(-limitCount);
  }

  async sendMessage(matchId: string, senderId: string, text: string): Promise<Message> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const newMessage: Message = {
      id: messageId,
      senderId,
      text,
      timestamp: now,
      status: 'sent',
    };

    const currentList = this.messagesByMatch.get(matchId) || [];
    currentList.push(newMessage);
    this.messagesByMatch.set(matchId, currentList);

    // Update conversation metadata
    let conversation = this.conversations.get(matchId);
    if (!conversation) {
      conversation = {
        matchId,
        participants: [senderId, 'target_user'],
        unreadCount: {},
      };
    }

    const otherParticipant = conversation.participants.find(p => p !== senderId) || '';
    const updatedUnread = { ...conversation.unreadCount };
    if (otherParticipant) {
      updatedUnread[otherParticipant] = (updatedUnread[otherParticipant] || 0) + 1;
    }

    this.conversations.set(matchId, {
      ...conversation,
      lastMessage: {
        text,
        senderId,
        timestamp: now,
      },
      unreadCount: updatedUnread,
    });

    // Notify listeners
    const subs = this.listeners.get(matchId);
    if (subs) {
      const msgs = [...currentList];
      subs.forEach(cb => cb(msgs));
    }

    return newMessage;
  }

  async markConversationAsRead(matchId: string, userId: string): Promise<void> {
    const conversation = this.conversations.get(matchId);
    if (conversation && conversation.unreadCount[userId]) {
      this.conversations.set(matchId, {
        ...conversation,
        unreadCount: {
          ...conversation.unreadCount,
          [userId]: 0,
        },
      });
    }
  }

  subscribeToMessages(matchId: string, callback: (messages: Message[]) => void): () => void {
    if (!this.listeners.has(matchId)) {
      this.listeners.set(matchId, new Set());
    }
    const matchListeners = this.listeners.get(matchId)!;
    matchListeners.add(callback);

    // Initial emit
    callback(this.messagesByMatch.get(matchId) || []);

    return () => {
      matchListeners.delete(callback);
    };
  }

  // Helper to ensure a conversation exists for a newly created match
  ensureConversation(matchId: string, participants: [string, string], initialText?: string) {
    if (!this.conversations.has(matchId)) {
      const now = new Date().toISOString();
      const conversation: Conversation = {
        matchId,
        participants,
        unreadCount: {
          [participants[0]]: 0,
          [participants[1]]: 0,
        },
        ...(initialText
          ? {
              lastMessage: {
                text: initialText,
                senderId: participants[1],
                timestamp: now,
              },
            }
          : {}),
      };
      this.conversations.set(matchId, conversation);

      if (initialText) {
        this.messagesByMatch.set(matchId, [
          {
            id: `msg_seed_${matchId}`,
            senderId: participants[1],
            text: initialText,
            timestamp: now,
            status: 'delivered',
          },
        ]);
      }
    }
  }
}
