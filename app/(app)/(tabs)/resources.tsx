import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import type { ResourceIllustrationId } from '@/features/resources/content';
import { resourcesContent } from '@/features/resources/content';
import { ResourceIllustration } from '@/features/resources/illustrations';
import type { ColorSchemeName } from '@/theme/tokens';
import { getTokens } from '@/theme/tokens';
import { useModule1Status } from '@/features/module-1/hooks/useModule1Status';

// ─── helpers ─────────────────────────────────────────────────────────────────
function alpha(hex: string, opacity: number): string {
  const a = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}

// ─── WavesIcon — three wavy lines matching the mockup ────────────────────────
function WavesIcon({ color, size = 20 }: { color: string; size?: number }) {
  // One smooth S-curve per line: hump up on left half, hump down on right half
  const wave = (cy: number) =>
    `M2 ${cy} C5.5 ${cy - 2.5} 9.5 ${cy - 2.5} 12 ${cy} C14.5 ${cy + 2.5} 18.5 ${cy + 2.5} 22 ${cy}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={wave(6)}  stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d={wave(12)} stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d={wave(18)} stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
type SectionHeaderProps = {
  iconComponent: React.ReactNode;
  title: string;
  scheme: ColorSchemeName;
};

function SectionHeader({ iconComponent, title, scheme }: SectionHeaderProps) {
  const t = getTokens(scheme);
  return (
    <View style={styles.sectionHeader}>
      {iconComponent}
      <Text style={[styles.sectionTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
        {title}
      </Text>
    </View>
  );
}

// ─── ArrowCircle ─────────────────────────────────────────────────────────────
function ArrowCircle({ accent, size = 32 }: { accent: string; size?: number }) {
  return (
    <View style={[styles.arrowCircle, { backgroundColor: accent, width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name="arrow-forward" size={size * 0.45} color="#ffffff" />
    </View>
  );
}

// ─── UnderstandCard ───────────────────────────────────────────────────────────
type UnderstandCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  cta: string;
  illustration?: ResourceIllustrationId;
  accent: string;
  cardBg: string;
  scheme: ColorSchemeName;
  onPress: () => void;
};

function UnderstandCard({
  icon,
  title,
  description,
  cta,
  illustration,
  accent,
  cardBg,
  scheme,
  onPress,
}: UnderstandCardProps) {
  const t = getTokens(scheme);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.understandCard, { backgroundColor: cardBg, borderColor: t.color.border }]}>
      {illustration ? (
        <View style={styles.understandThumbnail}>
          <ResourceIllustration id={illustration} width={220} height={110} />
        </View>
      ) : (
        <View style={[styles.understandIconArea, { backgroundColor: alpha(accent, 0.12) }]}>
          <Ionicons name={icon} size={44} color={accent} />
        </View>
      )}
      <View style={styles.understandBody}>
        <Text style={[styles.cardTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
          {title}
        </Text>
        <Text style={[styles.cardDesc, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          {description}
        </Text>
        <View style={styles.ctaRow}>
          <Text style={[styles.ctaText, { color: accent, fontFamily: t.typeface.uiMedium }]}>{cta}</Text>
          <ArrowCircle accent={accent} size={30} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── ShiftCard ────────────────────────────────────────────────────────────────
type ShiftCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  duration: string;
  illustration?: ResourceIllustrationId;
  accent: string;
  cardBg: string;
  scheme: ColorSchemeName;
  onPress: () => void;
};

function ShiftCard({
  icon,
  title,
  description,
  duration,
  illustration,
  accent,
  cardBg,
  scheme,
  onPress,
}: ShiftCardProps) {
  const t = getTokens(scheme);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.shiftCard, { backgroundColor: cardBg, borderColor: t.color.border }]}>
      {illustration ? (
        <View style={styles.shiftThumbnail}>
          <ResourceIllustration id={illustration} width={52} height={52} rounded={26} />
        </View>
      ) : (
        <View style={[styles.shiftIconCircle, { backgroundColor: alpha(accent, 0.14) }]}>
          <Ionicons name={icon} size={26} color={accent} />
        </View>
      )}
      <Text style={[styles.shiftTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
        {title}
      </Text>
      <Text style={[styles.shiftDesc, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
        {description}
      </Text>
      <View style={styles.shiftFooter}>
        <Text style={[styles.durationTag, { color: accent, fontFamily: t.typeface.uiMedium }]}>{duration}</Text>
        <ArrowCircle accent={accent} size={28} />
      </View>
    </TouchableOpacity>
  );
}

// ─── ModuleCard ───────────────────────────────────────────────────────────────
type ModuleCardProps = {
  title: string;
  description: string;
  lessonsCompleted: number;
  totalLessons: number;
  isCompleted: boolean;
  illustration: ResourceIllustrationId;
  accent: string;
  scheme: ColorSchemeName;
  onPress: () => void;
};

function ModuleCard({
  title,
  description,
  lessonsCompleted,
  totalLessons,
  isCompleted,
  illustration,
  accent,
  scheme,
  onPress,
}: ModuleCardProps) {
  const t = getTokens(scheme);
  const progress = lessonsCompleted / totalLessons;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.moduleCard, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
      {/* Thumbnail */}
      <View style={[styles.moduleThumbnail, { backgroundColor: alpha(accent, 0.18) }]}>
        <ResourceIllustration id={illustration} width={110} height={140} rounded={0} />
      </View>
      {/* Content */}
      <View style={styles.moduleContent}>
        <View style={styles.moduleProgressHeader}>
          <Text style={[styles.progressLabel, { color: accent, fontFamily: t.typeface.uiMedium }]}>
            COURSE PROGRESS
          </Text>
          {isCompleted && (
            <View style={[styles.completedBadge, { backgroundColor: accent }]}>
              <Ionicons name="checkmark" size={14} color="#ffffff" />
              <Text style={[styles.completedText, { fontFamily: t.typeface.uiMedium }]}>
                Completed
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.moduleTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
          {title}
        </Text>
        <Text style={[styles.moduleDesc, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          {description}
        </Text>
        <View style={[styles.progressTrack, { backgroundColor: t.color.border }]}>
          <View style={[styles.progressFill, { backgroundColor: accent, width: `${progress * 100}%` as any }]} />
        </View>
        <View style={styles.moduleFooter}>
          <Text style={[styles.lessonsText, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
            {lessonsCompleted} of {totalLessons} lessons completed
          </Text>
          <ArrowCircle accent={accent} size={32} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ResourcesTabScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const understandCardWidth = Math.min(240, width - 64);
  const shiftCardWidth = Math.min(176, width - 64);
  const moduleCardWidth = Math.min(380, width - 40);
  const { isCompleted: module1Completed } = useModule1Status();

  const ua = t.color.sectionAccent.understand;
  const sa = t.color.sectionAccent.shift;
  const da = t.color.sectionAccent.deepen;

  const understandCardBg = scheme === 'dark' ? '#14102c' : '#ffffff';
  const shiftCardBg = scheme === 'dark' ? '#0c1e1b' : '#ffffff';

  return (
    <Screen scroll includeBottomInset={false} contentContainerStyle={styles.content}>
      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Resources
        </Text>
        <TouchableOpacity
          style={[styles.searchBtn, { backgroundColor: t.color.surfaceElevated, borderColor: t.color.border }]}
          accessibilityLabel="Search resources">
          <Ionicons name="search-outline" size={18} color={t.color.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── Understand ────────────────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader iconComponent={<Ionicons name="hardware-chip-outline" size={20} color={ua} />} title="Understand" scheme={scheme} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.understandContainer}>
          {resourcesContent.understand.map((card) => (
            <View key={card.href} style={{ width: understandCardWidth }}>
              <UnderstandCard
                icon={card.icon}
                title={card.title}
                description={card.description}
                cta={card.cta}
                illustration={card.illustration}
                accent={ua}
                cardBg={understandCardBg}
                scheme={scheme}
                onPress={() => router.push(card.href)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── Shift your State ──────────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader iconComponent={<WavesIcon color={sa} size={20} />} title="Shift your State" scheme={scheme} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shiftContainer}>
          {resourcesContent.shift.map((card) => (
            <View key={card.href} style={{ width: shiftCardWidth }}>
              <ShiftCard
                icon={card.icon}
                title={card.title}
                description={card.description}
                duration={card.duration}
                illustration={card.illustration}
                accent={sa}
                cardBg={shiftCardBg}
                scheme={scheme}
                onPress={() => router.push(card.href)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── Go Deeper (Modules) ─────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader iconComponent={<Ionicons name="book-outline" size={20} color={da} />} title="Go Deeper" scheme={scheme} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.modulesContainer}>
          {resourcesContent.modules.map((module) => {
            const isCompleted = module.id === 'module1' ? module1Completed : false;
            // Module 2 is locked until Module 1 is done. Module 1 always shows
            // 1/1 lessons once completed; otherwise 0/N.
            const lessonsCompleted =
              module.id === 'module1' ? (isCompleted ? 1 : 0) : 0;

            return (
              <View key={module.id} style={[styles.moduleItem, { width: moduleCardWidth }]}>
                <ModuleCard
                  title={module.title}
                  description={module.description}
                  lessonsCompleted={lessonsCompleted}
                  totalLessons={module.totalLessons}
                  isCompleted={isCompleted}
                  illustration={module.illustration}
                  accent={da}
                  scheme={scheme}
                  onPress={() => router.push(module.href)}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Screen>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 28,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },

  // page header
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 32,
    lineHeight: 38,
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // section
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    lineHeight: 22,
  },

  // shared card primitives
  arrowCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto' as any,
    paddingTop: 8,
  },
  ctaText: {
    fontSize: 13,
    lineHeight: 18,
  },

  // understand cards
  understandContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  understandCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    height: 214,
  },
  understandThumbnail: {
    width: '100%',
    height: 110,
    overflow: 'hidden',
  },
  understandIconArea: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 74,
  },
  understandBody: {
    padding: 12,
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 19,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 17,
  },

  // shift cards
  shiftContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  shiftCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 8,
    height: 188,
  },
  shiftThumbnail: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  shiftIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftTitle: {
    fontSize: 13,
    lineHeight: 17,
  },
  shiftDesc: {
    fontSize: 11,
    lineHeight: 15,
    flexGrow: 1,
  },
  shiftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  durationTag: {
    fontSize: 11,
    lineHeight: 14,
  },

  // module / go deeper card
  moduleCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    height: 204,
  },
  moduleThumbnail: {
    width: 110,
    overflow: 'hidden',
  },
  moduleContent: {
    flex: 1,
    padding: 14,
    gap: 5,
  },
  moduleProgressHeader: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  progressLabel: {
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.6,
    flexShrink: 1,
  },
  moduleTitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  moduleDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  moduleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto' as any,
    paddingTop: 4,
  },
  lessonsText: {
    fontSize: 11,
    lineHeight: 14,
    flex: 1,
    marginRight: 8,
  },

  // modules container
  modulesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  moduleItem: {
    position: 'relative',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  completedText: {
    fontSize: 11,
    lineHeight: 14,
    color: '#ffffff',
  },
});
