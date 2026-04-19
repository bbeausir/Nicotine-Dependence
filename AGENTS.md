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
