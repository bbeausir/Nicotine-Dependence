import * as SecureStore from 'expo-secure-store';

/** Stay under Expo SecureStore per-value limits (~2048 bytes on iOS). */
export const SECURE_STORE_CHUNK_SIZE = 1800;

const META_SUFFIX = '.__sb_auth_meta';

function metaKey(storageKey: string) {
  return `${storageKey}${META_SUFFIX}`;
}

function chunkKey(storageKey: string, index: number) {
  return `${storageKey}.__sb_auth_c.${index}`;
}

async function deleteChunks(storageKey: string, count: number) {
  await Promise.all(
    Array.from({ length: count }, (_, i) => SecureStore.deleteItemAsync(chunkKey(storageKey, i))),
  );
}

async function removeItemInternal(storageKey: string): Promise<void> {
  const rawMeta = await SecureStore.getItemAsync(metaKey(storageKey));
  if (rawMeta !== null) {
    const count = Number.parseInt(rawMeta, 10);
    if (Number.isFinite(count) && count >= 1) {
      await deleteChunks(storageKey, count);
    }
    await SecureStore.deleteItemAsync(metaKey(storageKey));
  }
}

/**
 * Async storage adapter for Supabase auth on native: values may exceed SecureStore
 * single-value limits, so large payloads are split across multiple keys.
 */
export function createChunkedSecureStoreAdapter() {
  return {
    async getItem(storageKey: string): Promise<string | null> {
      const rawMeta = await SecureStore.getItemAsync(metaKey(storageKey));
      if (rawMeta === null) {
        return null;
      }

      const count = Number.parseInt(rawMeta, 10);
      if (!Number.isFinite(count) || count < 1) {
        return null;
      }

      const parts: string[] = [];
      for (let i = 0; i < count; i += 1) {
        const part = await SecureStore.getItemAsync(chunkKey(storageKey, i));
        if (part === null) {
          return null;
        }
        parts.push(part);
      }
      return parts.join('');
    },

    async setItem(storageKey: string, value: string): Promise<void> {
      await removeItemInternal(storageKey);

      const chunks: string[] = [];
      for (let i = 0; i < value.length; i += SECURE_STORE_CHUNK_SIZE) {
        chunks.push(value.slice(i, i + SECURE_STORE_CHUNK_SIZE));
      }
      if (chunks.length === 0) {
        chunks.push('');
      }

      await SecureStore.setItemAsync(metaKey(storageKey), String(chunks.length));
      await Promise.all(
        chunks.map((chunk, index) => SecureStore.setItemAsync(chunkKey(storageKey, index), chunk)),
      );
    },

    removeItem: removeItemInternal,
  };
}
