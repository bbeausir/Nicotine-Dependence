import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

import { getSupabaseConfigError } from '@/lib/supabase/client';

const ORIGINAL_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ORIGINAL_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

function restoreSupabaseEnv() {
  if (ORIGINAL_URL === undefined) {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
  } else {
    process.env.EXPO_PUBLIC_SUPABASE_URL = ORIGINAL_URL;
  }

  if (ORIGINAL_ANON_KEY === undefined) {
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  } else {
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = ORIGINAL_ANON_KEY;
  }
}

afterEach(() => {
  restoreSupabaseEnv();
});

describe('supabase client config guard', () => {
  it('returns error when env vars are missing', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    expect(getSupabaseConfigError()).toBe(
      'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    );
  });

  it('returns null when env vars are present', () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon-test-key';

    expect(getSupabaseConfigError()).toBeNull();
  });
});
