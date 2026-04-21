import { Link, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { primaryPatternLabels } from '@/features/onboarding/scoring/patterns';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { track } from '@/lib/analytics/track';
import { useAuth } from '@/providers/AuthProvider';
import { useAssessment } from '@/providers/AssessmentProvider';
import { getTokens, type ThemeTokens } from '@/theme/tokens';

/**
 * TODO(PRODUCT): Full results layout per PRD §10.5; disclaimer styling; save semantics.
 */
export default function ResultsScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const { result } = useAssessment();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (result) {
      track(AnalyticsEvents.resultsViewed);
    }
  }, [result]);

  if (!result) {
    return (
      <Screen scroll contentContainerStyle={styles.content}>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          {user
            ? 'No saved results yet. You can head home or take the optional assessment anytime.'
            : 'No results yet. Take the assessment first.'}
        </Text>
        <PrimaryButton
          onPress={() => router.replace(user ? '/home' : '/onboarding')}>
          {user ? 'Go to home' : 'Go to assessment'}
        </PrimaryButton>
      </Screen>
    );
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <Text style={[styles.kicker, { color: t.color.accent, fontFamily: t.typeface.uiSemibold }]}>Your pattern</Text>
      <Text style={[styles.headline, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
        {primaryPatternLabels[result.primaryPattern]}
      </Text>

      <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
        <ScoreRow label="Dependence" value={`${result.dependenceScore}`} tokens={t} />
        <ScoreRow label="Dependence level" value={result.dependenceBand} tokens={t} />
      </View>

      <Text style={[styles.sectionTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
        What&apos;s driving use
      </Text>
      <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
        {result.driverSummary}
      </Text>

      <Text style={[styles.sectionTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
        First win
      </Text>
      <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
        {result.firstWinSummary}
      </Text>

      <Text style={[styles.sectionTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
        Week 1 focus
      </Text>
      <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
        {result.weekOneFocus}
      </Text>

      <Text style={[styles.disclaimer, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
        Indication only—not a medical diagnosis. For awareness and behavior support.
      </Text>

      <PrimaryButton
        onPress={() => {
          track(AnalyticsEvents.saveResultsClicked);
          if (user) {
            router.replace('/home');
          } else {
            router.push('/sign-up');
          }
        }}>
        {user ? 'Continue to home' : 'Create account to save'}
      </PrimaryButton>

      {!user ? (
        <Link href="/sign-in" asChild>
          <Pressable style={styles.linkPress}>
            <Text style={{ color: t.color.accent, fontFamily: t.typeface.uiSemibold }}>
              Already have an account? Sign in
            </Text>
          </Pressable>
        </Link>
      ) : null}
    </Screen>
  );
}

function ScoreRow({ label, value, tokens }: { label: string; value: string; tokens: ThemeTokens }) {
  return (
    <View style={styles.row}>
      <Text style={{ color: tokens.color.textSecondary, fontFamily: tokens.typeface.ui }}>{label}</Text>
      <Text style={{ color: tokens.color.textPrimary, fontFamily: tokens.typeface.uiSemibold }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 14,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  kicker: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  headline: { fontSize: 32, lineHeight: 38, marginBottom: 10 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 18, marginTop: 10 },
  body: { fontSize: 15, lineHeight: 22 },
  disclaimer: { fontSize: 12, lineHeight: 18, marginTop: 8 },
  linkPress: { alignItems: 'center', paddingVertical: 8 },
});
