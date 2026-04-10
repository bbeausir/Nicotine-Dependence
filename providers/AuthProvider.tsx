import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * TODO(DATA): Replace with Supabase session — persist session, expose user, signIn/signOut.
 * Scaffold: local boolean only so routes can be wired before backend exists.
 */

export type AuthUser = {
  id: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  /** True once we know session state (Supabase getSession finished). */
  isReady: boolean;
  signOut: () => void;
  /** Dev-only helper until Supabase is wired */
  __devSetUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'nicotine.auth.user.v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          setUser(JSON.parse(raw) as AuthUser);
        }
      } catch {
        // keep null user if storage is unavailable/corrupt
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistUser = (nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (nextUser) {
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      void AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      signOut: () => persistUser(null),
      __devSetUser: persistUser,
    }),
    [user, isReady],
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
