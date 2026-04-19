import type { Database } from '@/lib/supabase/database.types';
import type { AppSupabaseClient } from '@/lib/supabase/client';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type EnsureProfileResult = {
  error: string | null;
};

export type GetProfileResult = {
  profile: Profile | null;
  error: string | null;
};

export type UpdateProfileResult = {
  profile: Profile | null;
  error: string | null;
};

/**
 * Idempotently ensures a `profiles` row exists for the given user.
 *
 * The `on_auth_user_created` trigger creates this row automatically for new
 * sign-ups. This call is a safety net for users that existed before the
 * trigger was added, and for any future path where a user could exist in
 * `auth.users` without a matching `profiles` row.
 */
export async function ensureProfile(
  client: AppSupabaseClient,
  userId: string,
): Promise<EnsureProfileResult> {
  const { error } = await client
    .from('profiles')
    .upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true });

  return { error: error?.message ?? null };
}

export async function getProfile(
  client: AppSupabaseClient,
  userId: string,
): Promise<GetProfileResult> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return { profile: data ?? null, error: error?.message ?? null };
}

export async function updateProfile(
  client: AppSupabaseClient,
  userId: string,
  patch: Pick<ProfileUpdate, 'quit_date' | 'daily_cost'>,
): Promise<UpdateProfileResult> {
  const { data, error } = await client
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select('*')
    .single();

  return { profile: data ?? null, error: error?.message ?? null };
}
