export interface User {
  id: string;
  email: string;
  createdAt: string;
  onboardingCompleted: boolean;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'deleted';
  suspendedUntil?: string;
}

export interface Profile {
  userId: string;
  firstName: string;
  dob: string; // YYYY-MM-DD
  genderIdentity: string;
  datingPreferences: string[];
  location: {
    city: string;
    country: string;
  };
  biography: string;
  interests: string[];
  poeticStyles: string[];
  favoriteWriters: string[];
  photos: Array<{
    url: string;
    moderationStatus: 'pending' | 'approved' | 'rejected';
  }>;
  primaryPoemId: string;
  notificationPreferences: {
    push: boolean;
    email: boolean;
  };
  updatedAt: string;
}

export interface Poem {
  id: string;
  authorId: string;
  title: string;
  body: string;
  language: string;
  style: string;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  originalityConfirmed: boolean;
  context?: string;
  createdAt: string;
}

export interface DiscoveryCard {
  poem: Poem;
  author: {
    id: string;
    firstName: string;
    age: number;
    city: string;
    country: string;
    biography: string;
    poeticStyles: string[];
    interests: string[];
    photoUrl?: string;
  };
}

export interface Swipe {
  swiperId: string;
  targetId: string;
  type: 'like' | 'pass';
  createdAt: string;
}

export interface Match {
  id: string;
  users: [string, string];
  matchedAt: string;
  poemId: string;
  active: boolean;
}

export interface Conversation {
  matchId: string;
  participants: [string, string];
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: string;
  };
  unreadCount: {
    [userId: string]: number;
  };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Block {
  blockerId: string;
  blockedId: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  contentType: 'profile' | 'poem' | 'message';
  contentId: string;
  reason: 'harassment' | 'spam' | 'copyright' | 'inappropriate_content';
  explanation?: string;
  timestamp: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  moderatorNotes?: string;
}

export interface DiscoveryFilters {
  language: string;
  genderIdentity?: string;
  minAge?: number;
  maxAge?: number;
}
