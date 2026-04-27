import { Platform } from 'react-native';
import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Cross-platform wrapper around `useSQLiteContext`.
 *
 * `expo-sqlite` doesn't bundle on web (it pulls in a wasm asset Metro can't
 * resolve), and a `Platform.OS === 'web' ? useSQLiteContext() : null` ternary
 * is technically a conditional hook call. This wrapper resolves both at
 * module-load time so the React tree always calls the same hook in the same
 * order, while web just gets `null`.
 */
let useSQLiteContextImpl: () => SQLiteDatabase | null;

if (Platform.OS === 'web') {
  useSQLiteContextImpl = () => null;
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  useSQLiteContextImpl = require('expo-sqlite').useSQLiteContext;
}

export function useDb(): SQLiteDatabase | null {
  return useSQLiteContextImpl();
}
