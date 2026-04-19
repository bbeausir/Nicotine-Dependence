import type { AppSupabaseClient } from '@/lib/supabase/client';

export type EnsureProfileResult = {
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
