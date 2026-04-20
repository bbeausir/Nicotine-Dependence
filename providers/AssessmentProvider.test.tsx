import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AlmostThereAnswers } from '@/features/onboarding/schema/almostThere';
import type { OnboardingAnswers } from '@/features/onboarding/schema/onboardingAnswers';
import { calculateScores } from '@/features/onboarding/scoring/calculateScores';
import { AssessmentProvider, useAssessment } from '@/providers/AssessmentProvider';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

// ---------------------------------------------------------------------------
// Storage mock — in-memory, cleared between tests
// ---------------------------------------------------------------------------

const storageMocks = vi.hoisted(() => {
  const store = new Map<string, string>();
  return {
    store,
    adapter: {
      getItem: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
      setItem: vi.fn((key: string, value: string) => {
        store.set(key, value);
        return Promise.resolve();
      }),
      removeItem: vi.fn((key: string) => {
        store.delete(key);
        return Promise.resolve();
      }),
    },
  };
});

vi.mock('@/lib/storage/assessmentStorage', () => ({
  getAssessmentStorage: () => storageMocks.adapter,
}));

// ---------------------------------------------------------------------------
// Auth mock
// ---------------------------------------------------------------------------

let mockAuthUser: { id: string } | null = null;
let mockAuthReady = true;

vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({ user: mockAuthUser, isReady: mockAuthReady }),
}));

// ---------------------------------------------------------------------------
// Supabase client + repo mocks
// ---------------------------------------------------------------------------

const supabaseMocks = vi.hoisted(() => ({ getSupabaseClient: vi.fn() }));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: supabaseMocks.getSupabaseClient,
}));

const repoMocks = vi.hoisted(() => ({
  getOnboardingProfile: vi.fn(),
  upsertOnboardingProfile: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('@/lib/repositories/onboardingProfiles', () => ({
  getOnboardingProfile: repoMocks.getOnboardingProfile,
  upsertOnboardingProfile: repoMocks.upsertOnboardingProfile,
}));

vi.mock('@/lib/repositories/profiles', () => ({
  updateProfile: repoMocks.updateProfile,
}));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'nicotine.assessment.session.v2';

const mockAnswers: OnboardingAnswers = {
  usageFrequency: '3_5_day',
  firstUseAfterWake: '15min',
  hasTriedToQuit: 'yes',
  pastRelapseReason: 'stress_event',
  firstUseAge: '17_24',
  focusDifficulty: 'occasionally',
  emotionalCoping: 'frequently',
  boredomUse: 'rarely',
  nicotineForms: ['pouch', 'vape'],
};

const mockResult = calculateScores(mockAnswers);

const mockAlmostThere: AlmostThereAnswers = {
  displayName: 'Alex',
  ageBand: '25_34',
  gender: 'prefer_not_to_say',
  attribution: 'google',
};

// ---------------------------------------------------------------------------
// Probe
// ---------------------------------------------------------------------------

let latestAssessment: ReturnType<typeof useAssessment> | null = null;

function Probe() {
  latestAssessment = useAssessment();
  return null;
}

async function renderProvider(): Promise<ReactTestRenderer> {
  let renderer!: ReactTestRenderer;
  await act(async () => {
    renderer = create(
      <AssessmentProvider>
        <Probe />
      </AssessmentProvider>,
    );
  });
  await act(async () => {
    await Promise.resolve();
  });
  return renderer;
}

async function unmountRenderer(renderer: ReactTestRenderer) {
  await act(async () => {
    renderer.unmount();
  });
}

afterEach(() => {
  latestAssessment = null;
  mockAuthUser = null;
  mockAuthReady = true;
  storageMocks.store.clear();
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AssessmentProvider', () => {
  describe('sign-in sync', () => {
    it('pushes local snapshot and almost-there up when user signs in with no cloud record', async () => {
      storageMocks.store.set(
        STORAGE_KEY,
        JSON.stringify({ answers: mockAnswers, almostThere: mockAlmostThere, result: mockResult }),
      );
      mockAuthUser = { id: 'user-1' };
      supabaseMocks.getSupabaseClient.mockReturnValue({});
      repoMocks.getOnboardingProfile.mockResolvedValue({ data: null, error: null });
      repoMocks.upsertOnboardingProfile.mockResolvedValue({ error: null });
      repoMocks.updateProfile.mockResolvedValue({ profile: null, error: null });

      const renderer = await renderProvider();
      await act(async () => {
        await Promise.resolve();
      });

      expect(repoMocks.upsertOnboardingProfile).toHaveBeenCalledWith({}, 'user-1', {
        answers: mockAnswers,
        result: mockResult,
      });
      expect(repoMocks.updateProfile).toHaveBeenCalledWith({}, 'user-1', {
        display_name: 'Alex',
        age_band: '25_34',
        gender: 'prefer_not_to_say',
        attribution: 'google',
      });

      await unmountRenderer(renderer);
    });

    it('hydrates local state from Supabase when the cloud record exists', async () => {
      mockAuthUser = { id: 'user-1' };
      supabaseMocks.getSupabaseClient.mockReturnValue({});
      repoMocks.getOnboardingProfile.mockResolvedValue({
        data: { answers: mockAnswers, result: mockResult },
        error: null,
      });

      const renderer = await renderProvider();
      await act(async () => {
        await Promise.resolve();
      });

      expect(repoMocks.upsertOnboardingProfile).not.toHaveBeenCalled();
      expect(latestAssessment?.answers).toEqual(mockAnswers);
      expect(latestAssessment?.result).toEqual(mockResult);

      await unmountRenderer(renderer);
    });

    it('does not call Supabase when the user is not signed in', async () => {
      storageMocks.store.set(
        STORAGE_KEY,
        JSON.stringify({ answers: mockAnswers, result: mockResult }),
      );
      mockAuthUser = null;
      supabaseMocks.getSupabaseClient.mockReturnValue({});

      const renderer = await renderProvider();
      await act(async () => {
        await Promise.resolve();
      });

      expect(repoMocks.getOnboardingProfile).not.toHaveBeenCalled();
      expect(repoMocks.upsertOnboardingProfile).not.toHaveBeenCalled();
      expect(repoMocks.updateProfile).not.toHaveBeenCalled();

      await unmountRenderer(renderer);
    });

    it('surfaces a sync error when the upsert fails', async () => {
      storageMocks.store.set(
        STORAGE_KEY,
        JSON.stringify({ answers: mockAnswers, result: mockResult }),
      );
      mockAuthUser = { id: 'user-1' };
      supabaseMocks.getSupabaseClient.mockReturnValue({});
      repoMocks.getOnboardingProfile.mockResolvedValue({ data: null, error: null });
      repoMocks.upsertOnboardingProfile.mockResolvedValue({ error: 'network error' });
      repoMocks.updateProfile.mockResolvedValue({ profile: null, error: null });

      const renderer = await renderProvider();
      await act(async () => {
        await Promise.resolve();
      });

      expect(latestAssessment?.syncError).toBe('network error');

      await unmountRenderer(renderer);
    });
  });

  describe('submitAlmostThere', () => {
    it('computes the result and persists everything locally', async () => {
      mockAuthUser = null;

      const renderer = await renderProvider();

      await act(async () => {
        latestAssessment?.setPendingAnswers(mockAnswers);
      });
      await act(async () => {
        latestAssessment?.submitAlmostThere(mockAlmostThere);
      });
      await act(async () => {
        await Promise.resolve();
      });

      expect(latestAssessment?.answers).toEqual(mockAnswers);
      expect(latestAssessment?.almostThere).toEqual(mockAlmostThere);
      expect(latestAssessment?.result).not.toBeNull();
      expect(latestAssessment?.result?.scoringVersion).toBe(mockResult.scoringVersion);

      const stored = storageMocks.store.get(STORAGE_KEY);
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored ?? '{}');
      expect(parsed.answers).toEqual(mockAnswers);
      expect(parsed.almostThere).toEqual(mockAlmostThere);
      expect(parsed.result).toBeDefined();

      await unmountRenderer(renderer);
    });

    it('writes to profiles + onboarding_profiles when the user is signed in', async () => {
      mockAuthUser = { id: 'user-1' };
      supabaseMocks.getSupabaseClient.mockReturnValue({});
      repoMocks.getOnboardingProfile.mockResolvedValue({ data: null, error: null });
      repoMocks.upsertOnboardingProfile.mockResolvedValue({ error: null });
      repoMocks.updateProfile.mockResolvedValue({ profile: null, error: null });

      const renderer = await renderProvider();

      await act(async () => {
        latestAssessment?.setPendingAnswers(mockAnswers);
      });
      await act(async () => {
        latestAssessment?.submitAlmostThere(mockAlmostThere);
      });
      await act(async () => {
        await Promise.resolve();
      });

      expect(repoMocks.upsertOnboardingProfile).toHaveBeenCalled();
      expect(repoMocks.updateProfile).toHaveBeenCalledWith({}, 'user-1', {
        display_name: 'Alex',
        age_band: '25_34',
        gender: 'prefer_not_to_say',
        attribution: 'google',
      });

      await unmountRenderer(renderer);
    });
  });
});
