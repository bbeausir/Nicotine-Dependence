import { Link, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { welcomeContent } from '@/features/welcome/content';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { track } from '@/lib/analytics/track';
import { getTokens } from '@/theme/tokens';

export default function WelcomeScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const router = useRouter();

  useEffect(() => {
    track(AnalyticsEvents.landingViewed);
  }, []);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.heroWrap}>
        <Text style={[styles.brand, { color: t.color.accent, fontFamily: t.typeface.uiSemibold }]}>
          {welcomeContent.productName}
        </Text>
        <Text style={[styles.headline, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          {welcomeContent.headline}
        </Text>
        <Text style={[styles.sub, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          {welcomeContent.subheadline}
        </Text>
      </View>

      <View style={styles.bullets}>
        {welcomeContent.bullets.map((line) => (
          <Text key={line} style={[styles.bullet, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
            — {line}
          </Text>
        ))}
      </View>

      <PrimaryButton
        onPress={() => {
          track(AnalyticsEvents.takeAssessmentClicked);
          router.push('/onboarding');
        }}>
        Take Assessment
      </PrimaryButton>

      <Link href="/sign-in" asChild>
        <Pressable
          onPress={() => track(AnalyticsEvents.signInClicked)}
          style={styles.secondaryWrap}>
          <Text style={[styles.secondary, { color: t.color.accent, fontFamily: t.typeface.uiSemibold }]}>
            Sign in
          </Text>
        </Pressable>
      </Link>

      <Text style={[styles.footer, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
        {welcomeContent.footerNote}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'center',
    gap: 20,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  heroWrap: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  brand: {
    fontSize: 13,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  headline: {
    fontSize: 36,
    lineHeight: 42,
    textAlign: 'center',
  },
  sub: {
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 780,
  },
  bullets: {
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 21,
  },
  secondaryWrap: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  secondary: {
    fontSize: 16,
  },
  footer: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 20,
    textAlign: 'center',
  },
});
