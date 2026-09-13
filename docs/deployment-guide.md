# Deployment Guide

This document describes how to deploy the Rhymance applications and backend services to staging and production environments.

---

## 1. Web Hosting Deployments

### Astro Marketing Website (`apps/marketing`)
The marketing website is deployed to **Vercel** as a static site.

1. Connect the GitHub repository to your Vercel Dashboard.
2. Select the root directory as the project target.
3. Configure the build parameters:
   * **Framework Preset**: Astro
   * **Root Directory**: `apps/marketing` (or specify via workspace config)
   * **Build Command**: `pnpm run build`
   * **Output Directory**: `dist`
4. Set the environment variables:
   * `PUBLIC_FIREBASE_API_KEY`: production Firebase key.
   * `PUBLIC_FIREBASE_PROJECT_ID`: `rhymance-prod`.
5. Deploy. Every commit to the `main` branch will trigger an automatic preview or production deployment.

### Expo Web Application (`apps/app`)
The web build of the product app can be compiled to a static bundle and deployed to Vercel, Netlify, or Firebase Hosting.

1. Build the production web bundle inside `apps/app`:
   ```bash
   pnpm --filter app exec expo export --platform web
   ```
2. The output will be placed in `apps/app/dist/`.
3. Deploy this directory to your web hosting provider.

---

## 2. Deploying Firebase Services

All Firebase configurations reside inside the `/firebase` directory of the monorepo.

### Step 1: Login & Select Target Project
```bash
cd firebase
firebase login
firebase use production # Mapped to your production project ID
```

### Step 2: Deploy Database Security Rules and Indexes
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### Step 3: Deploy Storage Rules
```bash
firebase deploy --only storage:rules
```

### Step 4: Deploy Cloud Functions
Ensure you have installed all node packages and compiled TypeScript files inside the functions folder:
```bash
cd functions
pnpm install
pnpm run build
cd ..
firebase deploy --only functions
```

---

## 3. CI/CD Automated Pipelines

We use **GitHub Actions** to automate builds and validations. The workflow configuration is stored in `.github/workflows/deploy.yml`.

The pipeline executes the following checks on every Pull Request or push to `main`:
1. Check formatting and lints (`pnpm run lint`).
2. Run database security rules tests inside the local emulator environment.
3. Validate that the Astro and Expo applications build without compilation errors.
4. Auto-deploy rules to Firebase on successful merges to `main` (using `FirebaseExtended/action-hosting-deploy` or custom scripts with `FIREBASE_CLI_TOKEN`).
