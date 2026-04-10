import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

/**
 * TODO(DATA): Supabase password reset email flow.
 */
export default function ForgotPasswordScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Forgot password
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          TODO(DATA): Collect email and call Supabase reset API.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    gap: 14,
  },
  title: { fontSize: 28 },
  body: { fontSize: 15, lineHeight: 22 },
});
