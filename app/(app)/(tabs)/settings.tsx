import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function SettingsTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Settings
        </Text>
        <Text style={[styles.body, { color: t.color.textPrimary, fontFamily: t.typeface.ui }]}>
          Settings is where you personalize your quit journey.
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Account and app preferences are coming soon.
        </Text>
        <Text style={[styles.bodyMuted, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          TODO: Add profile, notification, privacy, and reset controls.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          onPress={() =>
            Alert.alert('Profile', 'Editing your profile will live here — name, goals, and what helps you stay quit.')
          }>
          Edit profile
        </PrimaryButton>
        <PrimaryButton
          variant="secondary"
          onPress={() =>
            Alert.alert(
              'Notifications',
              'You will be able to choose gentle reminders that support you, not shame you.',
            )
          }>
          Notification preferences
        </PrimaryButton>
        <PrimaryButton
          variant="ghost"
          onPress={() =>
            Alert.alert(
              'Privacy & data',
              'Clear privacy controls are coming so you always know what is stored and why.',
            )
          }>
          Privacy & data
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
