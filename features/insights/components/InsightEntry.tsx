import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

interface InsightEntryProps {
  text: string;
  tag: string;
  timestamp: number;
  isRecent: boolean;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTagColor(tag: string, scheme: 'light' | 'dark'): { bg: string; text: string } {
  const colors = {
    light: {
      'belief-shift': { bg: '#c8e6c9', text: '#1b5e20' },
      clarity: { bg: '#b3e5fc', text: '#01579b' },
      freedom: { bg: '#c5e1a5', text: '#33691e' },
      trigger: { bg: '#ffe0b2', text: '#e65100' },
    },
    dark: {
      'belief-shift': { bg: 'rgba(76, 175, 80, 0.25)', text: '#81c784' },
      clarity: { bg: 'rgba(33, 150, 243, 0.25)', text: '#64b5f6' },
      freedom: { bg: 'rgba(156, 204, 101, 0.25)', text: '#aed581' },
      trigger: { bg: 'rgba(255, 152, 0, 0.25)', text: '#ffb74d' },
    },
  };

  return colors[scheme][tag as keyof (typeof colors)[keyof typeof colors]] || colors[scheme]['clarity'];
}

export function InsightEntry({ text, tag, timestamp, isRecent }: InsightEntryProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const tagColor = getTagColor(tag, scheme);
  const dateStr = formatDate(timestamp);
  const [dateLabel, timeLabel] = dateStr.includes(':')
    ? [`Today, ${dateStr}`, '']
    : [dateStr, ''];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isRecent ? (scheme === 'light' ? '#f0f9ff' : 'rgba(33, 150, 243, 0.08)') : t.color.surface,
          borderColor: t.color.border,
          opacity: isRecent ? 1 : 0.75,
        },
      ]}>
      <View style={styles.header}>
        <View style={styles.dateBlock}>
          <Text style={[styles.date, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
            {dateLabel}
          </Text>
          {timeLabel && (
            <Text style={[styles.time, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
              {timeLabel}
            </Text>
          )}
        </View>
        <View style={[styles.tagBadge, { backgroundColor: tagColor.bg }]}>
          <Text style={[styles.tagText, { color: tagColor.text, fontFamily: t.typeface.ui }]}>
            {tag.replace('-', ' ')}
          </Text>
        </View>
      </View>

      <Text style={[styles.text, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateBlock: {
    gap: 2,
  },
  date: {
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    lineHeight: 16,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
