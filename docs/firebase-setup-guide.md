# Firebase Setup Guide

This document describes how to set up and configure the Firebase project for both local development and production environments.

---

## 1. Firebase Console Initialization

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `rhymance-prod` (and optionally `rhymance-dev` for a staging/development backend).
3. Enable **Google Analytics** for the project (recommended for user funnel tracking and A/B testing).
4. Upgrade the project to the **Blaze (Pay-as-you-go)** plan:
   * Navigate to Billing inside the Firebase Console.
   * Click **Upgrade** to move from the Spark plan.
   * *Note: The Blaze plan retains the same free-tier quotas as Spark, but is required for deploying Cloud Functions and using external APIs.*

---

## 2. Authentication Setup

1. In the left-hand navigation, click **Build > Authentication**.
2. Click **Get Started**.
3. Enable the **Email/Password** sign-in method:
   * Turn on both *Email/Password* and *Email link (passwordless sign-in)*.
   * Save changes.
4. (Future work) Enable **Google** and **Apple** sign-in providers inside this console when ready to expand auth options.

---

## 3. Cloud Firestore Setup

1. Navigate to **Build > Firestore Database**.
2. Click **Create Database**.
3. Select a database location closest to your target user base (e.g., `nam5` for North America, `europe-west3` for Europe).
4. Choose **Start in production mode**:
   * *Warning: Never start in test mode for public staging. Starting in production mode sets write/read rules to deny-all, ensuring data is locked until we deploy our specific rule configurations.*
5. Enable the database.

---

## 4. Cloud Storage Setup

1. Navigate to **Build > Storage**.
2. Click **Get Started**.
3. Choose **Start in production mode**.
4. Select the location (matching your Firestore location for low latency).
5. Click **Done**.

---

## 5. App Check Configuration (DDoS & Abuse Prevention)

App Check protects our database and functions from malicious actors by enforcing that only signed instances of our genuine application can make requests.

1. Navigate to **Build > App Check**.
2. Click **Register** for each platform:
   * **iOS**: Register App Check using **DeviceCheck** (requires Apple Developer Team ID and key).
   * **Android**: Register App Check using **Play Integrity** (requires linking Google Play console).
   * **Web**: Register App Check using **reCAPTCHA Enterprise**.
3. Set the token time-to-live (TTL) to 1 hour.
4. Enforce App Check protection on **Firestore**, **Storage**, and **Cloud Functions** by clicking **Enforce** next to each service.

---

## 6. Client Configuration Files

To connect the Astro marketing site and the React Native app, download and insert the configuration files:

### iOS Setup
1. In the project dashboard, click **Add App** and select **iOS**.
2. Provide the Bundle ID: `com.rhymance.app`.
3. Download `GoogleService-Info.plist`.
4. Place it in `apps/app/ios/` and link it inside Xcode (as detailed in the Xcode project configuration guides).

### Android Setup
1. Click **Add App** and select **Android**.
2. Provide the Package Name: `com.rhymance.app`.
3. Download `google-services.json`.
4. Place it in `apps/app/android/app/`.

### Web/Astro Setup
1. Click **Add App** and select **Web**.
2. Register the app and copy the config object.
3. Place these configuration variables inside `apps/app/.env` and `apps/marketing/.env` (matching keys shown in the setup template).

---

## 7. Firebase CLI Deployment

Before running the app, deploy security rules and indexes using the Firebase CLI.

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Authenticate:
   ```bash
   firebase login
   ```
3. Initialize the project mappings:
   ```bash
   firebase use --add
   ```
4. Deploy Rules and Indexes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage:rules
   ```
