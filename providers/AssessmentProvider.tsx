import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  almostThereSchema,
  type AlmostThereAnswers,
} from '@/features/onboarding/schema/almostThere';
import {
  assessmentResultSchema,
  onboardingAnswersSchema,
  type OnboardingAnswers,
} from '@/features/onboarding/schema/onboardingAnswers';
import { calculateScores } from '@/features/onboarding/scoring/calculateScores';
import type { AssessmentResult } from '@/features/onboarding/scoring/types';
import {
  getOnboardingProfile,
  upsertOnboardingProfile,
} from '@/lib/repositories/onboardingProfiles';
import { updateProfile } from '@/lib/repositories/profiles';
import { getAssessmentStorage } from '@/lib/storage/assessmentStorage';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { z } from 'zod';

/**
 * Owns assessment state across screens:
 *   Assessment → Almost There → Results
 *
 * Local storage is an offline cache; Supabase is the source of truth once signed in.
 */

type AssessmentContextValue = {
  answers: OnboardingAnswers | null;
  almostThere: AlmostThereAnswers | null;
  result: AssessmentResult | null;
  isReady: boolean;
  syncError: string | null;
  /** Called when the assessment questions are complete, before Almost There. */
  setPendingAnswers: (answers: OnboardingAnswers) => void;
  /** Called when Almost There is submitted — computes the result and persists everything. */
  submitAlmostThere: (almostThere: AlmostThereAnswers) => AssessmentResult | null;
  clear: () => void;
};

const AssessmentContext = createContext<AssessmentContextValue | undefined>(undefined);

const STORAGE_KEY = 'nicotine.assessment.session.v2';
const storage = getAssessmentStorage();

const storedSessionSchema = z.object({
  answers: onboardingAnswersSchema,
  almostThere: almostThereSchema.optional(),
  result: assessmentResultSchema.optional(),
});

export function parseAssessmentSessionPayload(raw: string) {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const validated = storedSessionSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}

function toProfilePatch(almostThere: AlmostThereAnswers) {
  return {
    display_name: almostThere.displayName,
    age_band: almostThere.ageBand ?? null,
    gender: almostThere.gender ?? null,
    attribution: almostThere.attribution ?? null,
  };
}

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const { user, isReady: authReady } = useAuth();
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);
  const [almostThere, setAlmostThere] = useState<AlmostThereAnswers | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await storage.getItem(STORAGE_KEY);
        if (cancelled || !raw) return;
        const parsed = parseAssessmentSessionPayload(raw);
        if (parsed) {
          setAnswers(parsed.answers);
          setAlmostThere(parsed.almostThere ?? null);
          setResult(parsed.result ?? null);
        } else {
          await storage.removeItem(STORAGE_KEY);
        }
      } catch {
        // ignore malformed storage
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(
    (payload: {
      answers: OnboardingAnswers;
      almostThere?: AlmostThereAnswers;
      result?: AssessmentResult;
    }) => {
      void storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    },
    [],
  );

  const setPendingAnswers = useCallback(
    (next: OnboardingAnswers) => {
      setAnswers(next);
      // Clear any stale result/almost-there from a prior run.
      setAlmostThere(null);
      setResult(null);
      persist({ answers: next });
    },
    [persist],
  );

  const submitAlmostThere = useCallback(
    (next: AlmostThereAnswers): AssessmentResult | null => {
      if (!answers) return null;
      const computed = calculateScores(answers);
      setAlmostThere(next);
      setResult(computed);
      persist({ answers, almostThere: next, result: computed });

      if (user?.id) {
        const client = getSupabaseClient();
        if (client) {
          void upsertOnboardingProfile(client, user.id, { answers, result: computed }).then(
            ({ error }) => {
              if (error) setSyncError(error);
            },
          );
          void updateProfile(client, user.id, toProfilePatch(next)).then(({ error }) => {
            if (error) setSyncError(error);
          });
        }
      }

      return computed;
    },
    [answers, persist, user?.id],
  );

  // On sign-in, reconcile local storage with Supabase:
  // - Cloud record exists → hydrate local state (cloud wins).
  // - No cloud record but local completed data exists → push local snapshot + almost-there up.
  const syncedForUser = useRef<string | null>(null);
  useEffect(() => {
    if (!authReady || !isReady || !user?.id) return;
    if (syncedForUser.current === user.id) return;
    syncedForUser.current = user.id;

    const client = getSupabaseClient();
    if (!client) return;

    let cancelled = false;
    (async () => {
      const { data, error } = await getOnboardingProfile(client, user.id);
      if (cancelled) return;
      if (error) {
        setSyncError(error);
        return;
      }
      if (data) {
        setAnswers(data.answers);
        setResult(data.result);
        persist({ answers: data.answers, almostThere: almostThere ?? undefined, result: data.result });
      } else if (answers && result) {
        const { error: writeError } = await upsertOnboardingProfile(client, user.id, {
          answers,
          result,
        });
        if (!cancelled && writeError) setSyncError(writeError);
        if (almostThere) {
          const { error: profileError } = await updateProfile(
            client,
            user.id,
            toProfilePatch(almostThere),
          );
          if (!cancelled && profileError) setSyncError(profileError);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // syncedForUser guards against re-running on state changes — we only
    // want one reconciliation pass per user session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, isReady, user?.id]);

  const clear = useCallback(() => {
    setAnswers(null);
    setAlmostThere(null);
    setResult(null);
    setSyncError(null);
    void storage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AssessmentContextValue>(
    () => ({
      answers,
      almostThere,
      result,
      isReady,
      syncError,
      setPendingAnswers,
      submitAlmostThere,
      clear,
    }),
    [answers, almostThere, result, isReady, syncError, setPendingAnswers, submitAlmostThere, clear],
  );

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment(): AssessmentContextValue {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return ctx;
}
