# Security Model

This document outlines the security architecture and authorization models applied in Rhymance to protect user privacy, prevent abuse, and enforce content boundaries.

---

## 1. Authentication Constraints

All user operations (except for the landing page static view and the Recruiter Demo Mode sandbox) require a valid JSON Web Token (JWT) issued by Firebase Authentication.
* **Token Claims**: User IDs (`request.auth.uid`) must match the resources being edited.
* **Email Verification**: Production database rules will block writes to `profiles` or `poems` until `request.auth.token.email_verified == true`.

---

## 2. Firestore Authorization Rules

The security rules are deployed at `firebase/firestore.rules`. Key constraints are summarized below:

```text
/users/{userId}
  - Read: authenticated AND (request.auth.uid == userId OR request.auth.token.role in ['admin', 'moderator'])
  - Write: authenticated AND request.auth.uid == userId

/profiles/{userId}
  - Read: authenticated
  - Write: authenticated AND request.auth.uid == userId

/poems/{poemId}
  - Read: authenticated AND (resource.data.moderationStatus == 'approved' OR resource.data.authorId == request.auth.uid)
  - Write: authenticated AND request.resource.data.authorId == request.auth.uid

/swipes/{swipeId}
  - Read: Denied (except for Cloud Functions matching engines)
  - Write: authenticated AND request.resource.data.swiperId == request.auth.uid

/matches/{matchId}
  - Read: authenticated AND request.auth.uid in resource.data.users
  - Write: Denied (Write operations are executed only via privileged server transactions)

/conversations/{matchId}
  - Read: authenticated AND request.auth.uid in resource.data.participants
  - Write: authenticated AND request.auth.uid in resource.data.participants

/conversations/{matchId}/messages/{messageId}
  - Read: authenticated AND request.auth.uid in get(/databases/$(database)/documents/conversations/$(matchId)).data.participants
  - Write: authenticated AND request.auth.uid == request.resource.data.senderId
```

---

## 3. Storage Security Rules

The storage bucket rules are deployed at `firebase/storage.rules`. They restrict file types, file sizes, and ownership.

```text
match /users/{userId}/{allPaths=**} {
  // Allow reads if the profile photo is marked as approved
  allow read: if request.auth != null;
  
  // Allow write only by owner, limited to 5MB, and only webp/jpeg/png images
  allow write: if request.auth != null 
    && request.auth.uid == userId
    && request.resource.size < 5 * 1024 * 1024
    && request.resource.contentType.matches('image/(jpeg|png|webp)');
}
```

---

## 4. Blocked User Isolation

When User A blocks User B, the system writes a document to the `/blocks` collection. The database queries and UI layers enforce boundaries using these rules:
* **Discovery Filter**: The recommendation engine queries exclude profiles matching active blocked lists.
* **Security Rules Integration**: A user cannot read another user's profile if there exists a block document between them:
  ```javascript
  function isNotBlocked(userA, userB) {
    return !exists(/databases/$(database)/documents/blocks/$(userA) + '_' + userB)
        && !exists(/databases/$(database)/documents/blocks/$(userB) + '_' + userA);
  }
  ```
  *Note: Checking `exists` queries consumes read operations. For optimization, the local client excludes blocked users inside queries, while security rules use this validation for critical channels like messaging.*

---

## 5. Administrative Access Control

Administrative fields (like `role: 'admin'`) cannot be set by users directly. The `users` collection rules block client updates to the `role` field.
* **Privileged Accounts**: Elevated roles are provisioned using Firebase Admin SDK scripts or Google Cloud Console, and are embedded in the Custom User Claims of the Firebase Auth token.
* **Admin Verification**: Rules verify administrative status using:
  ```javascript
  function isAdmin() {
    return request.auth.token.role == 'admin';
  }
  ```
