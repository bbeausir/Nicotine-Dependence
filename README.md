# Nicotine App

Mobile-first Expo app for nicotine dependence assessment and early-stage quit support. The current MVP helps a user move from landing page to assessment, see a deterministic results profile, and optionally create an account to save progress.

## Current MVP

Implemented today:

- Welcome screen with product framing and assessment entry point
- Multi-step onboarding assessment built with `react-hook-form` and `zod`
- Rules-based scoring for dependence, craving reactivity, regulation confidence, and primary pattern assignment
- Results screen with pattern label, score summary, and next-step guidance
- Supabase email/password auth: sign up, sign in, and forgot password
- Route guards that require auth plus a completed assessment before entering the app shell
- Local persistence for completed assessment sessions via AsyncStorage / SecureStore-backed auth storage
- Basic analytics event stubs for funnel instrumentation in development

Present but still placeholder-level:

- Authenticated tab shell: Home, Social, SOS, Resources, Settings
- Analytics transport
- Syncing assessment data to Supabase
- Full PRD-polished results content and in-app coaching flows

## Product Flow

1. User lands on the welcome screen.
2. User completes the onboarding assessment.
3. The app calculates a rules-based result and shows a results summary.
4. The user can create an account to save progress or sign in if they already have one.
5. Authenticated users are redirected into the tabbed product shell.

If a signed-in user has not completed the assessment, the route guard sends them back to `/onboarding`.

## Tech Stack

- Expo 54
- React Native 0.81
- Expo Router
- TypeScript
- React Hook Form
- Zod
- Supabase JS
- Vitest

## Project Structure

```text
app/
  (welcome)/         landing experience
  (auth)/            sign in, sign up, forgot password
  onboarding/        assessment route
  results.tsx        score summary and CTA
  (app)/(tabs)/      authenticated shell tabs

features/
  auth/              validation helpers
  onboarding/
    components/      assessment UI
    content/         assessment copy
    schema/          question IDs and zod schemas
    scoring/         deterministic scoring + pattern logic

providers/
  AuthProvider.tsx
  AssessmentProvider.tsx

lib/
  supabase/          client + storage adapters
  analytics/         event names + tracking stub

supabase/
  migrations/        database schema migrations
```

## Environment Variables

Supabase auth is optional for local UI work, but required for account flows.

Create a `.env` file in the project root with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Without these values, the app still loads, but auth actions will surface a configuration error.

## Database Schema

The current durable backend model is intentionally small:

- `profiles`: one app-owned profile row per Supabase auth user.
- `onboarding_profiles`: one onboarding assessment snapshot per user.

Onboarding is treated as a setup snapshot, not an ongoing assessment or tracking history. The app still needs repository functions and flow wiring before completed onboarding data syncs to Supabase.

For database work, use the Supabase CLI and create migrations rather than editing the remote database manually:

```bash
npx supabase@latest migration new <descriptive_name>
```

Then apply migrations through the linked Supabase project workflow when the project is configured.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo-compatible iOS simulator, Android emulator, or Expo Go

### Install

```bash
npm install
```

### Run

```bash
npm run start
```

Platform shortcuts:

```bash
npm run ios
npm run android
npm run web
```

## Available Scripts

- `npm run start` starts the Expo dev server
- `npm run ios` launches iOS via Expo
- `npm run android` launches Android via Expo
- `npm run web` launches the web build via Expo
- `npm run typecheck` runs TypeScript without emitting files
- `npm run test` runs the Vitest suite

## Scoring Model

The onboarding flow produces a deterministic assessment result with:

- `dependenceScore`
- `cravingReactivityScore`
- `regulationConfidenceScore`
- `primaryPattern`

Current primary patterns:

- Stress Regulator
- Focus Protector
- Transition Soother
- Social Armor User
- Under-stimulation User
- Habitual User

Scoring and pattern assignment live in `features/onboarding/scoring/` and are intentionally rules-based and testable.

## Testing

The repo includes coverage around:

- auth validation and flows
- route guard behavior
- Supabase client/storage adapters
- onboarding schema and scoring logic

Run:

```bash
npm run test
npm run typecheck
```

## MVP Boundaries

This repository is still in MVP mode. The codebase explicitly avoids speculative platform features and treats the following as next-up work rather than complete product areas:

- post-auth dashboard content
- community/social features
- panic/SOS coping flows
- structured resource library
- account/settings management
- syncing the onboarding profile snapshot to Supabase
- production analytics wiring

## Notes for Contributors

- Keep product scope lean and mobile-first.
- Separate business logic from UI and keep it testable.
- Prefer simple, readable patterns over abstractions.
- Preserve supportive, non-shaming product copy.
