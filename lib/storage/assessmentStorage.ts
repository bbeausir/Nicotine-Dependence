import AsyncStorage from '@react-native-async-storage/async-storage';

import { createChunkedSecureStoreAdapter } from '@/lib/supabase/secureAuthStorage';

/** Avoid importing `react-native` here so Node/Vitest can load this module without RN's Flow entry. */
function isExpoWeb(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof (document as { createElement?: unknown }).createElement === 'function'
  );
}

export function getAssessmentStorage() {
  if (isExpoWeb()) {
    return AsyncStorage;
  }
  return createChunkedSecureStoreAdapter();
}
