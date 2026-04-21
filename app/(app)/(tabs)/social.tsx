import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function SocialTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen scroll includeBottomInset={false} contentContainerStyle={styles.content}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>Social</Text>
        <Text style={[styles.body, { color: t.color.textPrimary, fontFamily: t.typeface.ui }]}>
          Social is where encouragement and shared wins will live.
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Community features are coming in a lightweight first pass.
        </Text>
        <Text style={[styles.bodyMuted, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          TODO: Add feed cards, reactions, and accountability nudges.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          onPress={() =>
            Alert.alert('Share a win', 'Soon you will be able to post a win — big or small — and feel the support.')
          }>
          Share a win
        </PrimaryButton>
        <PrimaryButton
          variant="secondary"
          onPress={() =>
            Alert.alert(
              'Encouragement',
              'Sending a kind note to someone else is coming. For now, you are not alone in this tab.',
            )
          }>
          Send encouragement
        </PrimaryButton>
        <PrimaryButton
          variant="ghost"
          onPress={() =>
            Alert.alert(
              'Invite a buddy',
              'Accountability partners help. We will make inviting someone simple and optional.',
            )
          }>
          Invite a buddy
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
