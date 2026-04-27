import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

import { ProgressIndicator } from './ProgressIndicator';

type BaseProps = {
  title: string;
  prompt: string;
  options: readonly string[];
  onContinue: () => void;
  step: number;
  totalSteps: number;
  capitalizeOptions?: boolean;
};

type SingleProps = BaseProps & {
  mode: 'single';
  selected: string | null;
  onSelect: (selection: string) => void;
};

type MultiProps = BaseProps & {
  mode: 'multi';
  maxSelections: number;
  selected: string[];
  onSelect: (selections: string[]) => void;
};

export type SelectScreenProps = SingleProps | MultiProps;

export function SelectScreen(props: SelectScreenProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  const isOptionSelected = (option: string) =>
    props.mode === 'single' ? props.selected === option : props.selected.includes(option);

  const handleToggle = (option: string) => {
    if (props.mode === 'single') {
      props.onSelect(option);
      return;
    }

    const current = props.selected;
    if (current.includes(option)) {
      props.onSelect(current.filter((s) => s !== option));
    } else if (current.length < props.maxSelections) {
      props.onSelect([...current, option]);
    }
  };

  const isComplete = props.mode === 'single' ? props.selected !== null : props.selected.length > 0;

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <ProgressIndicator step={props.step} total={props.totalSteps} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          {props.title}
        </Text>
        <Text style={[styles.prompt, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          {props.prompt}
        </Text>
      </View>

      <View style={styles.options}>
        {props.options.map((option) => {
          const isSelected = isOptionSelected(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => handleToggle(option)}
              activeOpacity={0.7}
              accessibilityRole={props.mode === 'single' ? 'radio' : 'checkbox'}
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? t.color.accent : t.color.surface,
                  borderColor: isSelected ? t.color.accent : t.color.border,
                },
              ]}>
              <Text
                style={[
                  styles.optionText,
                  props.capitalizeOptions && styles.optionTextCapitalize,
                  {
                    color: isSelected ? '#ffffff' : t.color.textPrimary,
                    fontFamily: isSelected ? t.typeface.uiMedium : t.typeface.ui,
                  },
                ]}>
                {option}
              </Text>
              {isSelected && <Ionicons name="checkmark" size={20} color="#ffffff" />}
            </TouchableOpacity>
          );
        })}
      </View>

      {props.mode === 'multi' && (
        <Text style={[styles.counter, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
          {props.selected.length} of {props.maxSelections} selected
        </Text>
      )}

      <PrimaryButton onPress={props.onContinue} disabled={!isComplete}>
        Continue
      </PrimaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
    flexGrow: 1,
  },
  header: {
    gap: 10,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
  },
  prompt: {
    fontSize: 15,
    lineHeight: 22,
  },
  options: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  optionTextCapitalize: {
    textTransform: 'capitalize',
  },
  counter: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
