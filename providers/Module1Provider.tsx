import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  saveModule1Draft,
  loadModule1Draft,
  clearModule1Draft,
  type Module1Draft,
} from '@/lib/storage/module1DraftStorage';
import { saveLoopMap as dbSaveLoopMap } from '@/lib/database/schema';
import { useDb } from '@/lib/database/useDb';
import { parseLoopMap, type LoopMap } from '@/features/module-1/loopMap';
import { MAX_TRIGGERS } from '@/features/module-1/constants';

export const TOTAL_SCREENS = 7; // 0..6

interface Module1ContextValue {
  currentScreen: number;
  triggers: string[];
  benefit: string | null;
  outcome: string | null;
  loopMap: LoopMap | null;
  isReady: boolean;
  error: string | null;

  goToScreen: (index: number) => void;
  setTriggers: (selections: string[]) => void;
  setBenefit: (selection: string) => void;
  setOutcome: (selection: string) => void;
  saveLoopMap: () => Promise<LoopMap | null>;
  /** Clear in-flight selections + draft. Used when the user re-enters the flow after completion. */
  reset: () => Promise<void>;
}

const Module1Context = createContext<Module1ContextValue | undefined>(undefined);

export function Module1Provider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [triggers, setTriggersState] = useState<string[]>([]);
  const [benefit, setBenefitState] = useState<string | null>(null);
  const [outcome, setOutcomeState] = useState<string | null>(null);
  const [loopMap, setLoopMap] = useState<LoopMap | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const db = useDb();

  // Load draft from local storage on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const draft = await loadModule1Draft();
        if (!cancelled && draft) {
          setCurrentScreen(Math.min(Math.max(draft.currentScreen, 0), TOTAL_SCREENS - 1));
          setTriggersState(draft.triggers.slice(0, MAX_TRIGGERS));
          setBenefitState(draft.benefit);
          setOutcomeState(draft.outcome);
        }
      } catch (err) {
        console.error('Failed to load module1 draft:', err);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-save draft (debounced) when in-flight state changes.
  useEffect(() => {
    if (!isReady) return;

    const draft: Module1Draft = {
      currentScreen,
      triggers,
      benefit,
      outcome,
      savedAt: Date.now(),
    };

    const timeoutId = setTimeout(() => {
      saveModule1Draft(draft).catch((err) => console.error('Failed to auto-save draft:', err));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentScreen, triggers, benefit, outcome, isReady]);

  const goToScreen = useCallback((index: number) => {
    setCurrentScreen(Math.max(0, Math.min(index, TOTAL_SCREENS - 1)));
  }, []);

  const setTriggers = useCallback((selections: string[]) => {
    setTriggersState(selections.slice(0, MAX_TRIGGERS));
  }, []);

  const setBenefit = useCallback((selection: string) => {
    setBenefitState(selection);
  }, []);

  const setOutcome = useCallback((selection: string) => {
    setOutcomeState(selection);
  }, []);

  const saveLoopMap = useCallback(async (): Promise<LoopMap | null> => {
    if (!db) {
      setError('Loop Map can only be saved on a device.');
      return null;
    }
    if (!benefit || !outcome || triggers.length === 0) {
      setError('Loop Map is incomplete.');
      return null;
    }

    try {
      const raw = await dbSaveLoopMap(db, triggers, benefit, outcome);
      const parsed = parseLoopMap(raw);
      setLoopMap(parsed);
      await clearModule1Draft();
      setError(null);
      return parsed;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save loop map';
      setError(msg);
      throw err;
    }
  }, [db, triggers, benefit, outcome]);

  const reset = useCallback(async () => {
    setCurrentScreen(0);
    setTriggersState([]);
    setBenefitState(null);
    setOutcomeState(null);
    setLoopMap(null);
    setError(null);
    await clearModule1Draft();
  }, []);

  const value = useMemo<Module1ContextValue>(
    () => ({
      currentScreen,
      triggers,
      benefit,
      outcome,
      loopMap,
      isReady,
      error,
      goToScreen,
      setTriggers,
      setBenefit,
      setOutcome,
      saveLoopMap,
      reset,
    }),
    [
      currentScreen,
      triggers,
      benefit,
      outcome,
      loopMap,
      isReady,
      error,
      goToScreen,
      setTriggers,
      setBenefit,
      setOutcome,
      saveLoopMap,
      reset,
    ],
  );

  return <Module1Context.Provider value={value}>{children}</Module1Context.Provider>;
}

export function useModule1() {
  const context = useContext(Module1Context);
  if (!context) {
    throw new Error('useModule1 must be used within Module1Provider');
  }
  return context;
}
