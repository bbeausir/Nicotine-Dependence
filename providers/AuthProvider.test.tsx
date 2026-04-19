import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider, useAuth } from '@/providers/AuthProvider';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const supabaseMocks = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
  getSupabaseConfigError: vi.fn(),
}));

const linkingMocks = vi.hoisted(() => ({
  createURL: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseClient: supabaseMocks.getSupabaseClient,
  getSupabaseConfigError: supabaseMocks.getSupabaseConfigError,
}));

vi.mock('expo-linking', () => ({
  createURL: linkingMocks.createURL,
}));

vi.mock('expo-router', () => ({
  router: { replace: vi.fn(), push: vi.fn(), back: vi.fn() },
}));

type MockSession = {
  user: {
    id: string;
    email: string | null;
  };
};

type MockClientControls = {
  client: {
    auth: {
      getSession: ReturnType<typeof vi.fn>;
      onAuthStateChange: ReturnType<typeof vi.fn>;
      signInWithPassword: ReturnType<typeof vi.fn>;
      signUp: ReturnType<typeof vi.fn>;
      signOut: ReturnType<typeof vi.fn>;
      resetPasswordForEmail: ReturnType<typeof vi.fn>;
    };
  };
  emitAuthStateChange: (session: MockSession | null) => void;
  unsubscribe: ReturnType<typeof vi.fn>;
};

function createSession(overrides?: Partial<MockSession['user']>): MockSession {
  return {
    user: {
      id: 'user-1',
      email: 'user@example.com',
      ...overrides,
    },
  };
}

function createMockClient(options?: {
  initialSession?: MockSession | null;
  sessionError?: string | null;
  signInError?: string | null;
  signUpError?: string | null;
  /** When false, simulates email confirmation required (no session on sign-up). Default true. */
  signUpWithSession?: boolean;
  resetPasswordError?: string | null;
}): MockClientControls {
  const unsubscribe = vi.fn();
  let onAuthStateChangeCallback: ((event: string, session: MockSession | null) => void) | null = null;

  const client = {
    auth: {
      getSession: vi.fn().mockResolvedValue(
        options?.sessionError
          ? {
              data: { session: null },
              error: { message: options.sessionError },
            }
          : {
              data: { session: options?.initialSession ?? null },
              error: null,
            },
      ),
      onAuthStateChange: vi.fn((callback) => {
        onAuthStateChangeCallback = callback;
        return {
          data: {
            subscription: {
              unsubscribe,
            },
          },
        };
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        error: options?.signInError ? { message: options.signInError } : null,
      }),
      signUp: vi.fn().mockImplementation(async () => {
        if (options?.signUpError) {
          return { data: { user: null, session: null }, error: { message: options.signUpError } };
        }
        const session = options?.signUpWithSession === false ? null : createSession();
        return {
          data: {
            user: { id: 'new', email: 'user@example.com' },
            session,
          },
          error: null,
        };
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({
        error: options?.resetPasswordError ? { message: options.resetPasswordError } : null,
      }),
    },
  };

  return {
    client,
    emitAuthStateChange(session) {
      if (!onAuthStateChangeCallback) {
        throw new Error('Auth state change callback not registered.');
      }
      onAuthStateChangeCallback('SIGNED_IN', session);
    },
    unsubscribe,
  };
}

let latestAuth: ReturnType<typeof useAuth> | null = null;

function Probe() {
  latestAuth = useAuth();
  return null;
}

function getAuth() {
  if (!latestAuth) {
    throw new Error('Auth context not available.');
  }
  return latestAuth;
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
  });
}

async function unmountRenderer(renderer: ReactTestRenderer) {
  await act(async () => {
    renderer.unmount();
  });
}

async function renderProvider() {
  let renderer: ReactTestRenderer;

  await act(async () => {
    renderer = create(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
  });

  await flushEffects();
  return renderer!;
}

afterEach(() => {
  latestAuth = null;
  vi.clearAllMocks();
});

describe('AuthProvider', () => {
  it('hydrates session and user from the initial getSession result', async () => {
    const mockClient = createMockClient({ initialSession: createSession() });
    supabaseMocks.getSupabaseClient.mockReturnValue(mockClient.client);
    supabaseMocks.getSupabaseConfigError.mockReturnValue(null);

    const renderer = await renderProvider();

    expect(getAuth().isReady).toBe(true);
    expect(getAuth().authError).toBeNull();
    expect(getAuth().session).toEqual(createSession());
    expect(getAuth().user).toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });

    await unmountRenderer(renderer);
  });

  it('surfaces getSession errors as authError and still marks the provider ready', async () => {
    const mockClient = createMockClient({ sessionError: 'session load failed' });
    supabaseMocks.getSupabaseClient.mockReturnValue(mockClient.client);
    supabaseMocks.getSupabaseConfigError.mockReturnValue(null);

    const renderer = await renderProvider();

    expect(getAuth().isReady).toBe(true);
    expect(getAuth().authError).toBe('session load failed');
    expect(getAuth().session).toBeNull();
    expect(getAuth().user).toBeNull();

    await unmountRenderer(renderer);
  });

  it('treats missing Supabase config as ready and exposes the config error', async () => {
    supabaseMocks.getSupabaseClient.mockReturnValue(null);
    supabaseMocks.getSupabaseConfigError.mockReturnValue('Missing Supabase config');

    await renderProvider();

    expect(getAuth().isReady).toBe(true);
    expect(getAuth().authError).toBe('Missing Supabase config');
    expect(getAuth().session).toBeNull();
    expect(getAuth().user).toBeNull();
  });

  it('updates session and user when auth state changes', async () => {
    const mockClient = createMockClient({ initialSession: null });
    supabaseMocks.getSupabaseClient.mockReturnValue(mockClient.client);
    supabaseMocks.getSupabaseConfigError.mockReturnValue(null);

    const renderer = await renderProvider();

    await act(async () => {
      mockClient.emitAuthStateChange(createSession({ id: 'user-2', email: 'next@example.com' }));
    });

    expect(getAuth().authError).toBeNull();
    expect(getAuth().session).toEqual(createSession({ id: 'user-2', email: 'next@example.com' }));
    expect(getAuth().user).toEqual({
      id: 'user-2',
      email: 'next@example.com',
    });

    await unmountRenderer(renderer);
  });

  it('signIn returns success and error results from Supabase', async () => {
    const successClient = createMockClient();
    supabaseMocks.getSupabaseClient.mockReturnValue(successClient.client);
    supabaseMocks.getSupabaseConfigError.mockReturnValue(null);

    const renderer = await renderProvider();

    await expect(getAuth().signIn('user@example.com', 'password123')).resolves.toEqual({ error: null });
    expect(successClient.client.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });

    const errorClient = createMockClient({ signInError: 'invalid credentials' });
    supabaseMocks.getSupabaseClient.mockReturnValue(errorClient.client);

    await expect(getAuth().signIn('user@example.com', 'password123')).resolves.toEqual({
      error: 'invalid credentials',
    });

    await unmountRenderer(renderer);
  });

  it('signUp returns signed_in when Supabase returns a session', async () => {
    const successClient = createMockClient();
    supabaseMocks.getSupabaseClient.mockReturnValue(successClient.client);
    supabaseMocks.getSupabaseConfigError.mockReturnValue(null);

    const renderer = await renderProvider();

    const signedIn = await getAuth().signUp('user@example.com', 'password123');
    expect(signedIn).toEqual({ status: 'signed_in', error: null });
    expect(signedIn.status === 'signed_in' && signedIn.error === null).toBe(true);
    expect(successClient.client.auth.signUp).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });

    await unmountRenderer(renderer);
  });

  it('signUp returns awaiting_confirmation when there is no session', async () => {
    const client = createMockClient({ signUpWithSession: false });
    supabaseMocks.getSupabaseClient.mockReturnValue(client.client);
    supabaseMocks.getSupabaseConfigError.mockReturnValue(null);

    const renderer = await renderProvider();

    await expect(getAuth().signUp('user@example.com', 'password123')).resolves.toEqual({
      status: 'awaiting_confirmation',
      error: null,
    });

    await unmountRenderer(renderer);
  });

  it('signUp returns error when Supabase returns an error', async () => {
    const errorClient = createMockClient({ signUpError: 'account exists' });
    supabaseMocks.getSupabaseClient.mockReturnValue(errorClient.client);
    supabaseMocks.getSupabaseConfigError.mockReturnValue(null);

    const renderer = await renderProvider();

    await expect(getAuth().signUp('user@example.com', 'password123')).resolves.toEqual({
      status: 'error',
      error: 'account exists',
    });

    await unmountRenderer(renderer);
  });

  it('signOut calls the client when present and clears stale auth state when the client is missing', async () => {
    const initialClient = createMockClient({ initialSession: createSession() });
    supabaseMocks.getSupabaseClient
      .mockReturnValueOnce(initialClient.client)
      .mockReturnValueOnce(initialClient.client)
      .mockReturnValueOnce(null);
    supabaseMocks.getSupabaseConfigError.mockReturnValue(null);

    const renderer = await renderProvider();

    await act(async () => {
      await getAuth().signOut();
    });
    expect(initialClient.client.auth.signOut).toHaveBeenCalledTimes(1);
    expect(getAuth().user).toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });

    await act(async () => {
      await getAuth().signOut();
    });
    expect(getAuth().session).toBeNull();
    expect(getAuth().user).toBeNull();

    await unmountRenderer(renderer);
  });

  it('resetPassword returns success and error results and passes the sign-in redirect URL', async () => {
    const successClient = createMockClient();
    supabaseMocks.getSupabaseClient.mockReturnValue(successClient.client);
    supabaseMocks.getSupabaseConfigError.mockReturnValue(null);
    linkingMocks.createURL.mockReturnValue('myapp://sign-in');

    const renderer = await renderProvider();

    await expect(getAuth().resetPassword('user@example.com')).resolves.toEqual({ error: null });
    expect(successClient.client.auth.resetPasswordForEmail).toHaveBeenCalledWith('user@example.com', {
      redirectTo: 'myapp://sign-in',
    });

    const errorClient = createMockClient({ resetPasswordError: 'reset failed' });
    supabaseMocks.getSupabaseClient.mockReturnValue(errorClient.client);

    await expect(getAuth().resetPassword('user@example.com')).resolves.toEqual({
      error: 'reset failed',
    });

    await unmountRenderer(renderer);
  });

  it('unsubscribes the auth listener on unmount', async () => {
    const mockClient = createMockClient();
    supabaseMocks.getSupabaseClient.mockReturnValue(mockClient.client);
    supabaseMocks.getSupabaseConfigError.mockReturnValue(null);

    const renderer = await renderProvider();

    await unmountRenderer(renderer);

    expect(mockClient.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
