# Agent Rules

These rules apply to all agent work in this codebase.

## Project Rules

- Lean MVP only. Do not add speculative features.
- Prefer simple React/Next patterns over clever abstractions.
- Optimize for readability by future human developers.
- Mobile-first layouts only.
- Use encouraging, non-shaming copy.
- Any business logic must be separated from UI and testable.
- Flag anything that seems like overbuilding before implementing it.
- Only build from scratch if you have specialized UX needs or operate in highly constrained environments where you cannot use external services.
- Update README.md with new processes, features, tech stack, or notes for other developers. Update Agent Notes (string) below with helpful notes to agents

## Agent Notes

- Database migrations live in `supabase/migrations`. Current durable backend scope is `profiles` plus one `onboarding_profiles` snapshot per user; onboarding is not intended to become ongoing tracking history.
- `profiles` rows are auto-created by the `on_auth_user_created` trigger. Do not assume callers must create them, but safely call `ensureProfile` as an idempotent fallback for legacy users.
- App code must not call `supabase.from(...)` directly. Data access goes through `lib/repositories/*`. Each function takes the Supabase client as an argument (for testability) and returns `{ data, error }`-shaped results; no UI/analytics side effects inside repositories.
- After any migration, regenerate `lib/supabase/database.types.ts` via `npm run db:types` (requires a linked Supabase project).
- Assessment answers and scoring are versioned: every stored `AssessmentResult` carries both `scoringVersion` (see `features/onboarding/scoring/config.ts`) and `answersVersion` (see `features/onboarding/schema/onboardingAnswers.ts`). Bump both together when either shape changes, and bump the local storage keys (`nicotine.onboardingDraft.vN` in `features/onboarding/hooks/useAssessmentDraft.ts`, `nicotine.assessment.session.vN` in `providers/AssessmentProvider.tsx`) to silently invalidate old client caches rather than writing migration code.
- Onboarding flow is: `/onboarding` (nine-question assessment) → `/onboarding/almost-there` (profile capture) → `/results`. The assessment page also has a **Skip test** button that confirms and sends the user straight to `/sign-up`. `AssessmentProvider` owns state across all three screens via `setPendingAnswers` (called after the last assessment question) and `submitAlmostThere` (called from Almost There, which is what actually computes the result and persists everything).
- Quit-duration milestones are computed client-side in `features/home/useQuitStats.ts`; they are not persisted as badge/history records.
- The onboarding assessment is a pre-auth / free-value flow. It must not gate signed-in app access — `app/(app)/routeGuard.ts` only checks auth, never assessment completion. Missing `onboarding_profiles` is a valid state for a signed-in user.
- Signed-in personalization (e.g. the home greeting) should read `profiles.display_name` with a friendly fallback ("Hi there"). Do not push users into `/onboarding` just to collect a name — name editing lives in `app/(app)/settings/profile.tsx` via the existing `updateProfile` repository call.
- Expo Go compatibility currently targets Expo SDK 55 / React Native 0.83. After SDK bumps, use `npx expo install --fix` and keep Node at 20.19+. Do not re-add `newArchEnabled` or `android.edgeToEdgeEnabled` to app config; SDK 55 makes both mandatory and removed those config fields.
