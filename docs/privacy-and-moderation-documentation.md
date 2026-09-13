# Privacy and Moderation Documentation

This document explains the moderation workflow, privacy standards, and safety guidelines for the Rhymance application.

---

## 1. Community Guidelines

Rhymance is built to foster romantic connections through creative expression. To maintain a safe and respectful community, all users must adhere to our rules:
* **Poetry Only**: Profile verses should represent original creative expressions. Copyrighted content, commercial advertisements, and spam are prohibited.
* **No Harassment**: Messages, poems, and profiles must not contain hate speech, threats, harassment, or bullying.
* **Adults Only (18+)**: Users must confirm they are at least 18 years old during the onboarding sequence.
* **No Explicit Media**: While profile photos are optional and initially hidden, any uploaded images must comply with public decency standards (no graphic content or nudity).

---

## 2. Reporting Workflow

When a user flags a poem, profile, or message:

```text
[User Flags Content] 
        │
        ▼
[Create doc under /reports] 
        │
        ▼
[Moderator Dashboard Queue] ──(Within 24 Hours)──► [Investigation]
                                                          │
                    ┌─────────────────────────────────────┴─────────────────────────────────────┐
                    ▼                                                                           ▼
           [Dismiss Report]                                                            [Action Account]
           - Mark: "dismissed"                                                         - Mark: "resolved"
           - Logs archived                                                             - Suspend / Delete user
                                                                                       - Flag poem: "rejected"
```

1. **Submission**: The client generates a document under `/reports` including details about the reporter, the offender, the flagged content ID, and the specific category of abuse.
2. **Review Queue**: The administrator or moderator fetches pending reports sorted by oldest timestamp (`status == 'pending'`).
3. **SLA**: Reports must be investigated and resolved within **24 hours** to comply with App Store UGC mandates.

---

## 3. Blocking Workflow

The blocking mechanic is executed client-side and verified server-side:
* **Immediate Exclusion**: When User A blocks User B, a block record is written (`blocks/userIdA_userIdB`).
* **Client-Side Filtering**: The client app queries filters out any active user IDs listed in the user's local block cache.
* **Message Interception**: Firestore security rules prevent User B from writing messages to any conversation matching User A.
* **Unblocking**: A user can manage their blocked list under settings, allowing them to delete the block document and restore visibility.

---

## 4. User Data Deletion Workflow

To comply with global privacy rules (GDPR, CCPA) and App Store policies, users must have a self-service path to delete their account:
1. **Trigger**: The user clicks "Delete Account" inside Settings.
2. **Authentication Deletion**: The application requests the client SDK to delete the active auth user (`currentUser.delete()`).
3. **Data Deletion Cascade (Cloud Function)**: A background trigger (`auth.user().onDelete`) automatically runs on the server:
   * Deletes the corresponding `/users/{userId}` and `/profiles/{userId}` documents.
   * Deletes all `/poems` authored by the user.
   * Deletes all `/swipes` created by or targeting the user.
   * Marks `/matches` involving the user as inactive.
   * Deletes profile photos from Cloud Storage.
