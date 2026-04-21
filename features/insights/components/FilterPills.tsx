import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

const FILTERS = ['All', 'Belief shifts', 'Clarity', 'Freedom', 'Triggers'];

interface FilterPillsProps {
  selected: string;
  onFilterChange: (filter: string) => void;
}

export function FilterPills({ selected, onFilterChange }: FilterPillsProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      scrollEventThrottle={16}>
      {FILTERS.map((filter) => {
        const isSelected = selected === filter;

        return (
          <Pressable
            key={filter}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onFilterChange(filter)}
            style={({ pressed }) => [
              styles.pill,
              {
                backgroundColor: isSelected ? t.color.accent : t.color.surfaceElevated,
                borderColor: isSelected ? 'rgba(255, 255, 255, 0.28)' : t.color.border,
                opacity: pressed ? 0.88 : 1,
              },
            ]}>
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color: isSelected ? '#ffffff' : t.color.textPrimary,
                  fontFamily: t.typeface.uiSemibold,
                },
              ]}>
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pill: {
    height: 34,
    minWidth: 64,
    flexShrink: 0,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
  },
});
