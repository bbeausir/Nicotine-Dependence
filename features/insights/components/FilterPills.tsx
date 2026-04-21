import { ScrollView, StyleSheet } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';

const FILTERS = ['All', 'Belief shifts', 'Clarity', 'Freedom', 'Triggers'];

interface FilterPillsProps {
  selected: string;
  onFilterChange: (filter: string) => void;
}

export function FilterPills({ selected, onFilterChange }: FilterPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      scrollEventThrottle={16}>
      {FILTERS.map((filter) => (
        <PrimaryButton
          key={filter}
          variant={selected === filter ? 'primary' : 'secondary'}
          onPress={() => onFilterChange(filter)}
          style={styles.pill}>
          {filter}
        </PrimaryButton>
      ))}
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
    minWidth: 80,
    minHeight: 38,
    paddingHorizontal: 18,
  },
});
