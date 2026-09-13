# Data Model Documentation

This document defines the Cloud Firestore schema, collections, indexing requirements, and document size strategies for Rhymance.

---

## 1. Schema Specifications & Document Limits

Firestore is a document-based NoSQL database. Documents are limited to **1 MB** in size. To prevent scaling issues, we:
* **Avoid Unbounded Arrays**: Arrays that grow with user activity (like a list of blocked user IDs or matches directly inside the user profile) are extracted into independent collections.
* **Denormalize Strategically**: We embed critical fields (e.g., username, age, first poem text) inside reference objects to avoid multiple database lookups.

---

## 2. Collections and Fields

### `users`
*Path: `/users/{userId}`*
*Purpose: Account authentication and administrative state.*

```typescript
interface UserDocument {
  email: string;
  createdAt: Timestamp;
  onboardingCompleted: boolean;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'deleted';
  suspendedUntil?: Timestamp;
}
```

### `profiles`
*Path: `/profiles/{userId}`*
*Purpose: Public user-facing profiles.*

```typescript
interface ProfileDocument {
  firstName: string;
  dob: string;            // Format: YYYY-MM-DD to calculate age dynamically
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
  primaryPoemId: string; // References the currently displayed poem
  notificationPreferences: {
    push: boolean;
    email: boolean;
  };
  updatedAt: Timestamp;
}
```

### `poems`
*Path: `/poems/{poemId}`*
*Purpose: User-written poems.*

```typescript
interface PoemDocument {
  authorId: string;       // References users.userId
  title: string;
  body: string;
  language: string;       // ISO 639-1 (e.g. "es", "en")
  style: string;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  originalityConfirmed: boolean;
  context?: string;       // Short background information
  createdAt: Timestamp;
}
```

### `swipes`
*Path: `/swipes/{swiperId}_{targetId}`*
*Purpose: Tracks swipe actions. Document ID is hashed/formatted as `{swiperId}_{targetId}` to enforce a unique constraints and prevent duplicate swipes.*

```typescript
interface SwipeDocument {
  swiperId: string;       // References users.userId
  targetId: string;       // References users.userId
  type: 'like' | 'pass';
  createdAt: Timestamp;
}
```

### `matches`
*Path: `/matches/{smallerUserId}_{largerUserId}`*
*Purpose: Mutual connections. Document ID uses sorted IDs alphabetically (`{smallerUserId}_{largerUserId}`) to guarantee a single match document between two users.*

```typescript
interface MatchDocument {
  users: [string, string]; // Alphabetically sorted user IDs
  matchedAt: Timestamp;
  poemId: string;          // ID of the poem that triggered the match
  active: boolean;
}
```

### `conversations`
*Path: `/conversations/{matchId}`*
*Purpose: Active chat channel headers.*

```typescript
interface ConversationDocument {
  participants: [string, string];
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  unreadCount: {
    [userId: string]: number; // Map tracks unread count per participant
  };
}
```

### `messages`
*Path: `/conversations/{matchId}/messages/{messageId}`*
*Purpose: Individual text messages inside a conversation. Paginated using cursor tokens.*

```typescript
interface MessageDocument {
  senderId: string;
  text: string;
  timestamp: Timestamp;
  status: 'sent' | 'delivered' | 'read';
}
```

### `blocks`
*Path: `/blocks/{blockerId}_{blockedId}`*
*Purpose: Enforces interpersonal boundaries. Enforced via Document ID `{blockerId}_{blockedId}`.*

```typescript
interface BlockDocument {
  blockerId: string;
  blockedId: string;
  createdAt: Timestamp;
}
```

### `reports`
*Path: `/reports/{reportId}`*
*Purpose: Flagged profiles/content for moderator review.*

```typescript
interface ReportDocument {
  reporterId: string;
  reportedId: string;
  contentType: 'profile' | 'poem' | 'message';
  contentId: string;
  reason: 'harassment' | 'spam' | 'copyright' | 'inappropriate_content';
  explanation?: string;
  timestamp: Timestamp;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  moderatorNotes?: string;
}
```

---

## 3. Required Firestore Query Indexes

Firestore requires composite indexes for queries with multiple filters or inequalities. These are defined inside `firebase/firestore.indexes.json`.

1. **Discovery Recommendations**:
   Querying profiles within dating preference, excluding already swiped accounts:
   * **Collection**: `profiles`
   * **Fields**: `genderIdentity` (Ascending), `datingPreferences` (Array-contains), `updatedAt` (Descending)
2. **Conversation List Sorted**:
   Displaying chat feeds:
   * **Collection**: `conversations`
   * **Fields**: `participants` (Array-contains), `lastMessage.timestamp` (Descending)
3. **Poem Search by Style & Time**:
   Filtering public poems:
   * **Collection**: `poems`
   * **Fields**: `moderationStatus` (Equal), `style` (Equal), `createdAt` (Descending)
4. **Moderator Report Queue**:
   Retrieving unresolved reports:
   * **Collection**: `reports`
   * **Fields**: `status` (Equal), `timestamp` (Ascending)
