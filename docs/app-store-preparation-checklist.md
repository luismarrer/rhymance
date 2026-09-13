# App Store Preparation Checklist

This checklist guides the configuration and assets needed to submit the Rhymance iOS app to TestFlight and the Apple App Store.

---

## 1. Apple Developer Account Configurations

- [ ] **Developer Account**: Active Apple Developer Program membership ($99/year).
- [ ] **App Store Connect**: App created in App Store Connect with matching Bundle ID.
- [ ] **Bundle Identifier**: Defined as `com.rhymance.app` in Expo config (`app.json`):
  ```json
  "ios": {
    "bundleIdentifier": "com.rhymance.app"
  }
  ```
- [ ] **Signing Certificates**: Provisioning profiles and distribution certificates set up via Expo EAS CLI (`eas credentials`).

---

## 2. Visual Assets & Media

- [ ] **App Icon**: 1024x1024 px PNG, no transparency.
- [ ] **Splash Screen**: PNG format configured for light and dark modes (avoiding visual artifacts on boot).
- [ ] **Screenshots**:
  - [ ] 6.7-inch iPhone displays (iPhone 15 Pro Max size).
  - [ ] 6.5-inch iPhone displays.
  - [ ] 5.5-inch iPhone displays (older form factor).

---

## 3. Privacy & Permission Strings (`app.json` / Info.plist)

Apple requires descriptive strings explaining *why* permissions are requested. Add these inside `app.json`:

```json
"ios": {
  "infoPlist": {
    "NSCameraUsageDescription": "Rhymance requests camera access to let you capture and upload profile photos once a connection is made.",
    "NSPhotoLibraryUsageDescription": "Rhymance requests library access to select existing images for your profile.",
    "NSUserTrackingUsageDescription": "This identifier will be used to track app crashes, logs, and deliver personalized notifications."
  }
}
```

---

## 4. App Store Review Compliance (UGC Guidelines)

Because Rhymance is a dating app with user-submitted poetry and chat, it is classified under **User Generated Content (UGC)**. To pass review, the application must include:

- [ ] **Terms of Service (EULA)**: A user agreement stating that harassment or offensive content will not be tolerated. Users must agree during onboarding.
- [ ] **Report Action**: A visible button on every profile, poem, and message card to report inappropriate content.
- [ ] **Block Action**: An immediate mechanism to block abusive users. Blocked users must be instantly filtered out of feeds and conversations.
- [ ] **Moderator Panel**: A functioning backend/admin flow where moderators can review reports and suspend offending accounts within 24 hours of notification.
- [ ] **Account Deletion**: A clearly visible "Delete Account" button in the application settings that immediately triggers the deletion of user credentials and database records (complying with Apple's account deletion requirement).

---

## 5. Metadata & Reviewer Account

- [ ] **Reviewer Demo Credentials**: Create a pre-configured test account in Firebase Console (e.g., `reviewer@example.com` / `ReviewerPass123!`) populated with mock profiles, poems, and active chats.
- [ ] **Demo Mode Instruction**: Inform App Store reviewers about the "Recruiter / Reviewer Demo Mode" toggle to let them experience navigation without requiring SMS authentication or external approval.
- [ ] **Privacy Policy Link**: Valid URL pointing to the privacy policy (e.g., `https://rhymance.com/privacy`).
- [ ] **Support Link**: Valid URL pointing to customer support page (`https://rhymance.com/contact`).
