import { afterEach, describe, expect, it, vi } from 'vitest';

import { createChunkedSecureStoreAdapter, SECURE_STORE_CHUNK_SIZE } from '@/lib/supabase/secureAuthStorage';

const memory = new Map<string, string>();

vi.mock('expo-secure-store', () => ({
  getItemAsync: (key: string) => Promise.resolve(memory.get(key) ?? null),
  setItemAsync: (key: string, value: string) => {
    memory.set(key, value);
    return Promise.resolve();
  },
  deleteItemAsync: (key: string) => {
    memory.delete(key);
    return Promise.resolve();
  },
}));

afterEach(() => {
  memory.clear();
});

describe('createChunkedSecureStoreAdapter', () => {
  it('round-trips a value larger than one chunk', async () => {
    const adapter = createChunkedSecureStoreAdapter();
    const value = 'x'.repeat(SECURE_STORE_CHUNK_SIZE * 2 + 50);

    await adapter.setItem('sb-test-auth', value);
    const read = await adapter.getItem('sb-test-auth');

    expect(read).toBe(value);
  });

  it('removeItem clears chunk keys and meta', async () => {
    const adapter = createChunkedSecureStoreAdapter();
    const value = 'ab'.repeat(SECURE_STORE_CHUNK_SIZE);

    await adapter.setItem('sb-test-auth', value);
    await adapter.removeItem('sb-test-auth');

    expect(await adapter.getItem('sb-test-auth')).toBeNull();
    const metaKeys = [...memory.keys()].filter((k) => k.includes('__sb_auth'));
    expect(metaKeys.length).toBe(0);
  });

  it('returns null for unknown keys', async () => {
    const adapter = createChunkedSecureStoreAdapter();
    expect(await adapter.getItem('missing-key')).toBeNull();
  });
});
