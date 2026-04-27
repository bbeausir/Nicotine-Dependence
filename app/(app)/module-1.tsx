import { useCallback, useEffect, useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useModule1, TOTAL_SCREENS } from '@/providers/Module1Provider';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

import { IntroScreen } from '@/features/module-1/components/IntroScreen';
import { LoopDiagram } from '@/features/module-1/components/LoopDiagram';
import { SelectScreen } from '@/features/module-1/components/SelectScreen';
import { LoopMapDisplay } from '@/features/module-1/components/LoopMapDisplay';
import { CloseScreen } from '@/features/module-1/components/CloseScreen';
import {
  TRIGGER_OPTIONS,
  BENEFIT_OPTIONS,
  OUTCOME_OPTIONS,
  MAX_TRIGGERS,
  TOTAL_INTERACTIVE_STEPS,
} from '@/features/module-1/constants';

export default function Module1Screen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  const {
    currentScreen,
    triggers,
    benefit,
    outcome,
    isReady,
    goToScreen,
    setTriggers,
    setBenefit,
    setOutcome,
    saveLoopMap,
    reset,
  } = useModule1();

  const [isSaving, setIsSaving] = useState(false);

  // If the user re-enters the route after completing the flow (sitting on the
  // close screen), start them fresh. Incomplete drafts are preserved so they
  // can resume where they left off.
  useFocusEffect(
    useCallback(() => {
      if (isReady && currentScreen === TOTAL_SCREENS - 1) {
        reset();
      }
    }, [isReady, currentScreen, reset]),
  );

  // Defensive: if we land on the review screen without complete data
  // (e.g. corrupted draft), bounce back to the trigger picker.
  useEffect(() => {
    if (!isReady) return;
    if (currentScreen === 5 && (!benefit || !outcome || triggers.length === 0)) {
      goToScreen(2);
    }
  }, [isReady, currentScreen, benefit, outcome, triggers, goToScreen]);

  if (!isReady) {
    return (
      <View style={[styles.loading, { backgroundColor: t.color.background }]}>
        <ActivityIndicator color={t.color.accent} />
      </View>
    );
  }

  const handleSaveLoopMap = async () => {
    if (isSaving) return; // guard against double-tap → duplicate rows
    setIsSaving(true);
    try {
      const result = await saveLoopMap();
      if (result) {
        goToScreen(6);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinish = () => {
    router.back();
  };

  switch (currentScreen) {
    case 0:
      return <IntroScreen onContinue={() => goToScreen(1)} />;

    case 1:
      return <LoopDiagram onContinue={() => goToScreen(2)} />;

    case 2:
      return (
        <SelectScreen
          mode="multi"
          step={1}
          totalSteps={TOTAL_INTERACTIVE_STEPS}
          title="When do you reach for it most?"
          prompt={`Pick up to ${MAX_TRIGGERS} moments that feel most familiar.`}
          options={TRIGGER_OPTIONS}
          maxSelections={MAX_TRIGGERS}
          selected={triggers}
          onSelect={setTriggers}
          onContinue={() => goToScreen(3)}
          capitalizeOptions
        />
      );

    case 3:
      return (
        <SelectScreen
          mode="single"
          step={2}
          totalSteps={TOTAL_INTERACTIVE_STEPS}
          title="What does it seem to do for you?"
          prompt="In those moments, what does nicotine seem to help with?"
          options={BENEFIT_OPTIONS}
          selected={benefit}
          onSelect={setBenefit}
          onContinue={() => goToScreen(4)}
        />
      );

    case 4:
      return (
        <SelectScreen
          mode="single"
          step={3}
          totalSteps={TOTAL_INTERACTIVE_STEPS}
          title="What usually happens later?"
          prompt="After you use nicotine, what is usually true later on?"
          options={OUTCOME_OPTIONS}
          selected={outcome}
          onSelect={setOutcome}
          onContinue={() => goToScreen(5)}
        />
      );

    case 5:
      if (!benefit || !outcome || triggers.length === 0) {
        // useEffect above will bounce us back to step 2; render nothing this frame.
        return null;
      }
      return (
        <LoopMapDisplay
          triggers={triggers}
          benefit={benefit}
          outcome={outcome}
          onSave={handleSaveLoopMap}
          isSaving={isSaving}
        />
      );

    case 6:
    default:
      return <CloseScreen onFinish={handleFinish} />;
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
