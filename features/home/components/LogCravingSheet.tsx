import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';

import { useAuth } from '@/providers/AuthProvider';
import { getSupabaseClient } from '@/lib/supabase/client';
import { logCraving } from '@/lib/repositories/cravings';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

const TRIGGER_OPTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'driving', label: 'Driving' },
  { id: 'social', label: 'Social' },
  { id: 'drinking', label: 'Drinking' },
  { id: 'eating', label: 'Eating' },
  { id: 'boredom', label: 'Boredom' },
  { id: 'stress', label: 'Stress' },
  { id: 'morning', label: 'Morning routine' },
  { id: 'evening', label: 'Evening wind-down' },
  { id: 'post_meal', label: 'After a meal' },
];

type Phase = 'form' | 'success';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export function LogCravingSheet({ visible, onDismiss }: Props) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const { user } = useAuth();

  const [intensity, setIntensity] = useState(5);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('form');

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setIntensity(5);
    setSelectedTriggers([]);
    setNotes('');
    setError(null);
    setPhase('form');
  }, [visible]);

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  function toggleTrigger(id: string) {
    setSelectedTriggers((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    if (!user) return;
    const client = getSupabaseClient();
    if (!client) {
      setError('No connection — try again.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: repoError } = await logCraving(client, user.id, {
      intensity,
      triggers: selectedTriggers,
      notes: notes.trim() || undefined,
    });

    setSubmitting(false);

    if (repoError) {
      setError(repoError);
      return;
    }

    setPhase('success');
    successTimer.current = setTimeout(() => {
      onDismiss();
    }, 1600);
  }

  const intensityLabel =
    intensity <= 3 ? 'Mild' : intensity <= 6 ? 'Moderate' : intensity <= 8 ? 'Strong' : 'Intense';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.kavWrapper}
          >
            <TouchableWithoutFeedback>
              <View style={[styles.sheet, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
                {/* Handle */}
                <View style={[styles.handle, { backgroundColor: t.color.border }]} />

                {phase === 'success' ? (
                  <View style={styles.successWrap}>
                    <Text style={styles.successIcon}>✓</Text>
                    <Text style={[styles.successTitle, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
                      Craving logged
                    </Text>
                    <Text style={[styles.successSub, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
                      Awareness is the first step.
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.formContent}
                  >
                    {/* Title */}
                    <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
                      Log a Craving
                    </Text>

                    {/* Intensity */}
                    <View style={styles.section}>
                      <View style={styles.sectionHeader}>
                        <Text style={[styles.label, { color: t.color.textSecondary, fontFamily: t.typeface.uiMedium }]}>
                          Intensity
                        </Text>
                        <Text style={[styles.intensityBadge, { color: t.color.accent, fontFamily: t.typeface.uiSemibold }]}>
                          {intensity} · {intensityLabel}
                        </Text>
                      </View>
                      <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={intensity}
                        onValueChange={setIntensity}
                        minimumTrackTintColor={t.color.accent}
                        maximumTrackTintColor={t.color.border}
                        thumbTintColor={t.color.accent}
                      />
                      <View style={styles.sliderLabels}>
                        <Text style={[styles.sliderEnd, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
                          Low
                        </Text>
                        <Text style={[styles.sliderEnd, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
                          High
                        </Text>
                      </View>
                    </View>

                    {/* Triggers */}
                    <View style={styles.section}>
                      <Text style={[styles.label, { color: t.color.textSecondary, fontFamily: t.typeface.uiMedium }]}>
                        What triggered it? <Text style={{ color: t.color.textMuted }}>(optional)</Text>
                      </Text>
                      <View style={styles.chipGrid}>
                        {TRIGGER_OPTIONS.map((opt) => {
                          const active = selectedTriggers.includes(opt.id);
                          return (
                            <Pressable
                              key={opt.id}
                              onPress={() => toggleTrigger(opt.id)}
                              style={[
                                styles.chip,
                                {
                                  borderColor: active ? t.color.accent : t.color.border,
                                  backgroundColor: active ? t.color.accentMuted + '33' : 'transparent',
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.chipText,
                                  {
                                    color: active ? t.color.accent : t.color.textSecondary,
                                    fontFamily: active ? t.typeface.uiMedium : t.typeface.ui,
                                  },
                                ]}
                              >
                                {opt.label}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>

                    {/* Notes */}
                    <View style={styles.section}>
                      <Text style={[styles.label, { color: t.color.textSecondary, fontFamily: t.typeface.uiMedium }]}>
                        Notes <Text style={{ color: t.color.textMuted }}>(optional)</Text>
                      </Text>
                      <TextInput
                        style={[
                          styles.notesInput,
                          {
                            color: t.color.textPrimary,
                            backgroundColor: t.color.surfaceElevated,
                            borderColor: t.color.border,
                            fontFamily: t.typeface.ui,
                          },
                        ]}
                        placeholder="What's going on?"
                        placeholderTextColor={t.color.textMuted}
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        returnKeyType="default"
                      />
                    </View>

                    {/* Error */}
                    {error && (
                      <Text style={[styles.errorText, { color: t.color.danger, fontFamily: t.typeface.ui }]}>
                        {error}
                      </Text>
                    )}

                    {/* Actions */}
                    <View style={styles.actions}>
                      <PrimaryButton onPress={handleSubmit} disabled={submitting}>
                        {submitting ? 'Saving…' : 'Save Craving'}
                      </PrimaryButton>
                      <Pressable onPress={onDismiss} style={styles.cancelBtn}>
                        <Text style={[styles.cancelText, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
                          Cancel
                        </Text>
                      </Pressable>
                    </View>
                  </ScrollView>
                )}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  kavWrapper: {
    width: '100%',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 24,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    marginTop: 4,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  intensityBadge: {
    fontSize: 15,
    lineHeight: 20,
  },
  slider: {
    width: '100%',
    height: 36,
    marginHorizontal: -4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -6,
  },
  sliderEnd: {
    fontSize: 11,
    lineHeight: 16,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 13,
    lineHeight: 18,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: -8,
  },
  actions: {
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    lineHeight: 20,
  },
  successWrap: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  successIcon: {
    fontSize: 48,
    lineHeight: 56,
    color: '#4ade80',
  },
  successTitle: {
    fontSize: 22,
    lineHeight: 28,
    marginTop: 4,
  },
  successSub: {
    fontSize: 15,
    lineHeight: 22,
  },
});
