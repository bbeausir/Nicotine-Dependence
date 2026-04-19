import type { AppSupabaseClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/database.types';

export type CravingRow = Tables<'cravings'>;

export type LogCravingPayload = {
  intensity: number;
  triggers?: string[];
  notes?: string;
};

export type LogCravingResult = {
  data: CravingRow | null;
  error: string | null;
};

export type ListCravingsResult = {
  data: CravingRow[] | null;
  error: string | null;
};

export async function logCraving(
  client: AppSupabaseClient,
  userId: string,
  payload: LogCravingPayload,
): Promise<LogCravingResult> {
  const { data, error } = await client
    .from('cravings')
    .insert({
      user_id: userId,
      intensity: payload.intensity,
      triggers: payload.triggers ?? [],
      notes: payload.notes ?? null,
    })
    .select()
    .single();

  return { data: data ?? null, error: error?.message ?? null };
}

export async function listCravings(
  client: AppSupabaseClient,
  userId: string,
  limit = 30,
): Promise<ListCravingsResult> {
  const { data, error } = await client
    .from('cravings')
    .select()
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
    .limit(limit);

  return { data: data ?? null, error: error?.message ?? null };
}
