import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getAssessmentStorage } from '@/lib/storage/assessmentStorage';

import {
  assessmentSessionSchema,
  type OnboardingAnswers,
} from '@/features/onboarding/schema/onboardingAnswers';
import type { AssessmentResult } from '@/features/onboarding/scoring/types';

/**
 * Holds latest assessment answers + computed result for navigation between onboarding → results.
 * TODO(DATA): Persist draft answers to AsyncStorage; sync to Supabase when signed in.
 */

type AssessmentContextValue = {
  answers: OnboardingAnswers | null;
  result: AssessmentResult | null;
  isReady: boolean;
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
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isReady, setIsReady] = useState(false);

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

  const value = useMemo<AssessmentContextValue>(
    () => ({
      answers,
      result,
      isReady,
      setSession: (a, r) => {
        setAnswers(a);
        setResult(r);
        void storage.setItem(STORAGE_KEY, JSON.stringify({ answers: a, result: r }));
      },
      clear: () => {
        setAnswers(null);
        setResult(null);
        void storage.removeItem(STORAGE_KEY);
      },
    }),
    [answers, isReady, result],
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
