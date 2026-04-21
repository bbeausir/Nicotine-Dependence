import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  includeBottomInset?: boolean;
}>;

/**
 * Safe-area shell + optional scroll. Use for full-screen pages.
 * Includes a subtle top gradient and soft gold ambient glow (dark theme).
 */
export function Screen({ children, scroll, style, contentContainerStyle, includeBottomInset = true }: ScreenProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const rootStyle: ViewStyle = { flex: 1, backgroundColor: t.color.background };
  const safeAreaEdges: Edge[] = includeBottomInset ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right'];

  const ambient = (
    <View style={styles.ambient} pointerEvents="none">
      <LinearGradient
        colors={[t.color.backgroundGradientTop, t.color.background]}
        locations={[0, 0.55]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.blob, styles.blobLeft, { backgroundColor: t.color.glowAccent }]} />
      <View style={[styles.blob, styles.blobRight, { backgroundColor: t.color.glowAccent }]} />
    </View>
  );

  if (scroll) {
    return (
      <SafeAreaView style={[rootStyle, style]} edges={safeAreaEdges}>
        {ambient}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[rootStyle, styles.flex, style]} edges={safeAreaEdges}>
      {ambient}
      <View style={styles.flex}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  ambient: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  blobLeft: {
    top: '12%',
    left: '-28%',
  },
  blobRight: {
    bottom: '8%',
    right: '-26%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});
