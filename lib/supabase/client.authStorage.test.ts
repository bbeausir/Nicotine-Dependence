import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const asyncStorageRef = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}));

const createClientMock = vi.hoisted(() =>
  vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  })),
);

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: asyncStorageRef,
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}));

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

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

describe('getSupabaseClient auth storage', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    delete (globalThis as { document?: unknown }).document;
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon-test-key';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete (globalThis as { document?: unknown }).document;
    restoreSupabaseEnv();
  });

  it('uses AsyncStorage when a browser document is present (Expo web)', async () => {
    vi.stubGlobal('document', { createElement: () => null });
    const { getSupabaseClient } = await import('@/lib/supabase/client');
    getSupabaseClient();

    expect(createClientMock).toHaveBeenCalledTimes(1);
    const [, , options] = createClientMock.mock.calls[0] as unknown as [
      string,
      string,
      { auth: { storage: unknown } },
    ];
    expect(options.auth.storage).toBe(asyncStorageRef);
  });

  it('uses chunked secure storage adapter when document is absent (native / Node)', async () => {
    const { getSupabaseClient } = await import('@/lib/supabase/client');
    getSupabaseClient();

    expect(createClientMock).toHaveBeenCalledTimes(1);
    const [, , options] = createClientMock.mock.calls[0] as unknown as [
      string,
      string,
      { auth: { storage: { getItem: unknown; setItem: unknown; removeItem: unknown } } },
    ];
    expect(options.auth.storage).not.toBe(asyncStorageRef);
    expect(typeof options.auth.storage.getItem).toBe('function');
    expect(typeof options.auth.storage.setItem).toBe('function');
    expect(typeof options.auth.storage.removeItem).toBe('function');
  });
});
