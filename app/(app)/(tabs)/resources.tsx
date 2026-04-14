import { Text } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { Screen } from '@/components/ui/Screen';
import { getTokens } from '@/theme/tokens';

export default function ResourcesTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: t.color.textPrimary }}>Resources will organize trusted quit-help content.</Text>
      <Text style={{ color: t.color.textSecondary }}>We are curating practical guides you can use right away.</Text>
      <Text style={{ color: t.color.textSecondary }}>TODO: Add categorized articles, tools, and local support links.</Text>
    </Screen>
  );
}
