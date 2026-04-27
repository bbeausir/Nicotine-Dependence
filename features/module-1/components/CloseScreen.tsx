import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type CloseScreenProps = {
  onFinish: () => void;
};

export function CloseScreen({ onFinish }: CloseScreenProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.body}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          You have your first insight
        </Text>
        <Text style={[styles.description, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          You do not need to solve everything today. Just notice the loop the next time it starts.
        </Text>
      </View>

      <PrimaryButton onPress={onFinish}>I'm ready</PrimaryButton>
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
    gap: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
