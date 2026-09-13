import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import {
  Conversation,
  Message,
  ConversationRepository,
} from '@rhymance/domain';

export class FirestoreConversationRepository implements ConversationRepository {
  constructor(private db: Firestore) {}

  async getConversations(userId: string): Promise<Conversation[]> {
    const q = query(
      collection(this.db, 'conversations'),
      where('participants', 'array-contains', userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        matchId: d.id,
        participants: data.participants as [string, string],
        lastMessage: data.lastMessage
          ? {
              text: data.lastMessage.text,
              senderId: data.lastMessage.senderId,
              timestamp: data.lastMessage.timestamp?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            }
          : undefined,
        unreadCount: data.unreadCount || {},
      };
    });
  }

  async getConversationById(matchId: string): Promise<Conversation | null> {
    const d = await getDoc(doc(this.db, 'conversations', matchId));
    if (!d.exists()) return null;
    const data = d.data();
    return {
      matchId: d.id,
      participants: data.participants as [string, string],
      lastMessage: data.lastMessage
        ? {
            text: data.lastMessage.text,
            senderId: data.lastMessage.senderId,
            timestamp: data.lastMessage.timestamp?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          }
        : undefined,
      unreadCount: data.unreadCount || {},
    };
  }

  async getMessages(matchId: string, limitCount: number = 50): Promise<Message[]> {
    const msgsRef = collection(this.db, 'conversations', matchId, 'messages');
    const q = query(msgsRef, orderBy('timestamp', 'asc'), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        senderId: data.senderId,
        text: data.text,
        timestamp: data.timestamp?.toDate?.()?.toISOString?.() || new Date().toISOString(),
        status: data.status || 'sent',
      };
    });
  }

  async sendMessage(
    matchId: string,
    senderId: string,
    text: string
  ): Promise<Message> {
    const msgsRef = collection(this.db, 'conversations', matchId, 'messages');
    const docRef = await addDoc(msgsRef, {
      senderId,
      text,
      status: 'sent',
      timestamp: serverTimestamp(),
    });

    const now = new Date().toISOString();

    // Update conversation lastMessage
    const convRef = doc(this.db, 'conversations', matchId);
    await updateDoc(convRef, {
      lastMessage: {
        text,
        senderId,
        timestamp: serverTimestamp(),
      },
    }).catch(() => {});

    return {
      id: docRef.id,
      senderId,
      text,
      timestamp: now,
      status: 'sent',
    };
  }

  async markConversationAsRead(matchId: string, userId: string): Promise<void> {
    const convRef = doc(this.db, 'conversations', matchId);
    await updateDoc(convRef, {
      [`unreadCount.${userId}`]: 0,
    }).catch(() => {});
  }

  subscribeToMessages(
    matchId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    const msgsRef = collection(this.db, 'conversations', matchId, 'messages');
    const q = query(msgsRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: Message[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          senderId: data.senderId,
          text: data.text,
          timestamp: data.timestamp?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          status: data.status || 'delivered',
        };
      });
      callback(messages);
    });

    return unsubscribe;
  }
}
