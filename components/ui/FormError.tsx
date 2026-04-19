import { StyleSheet, Text } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export function FormError({ message }: { message: string | null }) {
  const t = getTokens(useColorScheme());
  if (!message) return null;
  return (
    <Text style={[styles.text, { color: t.color.danger, fontFamily: t.typeface.ui }]}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 13, lineHeight: 18 },
});
