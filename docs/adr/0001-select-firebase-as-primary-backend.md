# ADR-001 — Select Firebase as the Primary Backend

* **Status**: Accepted
* **Date**: 2026-07-14
* **Deciders**: Engineering Team
* **Project**: Rhymance

---

## Context

Rhymance is a cross-platform dating application centered around the concept: *"Swipe verses, not selfies."* Users discover potential connections by reading their poetry and interacting with verses before their photos are revealed. 

The application is structured as a monorepo using `pnpm` workspaces:

```text
apps/
  ├── marketing (Astro)
  └── app (Expo)
packages/
  ├── shared
  ├── domain
  ├── ui
  └── firebase
backend/
  └── Firebase (Cloud Functions, Security Rules, Config)
```

The system must satisfy the following architectural requirements:
1. **Portfolio Reliability (Always-On)**: The project is a key portfolio piece and an early-stage product. It must remain responsive 100% of the time. If a recruiter or early adopter opens the app after months of inactivity, the backend must not be in a "paused" or "sleeping" state that requires minutes to wake up.
2. **Mobile-First Infrastructure**: The core experience is a React Native client requiring robust push notifications, user authentication, live databases, media storage, crash reporting, and analytics. Integrating these disjointed services manually introduces significant overhead.
3. **Cross-Platform Delivery**: A single, unified backend must serve the Expo-based mobile app (iOS and Android), the web version, and marketing site integrations without maintaining separate API gateways.
4. **Cost Efficiency**: Minimizing fixed monthly operating costs during the early portfolio phase is critical. We must avoid flat monthly subscriptions for inactive or low-traffic environments while retaining the capacity to scale seamlessly.

---

## Decision

We will use **Firebase** as the primary backend platform for the Rhymance application, utilizing its suite of managed services:
* **Firebase Authentication**: For user sign-up, sign-in, and session management.
* **Cloud Firestore**: As the primary database for real-time messaging, user profiles, matches, and poetry data.
* **Cloud Storage for Firebase**: For hosting user images (once unlocked) and media assets.
* **Firebase Cloud Messaging (FCM)**: For pushing real-time notifications to mobile devices.
* **Cloud Functions for Firebase**: For server-side business logic, matchmaking computations, and integration endpoints.
* **Firebase App Check, Analytics, & Crashlytics**: For security, system monitoring, and crash reporting.

We will configure the Firebase project on the **Blaze (pay-as-you-go)** pricing plan to leverage the generous free tier limits during development, ensuring we pay strictly for actual usage.

---

## Alternatives Considered

We evaluated several database and Backend-as-a-Service (BaaS) alternatives:

### 1. Supabase
* **Overview**: An open-source Firebase alternative built on PostgreSQL.
* **Why Rejected**: Supabase is a high-quality platform, but its free-tier databases automatically pause (go to sleep) after a period of developer or user inactivity (typically 1 to 7 days). Waking up a paused database takes several minutes. In a recruiter-focused portfolio context, having a recruiter encounter a "Database Paused" error or a long delay is an unacceptable user experience. While paid tiers ($25/month) avoid this behavior, it violates our requirement for zero or near-zero maintenance costs during the pre-launch phase.

### 2. Neon (Serverless Postgres)
* **Overview**: A serverless, scale-to-zero PostgreSQL database with database branching.
* **Why Rejected**: Neon is excellent for relational workloads, but it is strictly a database provider. To build a mobile-first app, we would have to construct, host, and maintain a separate API gateway (e.g., Express or Go on a cloud runner) and manually integrate separate authentication, storage, and push notification providers. This increases development complexity, maintenance surface area, and the likelihood of incurring fixed hosting costs. Additionally, Neon's free tier has project-suspension behaviors similar to Supabase.

### 3. Self-Hosted PostgreSQL (e.g., VPS / Docker)
* **Overview**: Running a PostgreSQL instance alongside a custom API server on a Virtual Private Server (VPS).
* **Why Rejected**: This introduces ongoing fixed monthly VPS costs and substantial administrative overhead (operating system updates, database backups, SSL certification renewal, connection pool tuning, and manual scaling). It also lacks native mobile integration libraries for push notifications, auth, and analytics, requiring significant boilerplate code.

### 4. PocketBase
* **Overview**: An open-source, single-file Go/SQLite backend.
* **Why Rejected**: PocketBase is lightweight and easy to run, but it must be hosted on a persistent VM, incurring fixed monthly costs. It operates as a single-instance database, making horizontal scaling and high availability complex. It also lacks a mature native ecosystem for mobile crash reporting, deep analytics, and push notifications.

### 5. Appwrite
* **Overview**: An open-source Backend-as-a-Service that can be self-hosted or run via Appwrite Cloud.
* **Why Rejected**: Appwrite is a strong BaaS candidate, but its developer ecosystem, community-backed React Native SDKs, and deep integrations with analytics and crash reporting are less mature than Firebase. Firebase's SDKs are the industry standard for React Native and Expo, which minimizes integration risks.

---

## Consequences

### Benefits
* **Instant Availability (Always-On)**: Cloud Firestore and Firebase Auth do not sleep or pause when inactive. Database read/write targets remain active 24/7, guaranteeing that recruiters or users always encounter a fully functional application instantly.
* **Unified Mobile SDK**: Expo/React Native apps can leverage standard Firebase modules (`@react-native-firebase` or the JS SDK) to handle authentication, file uploads, remote config, and crashlytics with minimal glue code.
* **Industry-Standard Push Notifications**: Firebase Cloud Messaging (FCM) is natively supported by Expo and represents the standard path for delivering push notifications to both iOS and Android.
* **Zero Cost Development (Blaze Plan Free Tier)**: Firebase's free tier quotas (e.g., 50,000 reads/day, 20,000 writes/day, 10 GB hosting, 125,000 Cloud Function invocations/month) allow development and portfolio demonstrations to remain entirely free of charge, with a seamless pay-as-you-go path for future scaling.
* **Native Offline Synchronization**: Firestore provides built-in client cache synchronization, ensuring the mobile application functions gracefully during intermittent network connectivity without custom syncing code.

### Drawbacks & Risks
* **Vendor Lock-in**: The application becomes tightly coupled to Google's infrastructure, proprietary database APIs (Firestore), and Firebase-specific authentication workflows.
* **NoSQL Query Limitations**: Firestore is a document-oriented database. It does not support SQL-style joins, aggregate operations (e.g., native average, sum), or advanced full-text search. Queries are restricted to single-collection filters unless using collection groups, and complex queries require manual index creation.
* **Financial Escalation Risk**: The Blaze plan has no hard ceiling on costs by default. A recursive read/write loop in client code or a Distributed Denial of Service (DDoS) attack could theoretically generate massive execution volumes and unexpected costs.
* **Cold Starts**: Cloud Functions (particularly Node.js runtimes) suffer from cold start latency (1-3 seconds) on initial execution after a period of inactivity.
* **Security Rules Complexity**: Direct client-to-database access relies entirely on Firestore Security Rules. Poorly designed security rules can expose the database to unauthorized read/write operations.

---

## Mitigations

To address the drawbacks and risks of selecting Firebase, the Rhymance architecture will enforce the following engineering patterns:

### 1. Repository Abstraction and Clean Architecture
To mitigate vendor lock-in, the monorepo will enforce a strict separation between business logic and the data-access layer.
* **Domain Layer (`packages/domain`)**: Contains core entities (e.g., `User`, `Verse`, `Match`) and repository interfaces (e.g., `UserRepository`, `MatchRepository`). No Firebase SDKs or types may be imported here.
* **Firebase Implementation Layer (`packages/firebase`)**: Implements the repository interfaces defined in the domain layer using Firestore and Firebase Auth SDKs.
* **Client App (`apps/app`)**: References only the interfaces in the domain layer, using dependency injection (DI) to supply the Firebase implementations. 

If the backend needs to be replaced (e.g., migrating to Supabase or a custom SQL server), the domain layer and client UI remain untouched. We would only need to write a new implementation package (e.g., `packages/supabase`) and swap the injected dependency.

### 2. NoSQL Query & Schema Management
* **Denormalization**: Data will be strategically denormalized to facilitate single-document reads (e.g., embedding basic profile fields directly inside match or chat documents to avoid joins).
* **Asynchronous Indexing**: Heavy relational updates and matchmaking matching queues will be computed asynchronously using Cloud Functions, updating flat documents for quick client retrieval.
* **Explicit Index Planning**: Complex queries will be pre-analyzed, and composite indexes will be versioned and deployed via Firebase CLI config files (`firestore.indexes.json`).

### 3. Financial & DDoS Protection
* **Google Cloud Budget Alerts**: We will configure programmatic billing alerts in the Google Cloud Console to send email alerts at $5.00, $10.00, and $50.00 thresholds.
* **Cloud Function Scaling Limits**: We will enforce a `maxInstances` setting (capped at 5 to 10 instances) for all deployed Cloud Functions to prevent runaway auto-scaling in the event of client-side loops or malicious attacks.
* **Firebase App Check**: We will implement Firebase App Check using Device Check (iOS), Play Integrity (Android), and reCAPTCHA Enterprise (Web) to block unauthorized clients from calling our database and functions.

### 4. Database Security Enforcement
* **Deny-by-Default Policy**: All Firestore security rules will default to blocking access. Permissions will be whitelisted incrementally.
* **Rules Unit Testing**: We will maintain a test suite in `packages/firebase` using `@firebase/rules-unit-testing` and the local emulator suite. These tests must validate that users can only read/write their own data and matches before changes are deployed.

---

## Future Work

1. **Setup Firebase Local Emulator**: Integrate the Firebase emulator suite into the local `pnpm dev` workflow, enabling offline development and testing of Security Rules and Cloud Functions.
2. **Implement App Check and Budget Alerts**: Deploy basic budget alerts and App Check configurations in the Google Cloud Console prior to public staging.
3. **Repository Interface Definitions**: Define the initial matching and messaging repository interfaces in `packages/domain` to establish the contract for the React Native app.
