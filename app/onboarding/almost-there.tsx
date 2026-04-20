import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import {
  almostThereCopy,
  almostThereSchema,
  type AlmostThereAnswers,
} from '@/features/onboarding/schema/almostThere';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { track } from '@/lib/analytics/track';
import { useAssessment } from '@/providers/AssessmentProvider';
import { getTokens } from '@/theme/tokens';

type DraftState = {
  displayName: string;
  ageBand?: AlmostThereAnswers['ageBand'];
  gender?: AlmostThereAnswers['gender'];
  attribution?: AlmostThereAnswers['attribution'];
};

export default function AlmostThereScreen() {
  const t = getTokens(useColorScheme());
  const router = useRouter();
  const { answers, submitAlmostThere } = useAssessment();

  const [draft, setDraft] = useState<DraftState>({ displayName: '' });
  const [nameError, setNameError] = useState<string | null>(null);

  const setField = useCallback(<K extends keyof DraftState>(key: K, value: DraftState[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const onSubmit = useCallback(() => {
    const parsed = almostThereSchema.safeParse({
      displayName: draft.displayName,
      ageBand: draft.ageBand,
      gender: draft.gender,
      attribution: draft.attribution,
    });
    if (!parsed.success) {
      const nameIssue = parsed.error.issues.find((i) => i.path[0] === 'displayName');
      setNameError(nameIssue?.message ?? 'Check your entries');
      return;
    }
    setNameError(null);

    if (!answers) {
      // No pending assessment — send user back to the start.
      router.replace('/onboarding');
      return;
    }

    const result = submitAlmostThere(parsed.data);
    track(AnalyticsEvents.almostThereSubmitted);
    if (result) {
      router.replace('/results');
    }
  }, [answers, draft, router, submitAlmostThere]);

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text
            style={{
              color: t.color.textMuted,
              fontSize: 14,
              fontFamily: t.typeface.uiMedium,
            }}>
            ← Back
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.h1, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
        Almost there
      </Text>
      <Text style={[styles.h2, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
        A few quick details
      </Text>

      <FieldBlock title={almostThereCopy.displayName.title}>
        <Text
          style={[styles.prompt, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
          {almostThereCopy.displayName.prompt}
        </Text>
        <TextInput
          value={draft.displayName}
          onChangeText={(v) => {
            setField('displayName', v);
            if (nameError) setNameError(null);
          }}
          placeholder={almostThereCopy.displayName.placeholder}
          placeholderTextColor={t.color.textMuted}
          style={[
            styles.input,
            {
              borderColor: nameError ? t.color.danger : t.color.border,
              color: t.color.textPrimary,
              backgroundColor: t.color.surface,
              fontFamily: t.typeface.ui,
            },
          ]}
          autoCapitalize="words"
          maxLength={60}
          returnKeyType="next"
        />
        {nameError ? <Text style={styles.err}>{nameError}</Text> : null}
      </FieldBlock>

      <FieldBlock title={almostThereCopy.ageBand.title} optional>
        <Text
          style={[styles.prompt, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
          {almostThereCopy.ageBand.prompt}
        </Text>
        <OptionGroup
          options={almostThereCopy.ageBand.options}
          value={draft.ageBand}
          onChange={(id) => setField('ageBand', id as DraftState['ageBand'])}
          t={t}
        />
      </FieldBlock>

      <FieldBlock title={almostThereCopy.gender.title} optional>
        <Text
          style={[styles.prompt, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
          {almostThereCopy.gender.prompt}
        </Text>
        <OptionGroup
          options={almostThereCopy.gender.options}
          value={draft.gender}
          onChange={(id) => setField('gender', id as DraftState['gender'])}
          t={t}
        />
      </FieldBlock>

      <FieldBlock title={almostThereCopy.attribution.title} optional>
        <Text
          style={[styles.prompt, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
          {almostThereCopy.attribution.prompt}
        </Text>
        <OptionGroup
          options={almostThereCopy.attribution.options}
          value={draft.attribution}
          onChange={(id) => setField('attribution', id as DraftState['attribution'])}
          t={t}
        />
      </FieldBlock>

      <PrimaryButton onPress={onSubmit}>See results</PrimaryButton>
    </Screen>
  );
}

function FieldBlock({
  title,
  optional,
  children,
}: {
  title: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const t = getTokens(useColorScheme());
  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text
          style={[
            styles.blockTitle,
            { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold },
          ]}>
          {title}
        </Text>
        {optional ? (
          <Text
            style={[
              styles.optionalTag,
              { color: t.color.textMuted, fontFamily: t.typeface.ui },
            ]}>
            Optional
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function OptionGroup({
  options,
  value,
  onChange,
  t,
}: {
  options: readonly { id: string; label: string }[];
  value: string | undefined;
  onChange: (id: string) => void;
  t: ReturnType<typeof getTokens>;
}) {
  return (
    <View style={styles.options}>
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={[
              styles.option,
              {
                borderColor: selected ? t.color.accent : t.color.border,
                backgroundColor: selected ? t.color.surfaceElevated : t.color.surface,
              },
            ]}>
            <View style={[styles.radioOuter, { borderColor: t.color.accent }]}>
              {selected ? (
                <View style={[styles.radioInner, { backgroundColor: t.color.accent }]} />
              ) : null}
            </View>
            <Text
              style={[
                styles.optionLabel,
                { color: t.color.textPrimary, fontFamily: t.typeface.ui },
              ]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 18,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  h1: { fontSize: 34, lineHeight: 40, marginBottom: 2 },
  h2: { fontSize: 22, lineHeight: 28, marginBottom: 6 },
  block: { gap: 10, marginBottom: 4 },
  blockHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  blockTitle: { fontSize: 18 },
  optionalTag: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  prompt: { fontSize: 16, marginBottom: 4 },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  options: { gap: 10 },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: { flexShrink: 1, fontSize: 16 },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 8, height: 8, borderRadius: 4 },
  err: { color: '#e85d5d', fontSize: 13 },
});
