import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type StatsCardProps = {
  daysNicotineFree: number;
  moneySaved: number;
};

export function StatsCard({ daysNicotineFree, moneySaved }: StatsCardProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
      <View style={styles.stat}>
        <Text style={[styles.statLabel, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Days Nicotine Free:
        </Text>
        <Text style={[styles.statValue, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          {daysNicotineFree}
        </Text>
      </View>
      <View style={[styles.divider, { backgroundColor: t.color.border }]} />
      <View style={styles.stat}>
        <Text style={[styles.statLabel, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Money Saved:
        </Text>
        <Text style={[styles.statValue, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          ${moneySaved.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 13,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 28,
    lineHeight: 34,
  },
  divider: {
    width: 1,
    height: 48,
    marginHorizontal: 8,
  },
});
