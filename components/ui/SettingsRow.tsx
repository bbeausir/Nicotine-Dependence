import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type SettingsRowProps = {
  icon: string;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  labelColor?: string;
  isLast?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export function SettingsRow({
  icon,
  label,
  onPress,
  showChevron = true,
  labelColor,
  isLast = false,
  disabled = false,
  loading = false,
}: SettingsRowProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={disabled || loading ? undefined : onPress}
        style={({ pressed }) => [
          styles.row,
          { opacity: disabled || loading ? 0.45 : pressed ? 0.7 : 1 },
        ]}>
        <View style={styles.left}>
          <Ionicons name={icon as any} size={20} color={t.color.textSecondary} style={styles.icon} />
          <Text style={[styles.label, { color: labelColor ?? t.color.textPrimary, fontFamily: t.typeface.uiMedium }]}>
            {label}
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={t.color.textMuted} />
        ) : (
          showChevron && <Ionicons name="chevron-forward" size={16} color={t.color.textMuted} />
        )}
      </Pressable>
      {!isLast && <View style={[styles.separator, { backgroundColor: t.color.border }]} />}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 52,
  },
});
