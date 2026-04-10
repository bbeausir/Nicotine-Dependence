import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { primaryPatternLabels } from '@/features/onboarding/scoring/patterns';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { track } from '@/lib/analytics/track';
import { useAuth } from '@/providers/AuthProvider';
import { useAssessment } from '@/providers/AssessmentProvider';
import { getTokens } from '@/theme/tokens';

/**
 * Minimal post-auth home (PRD §10.6). TODO(PRODUCT): load profile from Supabase when available.
 */
export default function HomeScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const { user, signOut } = useAuth();
  const { result } = useAssessment();

  useFocusEffect(
    useCallback(() => {
      track(AnalyticsEvents.returnedToDashboard);
    }, []),
  );

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <Text style={[styles.greeting, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
        Welcome back{user?.email ? `, ${user.email}` : ''}.
      </Text>

      {result ? (
        <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
          <Text style={[styles.muted, { color: t.color.accent, fontFamily: t.typeface.uiSemibold }]}>
            Primary pattern
          </Text>
          <Text style={[styles.pattern, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
            {primaryPatternLabels[result.primaryPattern]}
          </Text>
          <Text style={{ color: t.color.textSecondary, fontFamily: t.typeface.ui }}>
            Dependence: {result.dependenceScore} · Reactivity: {result.cravingReactivityLabel} ·
            Regulation: {result.regulationConfidenceLabel}
          </Text>
          <Text style={[styles.focus, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
            {result.weekOneFocus}
          </Text>
        </View>
      ) : (
        <Text style={{ color: t.color.textSecondary, fontFamily: t.typeface.ui }}>
          No saved assessment in this session yet. TODO(DATA): fetch from Supabase.
        </Text>
      )}

      <Link href="/results" asChild>
        <Pressable style={styles.linkPress}>
          <Text style={{ color: t.color.accent, fontFamily: t.typeface.uiSemibold }}>Review results</Text>
        </Pressable>
      </Link>

      <PrimaryButton variant="ghost" onPress={signOut}>
        Sign out
      </PrimaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 16,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  greeting: { fontSize: 28, lineHeight: 34 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    gap: 10,
  },
  muted: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  pattern: { fontSize: 20 },
  focus: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  linkPress: { paddingVertical: 8 },
});
