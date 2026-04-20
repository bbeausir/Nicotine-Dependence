import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type Language = { code: string; label: string };

// TODO: expand when we add real translations; for now we only ship English.
const AVAILABLE_LANGUAGES: readonly Language[] = [{ code: 'en', label: 'English' }];

export function LanguageButton() {
  const t = getTokens(useColorScheme());
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<string>('en');

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Change language"
        style={[
          styles.codeBadge,
          { borderColor: t.color.border, backgroundColor: t.color.surfaceElevated },
        ]}>
        <Text
          style={[
            styles.codeText,
            { color: t.color.textSecondary, fontFamily: t.typeface.uiSemibold },
          ]}>
          {locale.toUpperCase()}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[
              styles.sheet,
              { backgroundColor: t.color.surfaceElevated, borderColor: t.color.border },
            ]}>
            <Text
              style={[
                styles.heading,
                { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold },
              ]}>
              Language
            </Text>
            {AVAILABLE_LANGUAGES.map((lang) => {
              const selected = lang.code === locale;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => {
                    setLocale(lang.code);
                    setOpen(false);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  style={[
                    styles.row,
                    {
                      borderColor: selected ? t.color.accent : t.color.border,
                      backgroundColor: selected ? t.color.surface : 'transparent',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.rowLabel,
                      { color: t.color.textPrimary, fontFamily: t.typeface.ui },
                    ]}>
                    {lang.label}
                  </Text>
                  {selected ? (
                    <Ionicons name="checkmark" size={18} color={t.color.accent} />
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  codeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  heading: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  rowLabel: {
    fontSize: 16,
  },
});
