import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { getLatestLoopMap, saveLoopMap as dbSaveLoopMap } from '@/lib/database/schema';
import { useDb } from '@/lib/database/useDb';
import { parseLoopMap, type LoopMap } from '@/features/module-1/loopMap';

/**
 * Returns the latest LoopMap (if any), already parsed for component use.
 * Reloads on screen focus so cards stay in sync after the user completes the flow.
 */
export function useLoopMapStorage() {
  const [loopMap, setLoopMap] = useState<LoopMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = useDb();

  const loadLoopMap = useCallback(async () => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const raw = await getLatestLoopMap(db);
      setLoopMap(parseLoopMap(raw));
      setError(null);
    } catch (err) {
      console.error('Failed to load loop map:', err);
      setError(err instanceof Error ? err.message : 'Failed to load loop map');
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  const save = useCallback(
    async (triggers: string[], benefit: string, outcome: string): Promise<LoopMap | null> => {
      if (!db) return null;

      try {
        const raw = await dbSaveLoopMap(db, triggers, benefit, outcome);
        const parsed = parseLoopMap(raw);
        setLoopMap(parsed);
        setError(null);
        return parsed;
      } catch (err) {
        console.error('Failed to save loop map:', err);
        setError(err instanceof Error ? err.message : 'Failed to save loop map');
        throw err;
      }
    },
    [db],
  );

  useFocusEffect(
    useCallback(() => {
      loadLoopMap();
    }, [loadLoopMap]),
  );

  return { loopMap, isLoading, error, save, reload: loadLoopMap };
}
