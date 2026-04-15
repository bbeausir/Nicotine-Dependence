import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function PanicTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>SOS</Text>
        <Text style={[styles.body, { color: t.color.textPrimary, fontFamily: t.typeface.ui }]}>
          Panic is your immediate support space during cravings.
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Fast relief tools are being connected now.
        </Text>
        <Text style={[styles.bodyMuted, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          TODO: Add one-tap coping flows, timers, and SOS actions.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          onPress={() =>
            Alert.alert(
              'Grounding',
              'A short guided grounding exercise is coming. If you are in crisis, please reach out to local emergency services or a crisis line.',
            )
          }>
          Start a 2-minute grounding
        </PrimaryButton>
        <PrimaryButton
          variant="secondary"
          onPress={() =>
            Alert.alert(
              'Crisis resources',
              'We will link trusted hotlines and resources here. If you need help right now, use your local emergency number.',
            )
          }>
          Open crisis resources
        </PrimaryButton>
        <PrimaryButton
          variant="ghost"
          onPress={() =>
            Alert.alert(
              'Reach out',
              'Quick access to text someone you trust is on the roadmap. You deserve support.',
            )
          }>
          Text someone you trust
        </PrimaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 24,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  textBlock: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMuted: {
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
});
