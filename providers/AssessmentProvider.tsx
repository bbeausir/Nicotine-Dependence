import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getAssessmentStorage } from '@/lib/storage/assessmentStorage';
import { getSupabaseClient } from '@/lib/supabase/client';
import {
  getOnboardingProfile,
  upsertOnboardingProfile,
} from '@/lib/repositories/onboardingProfiles';
import { useAuth } from '@/providers/AuthProvider';

import {
  assessmentSessionSchema,
  type OnboardingAnswers,
} from '@/features/onboarding/schema/onboardingAnswers';
import type { AssessmentResult } from '@/features/onboarding/scoring/types';

/**
 * Holds latest assessment answers + computed result for navigation between onboarding → results.
 * Local storage is the offline cache; Supabase is the source of truth once signed in.
 */

type AssessmentContextValue = {
  answers: OnboardingAnswers | null;
  result: AssessmentResult | null;
  isReady: boolean;
  syncError: string | null;
  setSession: (answers: OnboardingAnswers, result: AssessmentResult) => void;
  clear: () => void;
};

const AssessmentContext = createContext<AssessmentContextValue | undefined>(undefined);
const STORAGE_KEY = 'nicotine.assessment.session.v1';
const storage = getAssessmentStorage();

export function parseAssessmentSessionPayload(
  raw: string,
): { answers: OnboardingAnswers; result: AssessmentResult } | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const validated = assessmentSessionSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const { user, isReady: authReady } = useAuth();
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);
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
          setResult(parsed.result);
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

  // Hydrate from Supabase when signed in and no local snapshot was found.
  useEffect(() => {
    if (!authReady || !isReady || !user?.id) return;
    if (answers && result) return;

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
        void storage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, isReady, user?.id, answers, result]);

  const value = useMemo<AssessmentContextValue>(
    () => ({
      answers,
      result,
      isReady,
      syncError,
      setSession: (a, r) => {
        setAnswers(a);
        setResult(r);
        void storage.setItem(STORAGE_KEY, JSON.stringify({ answers: a, result: r }));

        if (user?.id) {
          const client = getSupabaseClient();
          if (client) {
            void upsertOnboardingProfile(client, user.id, { answers: a, result: r }).then(
              ({ error }) => {
                setSyncError(error);
              },
            );
          }
        }
      },
      clear: () => {
        setAnswers(null);
        setResult(null);
        setSyncError(null);
        void storage.removeItem(STORAGE_KEY);
      },
    }),
    [answers, isReady, result, syncError, user?.id],
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
