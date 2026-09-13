# Testing Guide

This document describes the test suites, local execution steps, and testing standards for Rhymance.

---

## 1. Test Levels

We categorize testing into three distinct layers to ensure high reliability across platforms:

```text
+-------------------------------------------------------------+
| E2E Tests (Playwright / Detox)                             |
| -> Full flow validation from Login to Swipe, Match & Chat  |
+-------------------------------------------------------------+
                            |
                            v
+-------------------------------------------------------------+
| Integration Tests (Firebase Rules Testing SDK)             |
| -> Local Emulator verification of Firestore & Storage rules |
+-------------------------------------------------------------+
                            |
                            v
+-------------------------------------------------------------+
| Unit Tests (Jest / React Native Testing Library)            |
| -> Independent domain rules, utilities, and UI snapshots    |
+-------------------------------------------------------------+
```

---

## 2. Unit Testing

Unit tests cover helpers, UI components, and domain business rules without external side effects.

* **Tools**: Jest, `@testing-library/react-native` (for apps), `@testing-library/react` (for web components).
* **Location**: Tests reside alongside the code they test in files ending with `.test.ts` or `.test.tsx`.
* **Execution**:
  ```bash
  pnpm run test
  # Or run tests in a specific package:
  pnpm --filter @rhymance/domain run test
  ```

---

## 3. Firebase Security Rules Testing

Security rules must be validated against the Local Emulator Suite before deployment.

* **Tools**: `@firebase/rules-unit-testing`, Mocha or Jest.
* **Location**: Tests are placed in `packages/firebase/tests/rules.test.ts`.
* **Execution**:
  1. Boot the emulators in background:
     ```bash
     pnpm --filter firebase run emulate
     ```
  2. Execute rules test suite:
     ```bash
     pnpm --filter @rhymance/firebase run test:rules
     ```

### Example Test Case: Blocked Messaging Restriction
```typescript
it('denies message creation if a recipient has blocked the sender', async () => {
  const db = getTestEnv().authenticatedContext('sender_uid').firestore();
  
  // Set mock block document
  await getTestEnv().withSecurityRulesDisabled(async (context) => {
    await context.firestore().doc('blocks/recipient_uid_sender_uid').set({
      blockerId: 'recipient_uid',
      blockedId: 'sender_uid'
    });
  });

  const messageDoc = db.doc('conversations/match_123/messages/msg_456');
  await assertFails(messageDoc.set({
    senderId: 'sender_uid',
    text: 'Hello!',
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }));
});
```

---

## 4. Critical E2E Test Scenarios

The following 10 flows must be validated before releasing major changes:

1. **Create Account**: Register with email/password, verify client checks.
2. **Complete Onboarding**: Input date of birth, name, location, preferences, verify user document creation.
3. **Create Poetic Profile**: Type a new poem, agree to terms, set profile metadata.
4. **Browse Discovery**: Load card stacks, confirm poems are primary visible elements.
5. **Like Another Profile**: Swipe right on a poem card.
6. **Mutual Match**: Swiping right on a user who already liked you creates a single active match.
7. **Send Message**: Open active match chat, send text messages, verify live updates.
8. **Block User**: Trigger block action, verify instant message block and discovery removal.
9. **Report Content**: File a report for a poem, verify it appears in the admin collection queue.
10. **Delete Account**: Trigger account deletion, verify authentication deletion and subsequent user data purge.
