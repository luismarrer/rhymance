# Google Play Preparation Checklist

This checklist guides the configuration and assets needed to submit the Rhymance Android app to Google Play testing tracks and production.

---

## 1. Google Play Developer Account Configurations

- [ ] **Developer Account**: Active Google Play Console developer account ($25 one-time fee).
- [ ] **Package Name**: Defined as `com.rhymance.app` in Expo config (`app.json`):
  ```json
  "android": {
    "package": "com.rhymance.app"
  }
  ```
- [ ] **Signing Keys (Keystore)**: Google Play App Signing enabled. Expo EAS manages keystores automatically during `eas build --platform android`.

---

## 2. Visual Assets & Media

- [ ] **App Icon**: 512x512 px PNG, high-res.
- [ ] **Feature Graphic**: 1024x500 px JPG or 24-bit PNG (required for Play Store listing).
- [ ] **Splash Screen**: Configured as adaptive icons (`adaptive-icon` configuration in `app.json`).
- [ ] **Screenshots**:
  - [ ] At least two phone screenshots (minimum 320px, maximum 3840px).
  - [ ] 7-inch and 10-inch tablet screenshots (optional, but recommended).

---

## 3. Data Safety Form Requirements

Google Play requires a comprehensive explanation of how user data is collected and processed:

- [ ] **Location Data**: We must state that we collect location data (City/Country) and link it to the user's profile for matching purposes.
- [ ] **Personal Info**: Disclose collections of name, email, date of birth, gender identity, and dating preferences.
- [ ] **Photos**: Declare that optional photos are stored in Cloud Storage.
- [ ] **Security Practices**:
  - [ ] Declare that all data is encrypted in transit (HTTPS/SSL).
  - [ ] State that users can request their data be deleted (supported via the Account Deletion flow).
- [ ] **Data Sharing**: Confirm that we **do not sell** or share user-generated content or personal details with third-party advertisers.

---

## 4. Google Play Policy Compliance

- [ ] **Sensitive Content & Safety**:
  - [ ] In-app reporting and blocking interfaces are present.
  - [ ] Wording regarding minimum age requirement (18 years old) is prominently displayed during signup.
- [ ] **Login Credentials for Review**:
  - [ ] Provide test credentials under "App Access" inside the Console so Google testers can bypass login walls without SMS or OTP issues.
- [ ] **App Check & Play Integrity**: Configure the Google Play Console project keys inside the Firebase App Check panel to enable API request validation on actual devices.
