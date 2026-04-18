import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function NotificationsSettingsScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Notification preferences
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Gentle reminders that support you — not shame you. Notification controls are coming soon.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
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
});
