import { describe, expect, it, vi } from 'vitest';

import type { AppSupabaseClient } from '@/lib/supabase/client';
import { ensureProfile } from '@/lib/repositories/profiles';

type UpsertMock = ReturnType<typeof vi.fn>;

function makeClient(upsert: UpsertMock): AppSupabaseClient {
  const from = vi.fn(() => ({ upsert }));
  return { from } as unknown as AppSupabaseClient;
}

describe('ensureProfile', () => {
  it('upserts the profile row with ignoreDuplicates on conflict', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const client = makeClient(upsert);

    const result = await ensureProfile(client, 'user-1');

    expect(result.error).toBeNull();
    expect(upsert).toHaveBeenCalledWith(
      { id: 'user-1' },
      { onConflict: 'id', ignoreDuplicates: true },
    );
  });

  it('returns the error message when Supabase reports one', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: { message: 'boom' } });
    const client = makeClient(upsert);

    const result = await ensureProfile(client, 'user-1');

    expect(result.error).toBe('boom');
  });
});
