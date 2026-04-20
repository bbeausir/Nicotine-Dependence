import { describe, expect, it, vi } from 'vitest';

import type { AppSupabaseClient } from '@/lib/supabase/client';
import { ensureProfile, getProfile, updateProfile, type Profile } from '@/lib/repositories/profiles';

type AnyMock = ReturnType<typeof vi.fn>;

function makeUpsertClient(upsert: AnyMock): AppSupabaseClient {
  const from = vi.fn(() => ({ upsert }));
  return { from } as unknown as AppSupabaseClient;
}

function makeSelectClient(maybeSingle: AnyMock): { client: AppSupabaseClient; eq: AnyMock; select: AnyMock } {
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));
  return { client: { from } as unknown as AppSupabaseClient, eq, select };
}

function makeUpdateClient(single: AnyMock): {
  client: AppSupabaseClient;
  update: AnyMock;
  eq: AnyMock;
  select: AnyMock;
} {
  const select = vi.fn(() => ({ single }));
  const eq = vi.fn(() => ({ select }));
  const update = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ update }));
  return { client: { from } as unknown as AppSupabaseClient, update, eq, select };
}

describe('ensureProfile', () => {
  it('upserts the profile row with ignoreDuplicates on conflict', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const client = makeUpsertClient(upsert);

    const result = await ensureProfile(client, 'user-1');

    expect(result.error).toBeNull();
    expect(upsert).toHaveBeenCalledWith(
      { id: 'user-1' },
      { onConflict: 'id', ignoreDuplicates: true },
    );
  });

  it('returns the error message when Supabase reports one', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: { message: 'boom' } });
    const client = makeUpsertClient(upsert);

    const result = await ensureProfile(client, 'user-1');

    expect(result.error).toBe('boom');
  });
});

describe('getProfile', () => {
  it('returns the matching profile row', async () => {
    const profile: Profile = {
      id: 'user-1',
      created_at: '2026-04-18T00:00:00Z',
      updated_at: '2026-04-18T00:00:00Z',
      quit_date: '2026-04-04',
      daily_cost: 12.5,
      display_name: null,
      age_band: null,
      gender: null,
      attribution: null,
    };
    const maybeSingle = vi.fn().mockResolvedValue({ data: profile, error: null });
    const { client, eq, select } = makeSelectClient(maybeSingle);

    const result = await getProfile(client, 'user-1');

    expect(select).toHaveBeenCalledWith('*');
    expect(eq).toHaveBeenCalledWith('id', 'user-1');
    expect(result).toEqual({ profile, error: null });
  });

  it('returns null profile when no row exists', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const { client } = makeSelectClient(maybeSingle);

    const result = await getProfile(client, 'user-1');

    expect(result).toEqual({ profile: null, error: null });
  });

  it('surfaces Supabase errors', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'denied' } });
    const { client } = makeSelectClient(maybeSingle);

    const result = await getProfile(client, 'user-1');

    expect(result).toEqual({ profile: null, error: 'denied' });
  });
});

describe('updateProfile', () => {
  it('writes the patch and returns the updated row', async () => {
    const updated: Profile = {
      id: 'user-1',
      created_at: '2026-04-18T00:00:00Z',
      updated_at: '2026-04-18T00:00:00Z',
      quit_date: '2026-04-10',
      daily_cost: 9,
      display_name: null,
      age_band: null,
      gender: null,
      attribution: null,
    };
    const single = vi.fn().mockResolvedValue({ data: updated, error: null });
    const { client, update, eq } = makeUpdateClient(single);

    const result = await updateProfile(client, 'user-1', { quit_date: '2026-04-10', daily_cost: 9 });

    expect(update).toHaveBeenCalledWith({ quit_date: '2026-04-10', daily_cost: 9 });
    expect(eq).toHaveBeenCalledWith('id', 'user-1');
    expect(result).toEqual({ profile: updated, error: null });
  });

  it('passes through null patch values to clear fields', async () => {
    const updated: Profile = {
      id: 'user-1',
      created_at: '2026-04-18T00:00:00Z',
      updated_at: '2026-04-18T00:00:00Z',
      quit_date: null,
      daily_cost: null,
      display_name: null,
      age_band: null,
      gender: null,
      attribution: null,
    };
    const single = vi.fn().mockResolvedValue({ data: updated, error: null });
    const { client, update } = makeUpdateClient(single);

    await updateProfile(client, 'user-1', { quit_date: null, daily_cost: null });

    expect(update).toHaveBeenCalledWith({ quit_date: null, daily_cost: null });
  });

  it('surfaces Supabase errors', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: 'denied' } });
    const { client } = makeUpdateClient(single);

    const result = await updateProfile(client, 'user-1', { quit_date: '2026-04-10', daily_cost: 9 });

    expect(result).toEqual({ profile: null, error: 'denied' });
  });
});
