import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function HomeTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>Home</Text>
        <Text style={[styles.body, { color: t.color.textPrimary, fontFamily: t.typeface.ui }]}>
          Home is your daily quit progress snapshot.
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          We are wiring this up next so you can check in quickly.
        </Text>
        <Text style={[styles.bodyMuted, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          TODO: Add streak summary, cravings trend, and quick actions.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          onPress={() =>
            Alert.alert(
              'Check-in',
              'Daily check-ins are on the way — a gentle way to notice progress without pressure.',
            )
          }>
          Log a check-in
        </PrimaryButton>
        <PrimaryButton
          variant="secondary"
          onPress={() =>
            Alert.alert(
              "Today's plan",
              "You'll soon see a simple plan for today based on your goals. Hang tight.",
            )
          }>
          {`See today's plan`}
        </PrimaryButton>
        <PrimaryButton
          variant="ghost"
          onPress={() =>
            Alert.alert(
              'Quick wins',
              'Small wins add up. We are adding ideas you can try in under two minutes.',
            )
          }>
          Quick win ideas
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
