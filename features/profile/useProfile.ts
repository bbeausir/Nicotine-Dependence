import { useCallback, useEffect, useState } from 'react';

import { getProfile, updateProfile, type Profile } from '@/lib/repositories/profiles';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export type UseProfileResult = {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  save: (patch: { quit_date: string | null; daily_cost: number | null }) => Promise<{ error: string | null }>;
};

export function useProfile(): UseProfileResult {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    const client = getSupabaseClient();
    if (!client) {
      setError('Supabase is not configured.');
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    getProfile(client, userId)
      .then(({ profile: p, error: e }) => {
        if (!active) return;
        setProfile(p);
        setError(e);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const save = useCallback(
    async (patch: { quit_date: string | null; daily_cost: number | null }) => {
      if (!userId) return { error: 'Not signed in.' };
      const client = getSupabaseClient();
      if (!client) return { error: 'Supabase is not configured.' };
      const { profile: p, error: e } = await updateProfile(client, userId, patch);
      if (e) return { error: e };
      setProfile(p);
      return { error: null };
    },
    [userId],
  );

  return { profile, isLoading, error, save };
}
