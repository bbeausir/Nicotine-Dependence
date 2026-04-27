import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type IntroScreenProps = {
  onContinue: () => void;
};

export function IntroScreen({ onContinue }: IntroScreenProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.body}>
        <Text style={[styles.eyebrow, { color: t.color.accent, fontFamily: t.typeface.uiMedium }]}>
          Module 1
        </Text>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          See the Loop Clearly
        </Text>
        <Text style={[styles.subtitle, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Understand why the urge keeps coming back.
        </Text>
        <Text style={[styles.description, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          This is not about blame. It is about seeing the pattern clearly.
        </Text>
      </View>

      <PrimaryButton onPress={onContinue}>Start</PrimaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    gap: 32,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  body: {
    gap: 14,
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
