import { describe, expect, it, vi } from 'vitest';

import type { OnboardingAnswers } from '@/features/onboarding/schema/onboardingAnswers';
import type { AssessmentResult } from '@/features/onboarding/scoring/types';
import type { AppSupabaseClient } from '@/lib/supabase/client';
import {
  getOnboardingProfile,
  upsertOnboardingProfile,
} from '@/lib/repositories/onboardingProfiles';

const answers: OnboardingAnswers = {
  nicotineForms: ['pouch'],
  dailyUseEvents: '3_4',
  firstUseAfterWake: '15min',
  urgeEnvironments: ['work'],
  emotionalPrecursor: 'stress',
  highStakesReliance: 'sometimes',
  performanceBelief: 'somewhat',
  reductionConcern: 'focus',
  selfImageConflict: 6,
  pastAttempts: '1',
  crashReason: 'stress_event',
  sprintGoal: 'abstinence',
};

const result: AssessmentResult = {
  scoringVersion: 'v1',
  dependenceScore: 42,
  cravingReactivityScore: 55,
  cravingReactivityLabel: 'Medium',
  regulationConfidenceScore: 30,
  regulationConfidenceLabel: 'Low',
  primaryPattern: 'stress_regulator',
  driverSummary: 'driver',
  firstWinSummary: 'first win',
  weekOneFocus: 'focus',
};

describe('getOnboardingProfile', () => {
  it('returns hydrated answers + result when a row exists', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { answers, result },
      error: null,
    });
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    const client = { from } as unknown as AppSupabaseClient;

    const res = await getOnboardingProfile(client, 'user-1');

    expect(from).toHaveBeenCalledWith('onboarding_profiles');
    expect(select).toHaveBeenCalledWith('answers, result');
    expect(eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(res).toEqual({ data: { answers, result }, error: null });
  });

  it('returns null data (no error) when no row is found', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const client = {
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle }) }) }),
    } as unknown as AppSupabaseClient;

    const res = await getOnboardingProfile(client, 'user-1');
    expect(res).toEqual({ data: null, error: null });
  });

  it('surfaces Supabase errors as string messages', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'rls denied' },
    });
    const client = {
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle }) }) }),
    } as unknown as AppSupabaseClient;

    const res = await getOnboardingProfile(client, 'user-1');
    expect(res).toEqual({ data: null, error: 'rls denied' });
  });
});

describe('upsertOnboardingProfile', () => {
  it('writes the snapshot keyed by user_id with scoring_version denormalized', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const client = { from: vi.fn(() => ({ upsert })) } as unknown as AppSupabaseClient;

    const res = await upsertOnboardingProfile(client, 'user-1', { answers, result });

    expect(client.from).toHaveBeenCalledWith('onboarding_profiles');
    expect(upsert).toHaveBeenCalledWith(
      {
        user_id: 'user-1',
        answers,
        result,
        scoring_version: 'v1',
      },
      { onConflict: 'user_id' },
    );
    expect(res.error).toBeNull();
  });

  it('returns the error message on failure', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: { message: 'fk violation' } });
    const client = { from: () => ({ upsert }) } as unknown as AppSupabaseClient;

    const res = await upsertOnboardingProfile(client, 'user-1', { answers, result });
    expect(res.error).toBe('fk violation');
  });
});
