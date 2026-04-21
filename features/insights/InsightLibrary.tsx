import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';
import { useInsights } from './hooks/useInsights';
import { FilterPills } from './components/FilterPills';
import { InsightList } from './components/InsightList';
import { InsightInput } from './components/InsightInput';

const TAG_TO_FILTER: Record<string, string> = {
  All: 'all',
  'Belief shifts': 'belief-shift',
  Clarity: 'clarity',
  Freedom: 'freedom',
  Triggers: 'trigger',
};

export function InsightLibrary() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const { entries, tags, entryCount, loading, saveEntry, addTag, filterByTag } = useInsights();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [inputVisible, setInputVisible] = useState(false);

  const handleFilterChange = useCallback(
    (filter: string) => {
      setSelectedFilter(filter);
      filterByTag(TAG_TO_FILTER[filter]);
    },
    [filterByTag]
  );

  const handleSaveEntry = useCallback(
    async (text: string, tag: string) => {
      await saveEntry(text, tag);
    },
    [saveEntry]
  );

  const handleAddTag = useCallback(
    async (tagName: string) => {
      return addTag(tagName);
    },
    [addTag]
  );

  return (
    <>
      <Screen style={styles.screen}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: t.color.border }]}>
          <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
            Insight library
          </Text>
          <Text style={[styles.count, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
            {entryCount} {entryCount === 1 ? 'insight' : 'insights'}
          </Text>
        </View>

        {/* Filter pills */}
        <FilterPills selected={selectedFilter} onFilterChange={handleFilterChange} />

        {/* Entry list */}
        <View style={styles.listContainer}>
          <InsightList entries={entries} />
        </View>
      </Screen>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#000000' }]}
        onPress={() => setInputVisible(true)}
        activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Input modal */}
      <InsightInput
        visible={inputVisible}
        tags={tags}
        onSave={handleSaveEntry}
        onCreateTag={handleAddTag}
        onDismiss={() => setInputVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  count: {
    fontSize: 14,
    lineHeight: 20,
  },
  listContainer: {
    flex: 1,
    paddingTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 28,
    lineHeight: 32,
    color: '#ffffff',
    fontWeight: '300',
  },
});
