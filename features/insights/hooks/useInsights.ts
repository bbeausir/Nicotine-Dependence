import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

import {
  addInsightEntry,
  createCustomTag,
  getEntryCount,
  getInsightEntries,
  getInsightTags,
  type InsightEntry,
  type InsightTag,
} from '@/lib/database/schema';

let useSQLiteContext: () => any = () => null;
if (Platform.OS !== 'web') {
  const sqliteModule = require('expo-sqlite');
  useSQLiteContext = sqliteModule.useSQLiteContext;
}

const PREDEFINED_TAGS: InsightTag[] = [
  { id: 'belief-shift', name: 'belief-shift', lastUsed: 0 },
  { id: 'clarity', name: 'clarity', lastUsed: 0 },
  { id: 'freedom', name: 'freedom', lastUsed: 0 },
  { id: 'trigger', name: 'trigger', lastUsed: 0 },
];

export function useInsights() {
  const db = Platform.OS !== 'web' ? useSQLiteContext() : null;
  const [entries, setEntries] = useState<InsightEntry[]>([]);
  const [tags, setTags] = useState<InsightTag[]>(PREDEFINED_TAGS);
  const [entryCount, setEntryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      if (!db) {
        setLoading(false);
        return;
      }
      const [loadedEntries, loadedTags, count] = await Promise.all([
        getInsightEntries(db),
        getInsightTags(db),
        getEntryCount(db),
      ]);
      setEntries(loadedEntries);
      setTags(loadedTags);
      setEntryCount(count);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const saveEntry = useCallback(
    async (text: string, tag: string) => {
      try {
        if (!db) throw new Error('Database not initialized');
        const newEntry = await addInsightEntry(db, text, tag);
        setEntries((prev) => [newEntry, ...prev]);
        setEntryCount((prev) => prev + 1);
        return newEntry;
      } catch (error) {
        console.error('Error saving entry:', error);
        throw error;
      }
    },
    [db]
  );

  const addTag = useCallback(
    async (tagName: string) => {
      try {
        if (!db) throw new Error('Database not initialized');
        const newTag = await createCustomTag(db, tagName);
        if (newTag) {
          setTags((prev) => [newTag, ...prev]);
          return newTag;
        }
        return null;
      } catch (error) {
        console.error('Error creating tag:', error);
        throw error;
      }
    },
    [db]
  );

  const filterByTag = useCallback(
    async (tag: string) => {
      if (!db) return;
      if (tag === 'all') {
        await loadData();
      } else {
        try {
          const filtered = await getInsightEntries(db, tag);
          setEntries(filtered);
        } catch (error) {
          console.error('Error filtering entries:', error);
        }
      }
    },
    [db, loadData]
  );

  return {
    entries,
    tags,
    entryCount,
    loading,
    saveEntry,
    addTag,
    filterByTag,
    reload: loadData,
  };
}
