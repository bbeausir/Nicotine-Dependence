import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Linking from 'expo-linking';
import type { Session, User } from '@supabase/supabase-js';

import { getSupabaseClient, getSupabaseConfigError } from '@/lib/supabase/client';
import { getAssessmentStorage } from '@/lib/storage/assessmentStorage';
import { ensureProfile } from '@/lib/repositories/profiles';

const ASSESSMENT_STORAGE_KEYS = [
  'nicotine.assessment.session.v1',
  'nicotine.onboardingDraft.v1',
];

export type AuthUser = {
  id: string;
  email: string;
};

type AuthResult = {
  error: string | null;
};

export type SignUpResult =
  | { status: 'signed_in'; error: null }
  | { status: 'awaiting_confirmation'; error: null }
  | { status: 'error'; error: string };

type AuthContextValue = {
  user: AuthUser | null;
  session: Session | null;
  authError: string | null;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapUser(user: User | null): AuthUser | null {
  if (!user?.email) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const client = getSupabaseClient();
    const missingConfigError = getSupabaseConfigError();

    if (!client) {
      setAuthError(missingConfigError);
      setIsReady(true);
      return;
    }

    let active = true;
    client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setAuthError(error.message);
          setSession(null);
          setUser(null);
          return;
        }

        setSession(data.session);
        setUser(mapUser(data.session?.user ?? null));
      })
      .finally(() => {
        if (active) {
          setIsReady(true);
        }
      });

    const { data: subscription } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setAuthError(null);
      setSession(nextSession);
      setUser(mapUser(nextSession?.user ?? null));
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const client = getSupabaseClient();
    if (!client) return;
    // Trigger auto-creates profiles for new sign-ups; this covers users
    // that existed before the trigger migration. Safe to call repeatedly.
    void ensureProfile(client, user.id);
  }, [user?.id]);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const client = getSupabaseClient();
    if (!client) {
      const configError = getSupabaseConfigError();
      setAuthError(configError);
      return { error: configError };
    }

    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    setAuthError(null);
    return { error: null };
  };

  const signUp = async (email: string, password: string): Promise<SignUpResult> => {
    const client = getSupabaseClient();
    if (!client) {
      const configError = getSupabaseConfigError() ?? 'Supabase is not configured.';
      setAuthError(configError);
      return { status: 'error', error: configError };
    }

    const { data, error } = await client.auth.signUp({ email, password });
    if (error) {
      return { status: 'error', error: error.message };
    }
    setAuthError(null);
    if (data.session) {
      return { status: 'signed_in', error: null };
    }
    return { status: 'awaiting_confirmation', error: null };
  };

  const signOut = async (): Promise<{ error: string | null }> => {
    const client = getSupabaseClient();
    const localStorageClear = async () => {
      const storage = getAssessmentStorage();
      await Promise.allSettled(ASSESSMENT_STORAGE_KEYS.map((k) => storage.removeItem(k)));
    };
    if (!client) {
      await localStorageClear();
      setSession(null);
      setUser(null);
      return { error: null };
    }
    try {
      const { error } = await client.auth.signOut();
      await localStorageClear();
      if (error) return { error: error.message };
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Sign out failed' };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    const client = getSupabaseClient();
    if (!client) {
      const configError = getSupabaseConfigError();
      setAuthError(configError);
      return { error: configError };
    }

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL('/sign-in'),
    });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      authError,
      isReady,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }),
    [user, session, authError, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
