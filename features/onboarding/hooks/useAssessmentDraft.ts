import { useCallback, useEffect, useRef } from 'react';

import { getAssessmentStorage } from '@/lib/storage/assessmentStorage';
import type { UseFormReset } from 'react-hook-form';

import {
  defaultOnboardingAnswers,
  onboardingDraftSchema,
  type OnboardingAnswers,
  type OnboardingDraftValues,
} from '@/features/onboarding/schema/onboardingAnswers';

const STORAGE_KEY = 'nicotine.onboardingDraft.v2';
const storage = getAssessmentStorage();

export function parseDraftPayload(raw: string): OnboardingDraftValues | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const validated = onboardingDraftSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}

export function useAssessmentDraft(
  values: Partial<OnboardingAnswers> | undefined,
  reset: UseFormReset<OnboardingAnswers>,
  onHydrate?: (draft: OnboardingDraftValues) => void,
): { clearDraft: () => Promise<void> } {
  const canPersist = useRef(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await storage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = parseDraftPayload(raw);
          if (parsed) {
            reset({
              ...defaultOnboardingAnswers(),
              ...parsed,
            });
            onHydrate?.(parsed);
          } else {
            await storage.removeItem(STORAGE_KEY);
          }
        }
      } catch {
        // ignore corrupt draft
      } finally {
        if (!cancelled) {
          canPersist.current = true;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reset]);

  useEffect(() => {
    if (!canPersist.current) return;
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      if (!canPersist.current) return;
      const merged = { ...defaultOnboardingAnswers(), ...values };
      void storage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }, 450);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [values]);

  const clearDraft = useCallback(async () => {
    canPersist.current = false;
    if (debounce.current) {
      clearTimeout(debounce.current);
      debounce.current = null;
    }
    await storage.removeItem(STORAGE_KEY);
  }, []);

  return { clearDraft };
}
