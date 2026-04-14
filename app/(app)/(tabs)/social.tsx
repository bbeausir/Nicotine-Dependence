import { Text } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { Screen } from '@/components/ui/Screen';
import { getTokens } from '@/theme/tokens';

export default function SocialTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: t.color.textPrimary }}>Social is where encouragement and shared wins will live.</Text>
      <Text style={{ color: t.color.textSecondary }}>Community features are coming in a lightweight first pass.</Text>
      <Text style={{ color: t.color.textSecondary }}>TODO: Add feed cards, reactions, and accountability nudges.</Text>
    </Screen>
  );
}
