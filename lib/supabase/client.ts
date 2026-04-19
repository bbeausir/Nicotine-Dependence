import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase/database.types';
import { createChunkedSecureStoreAdapter } from '@/lib/supabase/secureAuthStorage';

export type AppSupabaseClient = SupabaseClient<Database>;

let client: AppSupabaseClient | null = null;

/** Avoid importing `react-native` here so Node/Vitest can load this module without RN's Flow entry. */
function isExpoWeb(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof (document as { createElement?: unknown }).createElement === 'function'
  );
}

function getAuthStorage() {
  if (isExpoWeb()) {
    return AsyncStorage;
  }
  return createChunkedSecureStoreAdapter();
}

function readSupabaseEnv() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anonKey };
}

export function getSupabaseConfigError(): string | null {
  const { url, anonKey } = readSupabaseEnv();
  if (url && anonKey) {
    return null;
  }

  return 'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.';
}

export function getSupabaseClient(): AppSupabaseClient | null {
  if (client) {
    return client;
  }

  const { url, anonKey } = readSupabaseEnv();
  if (!url || !anonKey) {
    return null;
  }

  client = createClient<Database>(url, anonKey, {
    auth: {
      storage: getAuthStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return client;
}
