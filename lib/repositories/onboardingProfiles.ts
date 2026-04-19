import type { OnboardingAnswers } from '@/features/onboarding/schema/onboardingAnswers';
import type { AssessmentResult } from '@/features/onboarding/scoring/types';
import type { AppSupabaseClient } from '@/lib/supabase/client';

export type OnboardingProfileSnapshot = {
  answers: OnboardingAnswers;
  result: AssessmentResult;
};

export type OnboardingProfileFetchResult =
  | { data: OnboardingProfileSnapshot; error: null }
  | { data: null; error: null } // no row found
  | { data: null; error: string };

export type OnboardingProfileWriteResult = {
  error: string | null;
};

/**
 * Fetches the user's onboarding snapshot, or `{ data: null, error: null }` if
 * no row exists yet. Callers should treat a null result as "not completed."
 */
export async function getOnboardingProfile(
  client: AppSupabaseClient,
  userId: string,
): Promise<OnboardingProfileFetchResult> {
  const { data, error } = await client
    .from('onboarding_profiles')
    .select('answers, result')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }
  if (!data) {
    return { data: null, error: null };
  }

  return {
    data: {
      answers: data.answers as OnboardingAnswers,
      result: data.result as AssessmentResult,
    },
    error: null,
  };
}

/**
 * Upserts the user's onboarding snapshot. One row per user — repeated calls
 * overwrite the prior snapshot. `completed_at` is set by the DB default on
 * insert; we refresh `updated_at` via the table trigger.
 */
export async function upsertOnboardingProfile(
  client: AppSupabaseClient,
  userId: string,
  snapshot: OnboardingProfileSnapshot,
): Promise<OnboardingProfileWriteResult> {
  const { error } = await client.from('onboarding_profiles').upsert(
    {
      user_id: userId,
      answers: snapshot.answers,
      result: snapshot.result,
      scoring_version: snapshot.result.scoringVersion,
    },
    { onConflict: 'user_id' },
  );

  return { error: error?.message ?? null };
}
