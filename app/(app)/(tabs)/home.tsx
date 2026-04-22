import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Polyline, Rect } from 'react-native-svg';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { LogCravingSheet } from '@/features/home/components/LogCravingSheet';
import { useQuitStats } from '@/features/home/useQuitStats';
import { useProfile } from '@/features/profile/useProfile';
import { getTokens } from '@/theme/tokens';

const RING_SIZE = 200;
const RING_STROKE = 10;

function formatMoney(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function HomeTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { profile, isLoading } = useProfile();
  const stats = useQuitStats(profile?.quit_date ?? null, profile?.daily_cost ?? null);

  const firstName = profile?.display_name?.trim().split(/\s+/)[0] ?? '';
  const greeting = firstName ? `Hi, ${firstName}` : 'Hi there';

  const center = RING_SIZE / 2;
  const r = (RING_SIZE - RING_STROKE) / 2;

  const heroPrimary =
    stats === null
      ? '—'
      : stats.stage === 'countdown'
        ? String(stats.daysUntilQuit)
        : String(stats.daysFree);
  const heroUnit = stats?.stage === 'countdown' ? 'days to go' : 'days';
  const heroLabel =
    stats === null
      ? 'Set your quit date to start tracking'
      : stats.stage === 'countdown'
        ? 'Until your quit date'
        : 'Days Nicotine Free';

  const moneyText =
    stats?.moneySaved !== undefined && stats?.moneySaved !== null
      ? formatMoney(stats.moneySaved)
      : '—';
  const milestoneText = stats?.nextMilestone
    ? `${stats.nextMilestone.daysAway} ${stats.nextMilestone.daysAway === 1 ? 'Day' : 'Days'} to ${stats.nextMilestone.label}`
    : stats?.stage === 'free'
      ? 'You’ve passed every milestone'
      : '—';

  return (
    <Screen scroll includeBottomInset={false} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          {greeting}
        </Text>
        <Text style={[styles.subgreeting, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          {stats?.stage === 'countdown' ? 'Almost there.' : 'Every day matters.'}
        </Text>
      </View>

      {/* Hero ring */}
      <View style={styles.ringWrap}>
        <View style={styles.ringGlow}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={center}
              cy={center}
              r={r}
              stroke={t.color.accent}
              strokeWidth={RING_STROKE}
              fill="none"
              opacity={0.18}
            />
            <Circle
              cx={center}
              cy={center}
              r={r}
              stroke={t.color.accent}
              strokeWidth={RING_STROKE - 3}
              fill="none"
            />
          </Svg>
        </View>
        <View style={[StyleSheet.absoluteFill, styles.ringCenter]} pointerEvents="none">
          {isLoading ? (
            <ActivityIndicator color={t.color.textMuted} />
          ) : (
            <>
              <View style={styles.dayRow}>
                <Text style={[styles.dayCount, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
                  {heroPrimary}
                </Text>
                {stats !== null ? (
                  <Text style={[styles.dayUnit, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
                    {' '}{heroUnit}
                  </Text>
                ) : null}
              </View>
              <Text
                style={[styles.dayLabel, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}
                numberOfLines={2}>
                {heroLabel}
              </Text>
            </>
          )}
        </View>
      </View>

      {stats === null && !isLoading ? (
        <PrimaryButton onPress={() => router.push('/settings/profile')} variant="secondary">
          Set quit date
        </PrimaryButton>
      ) : null}

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
          <Text style={[styles.statTitle, { color: t.color.textSecondary, fontFamily: t.typeface.uiMedium }]}>
            $ Money Saved
          </Text>
          <Text style={[styles.statValue, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
            {moneyText}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
          <Text style={[styles.statTitle, { color: t.color.textSecondary, fontFamily: t.typeface.uiMedium }]}>
            ◎ Next Milestone
          </Text>
          <Text style={[styles.statValueSmall, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
            {milestoneText}
          </Text>
        </View>
      </View>

      {/* Urge Trend card */}
      <View style={[styles.trendCard, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
        <View style={styles.trendHeader}>
          <Text style={[styles.trendIcon, { color: t.color.accent }]}>↗</Text>
          <Text style={[styles.trendTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
            Urge Trend
          </Text>
          <View style={styles.trendHeaderRight}>
            <Text style={[styles.trendLevel, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
              Moderate
            </Text>
            <Text style={[styles.trendChevron, { color: t.color.textMuted }]}>›</Text>
          </View>
        </View>

        <View style={[styles.chartRow, { borderTopColor: t.color.border }]}>
          {/* Line chart */}
          <View style={styles.chartHalf}>
            <Svg width="100%" height={56} viewBox="0 0 120 56">
              <Polyline
                points="0,50 20,42 40,38 60,30 80,22 100,14 120,8"
                fill="none"
                stroke={t.color.textMuted}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <View style={[styles.chartDivider, { backgroundColor: t.color.border }]} />

          {/* Bar chart */}
          <View style={styles.chartHalf}>
            <Svg width="100%" height={56} viewBox="0 0 120 56">
              {[
                [5, 20], [20, 34], [35, 26],
                [50, 44], [65, 36], [80, 50],
                [95, 40], [110, 46],
              ].map(([x, h], i) => (
                <Rect
                  key={i}
                  x={x}
                  y={56 - h}
                  width={10}
                  height={h}
                  rx={3}
                  fill={t.color.textMuted}
                />
              ))}
            </Svg>
          </View>
        </View>

      </View>

      {/* CTA */}
      <PrimaryButton onPress={() => setSheetOpen(true)}>Log a Craving</PrimaryButton>

      <LogCravingSheet visible={sheetOpen} onDismiss={() => setSheetOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 20,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  greeting: {
    fontSize: 28,
    lineHeight: 34,
  },
  subgreeting: {
    fontSize: 15,
    lineHeight: 22,
  },
  ringWrap: {
    alignSelf: 'center',
    width: RING_SIZE,
    height: RING_SIZE,
  },
  ringGlow: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  ringCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  dayCount: {
    fontSize: 52,
    lineHeight: 58,
  },
  dayUnit: {
    fontSize: 18,
    lineHeight: 30,
    paddingBottom: 6,
  },
  dayLabel: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  statTitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  statValue: {
    fontSize: 22,
    lineHeight: 28,
  },
  statValueSmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  trendCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  trendHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 'auto',
  },
  trendIcon: {
    fontSize: 18,
  },
  trendTitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  chartRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  chartHalf: {
    flex: 1,
    paddingHorizontal: 4,
  },
  chartDivider: {
    width: 1,
    alignSelf: 'stretch',
  },
  trendLevel: {
    fontSize: 13,
    lineHeight: 18,
  },
  trendChevron: {
    fontSize: 18,
    lineHeight: 20,
  },
});
