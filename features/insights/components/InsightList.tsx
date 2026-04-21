import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';
import { InsightEntry } from './InsightEntry';
import type { InsightEntry as InsightEntryType } from '@/lib/database/schema';

const RECENT_CUTOFF_DAYS = 7;

type EntryListItem = InsightEntryType & {
  type: 'entry';
  isRecent: boolean;
};

type DividerListItem = {
  type: 'divider';
};

type InsightListItem = EntryListItem | DividerListItem;

interface InsightListProps {
  entries: InsightEntryType[];
  onEndReached?: () => void;
}

export function InsightList({ entries, onEndReached }: InsightListProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  const now = Date.now();
  const recentCutoff = now - RECENT_CUTOFF_DAYS * 24 * 60 * 60 * 1000;

  const recentEntries = entries.filter((e) => e.timestamp > recentCutoff);
  const olderEntries = entries.filter((e) => e.timestamp <= recentCutoff);

  const listData: InsightListItem[] = [
    ...recentEntries.map((e) => ({ ...e, type: 'entry' as const, isRecent: true })),
    ...(olderEntries.length > 0
      ? [
          { type: 'divider' as const },
          ...olderEntries.map((e) => ({ ...e, type: 'entry' as const, isRecent: false })),
        ]
      : []),
  ];

  if (entries.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyIcon, { color: t.color.textMuted }]}>📔</Text>
        <Text style={[styles.emptyTitle, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          This is your record of clarity
        </Text>
        <Text style={[styles.emptyBody, { color: t.color.textPrimary, fontFamily: t.typeface.ui }]}>
          When something becomes clear about nicotine — a realization, a moment of freedom, something that just clicked
          — write it here.
        </Text>
        <Text style={[styles.emptyBody, { color: t.color.textPrimary, fontFamily: t.typeface.ui }]}>
          These are your words. They'll be here whenever you need them.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={listData}
      keyExtractor={(item, index) =>
        item.type === 'divider' ? `divider-${index}` : `${item.id}-${item.timestamp}`
      }
      renderItem={({ item }) => {
        if (item.type === 'divider') {
          return (
            <View style={[styles.dividerContainer, { borderTopColor: t.color.border }]}>
              <Text style={[styles.dividerText, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
                older
              </Text>
            </View>
          );
        }

        return (
          <InsightEntry
            text={item.text}
            tag={item.tag}
            timestamp={item.timestamp}
            isRecent={item.isRecent}
          />
        );
      }}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 104,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 48,
    lineHeight: 56,
  },
  emptyTitle: {
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  dividerText: {
    fontSize: 13,
    lineHeight: 18,
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
