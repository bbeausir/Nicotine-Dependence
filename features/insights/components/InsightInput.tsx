import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';
import type { InsightTag } from '@/lib/database/schema';

const MAX_CHARS = 280;

interface InsightInputProps {
  visible: boolean;
  tags: InsightTag[];
  onSave: (text: string, tag: string) => Promise<void>;
  onCreateTag: (tagName: string) => Promise<InsightTag | null>;
  onDismiss: () => void;
}

type Step = 'tag' | 'write';

export function InsightInput({ visible, tags, onSave, onCreateTag, onDismiss }: InsightInputProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const [step, setStep] = useState<Step>('tag');
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [saving, setSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const recentTags = tags.filter((tg) => tg.lastUsed > 0).slice(0, 6);
  const allTags = tags
    .filter((tg) => !searchText || tg.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const canNext = Boolean(selectedTag);
  const canSave = text.trim().length > 0 && selectedTag;

  const resetAndDismiss = () => {
    setText('');
    setSelectedTag(null);
    setSearchText('');
    setStep('tag');
    onDismiss();
  };

  const handleSelectTag = (tagName: string) => {
    setSelectedTag(tagName);
  };

  const handleCreateTag = async () => {
    if (!searchText.trim()) return;
    setIsCreating(true);
    try {
      const newTag = await onCreateTag(searchText.trim());
      if (newTag) {
        setSelectedTag(newTag.name);
        setSearchText('');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleNext = () => {
    if (!canNext) return;
    setStep('write');
  };

  const handleBack = () => {
    setStep('tag');
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave(text.trim(), selectedTag);
      resetAndDismiss();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={resetAndDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: t.color.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: t.color.border }]}>
            {step === 'tag' ? (
              <TouchableOpacity onPress={resetAndDismiss}>
                <Text style={[styles.headerButton, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleBack}>
                <Text style={[styles.headerButton, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
                  Back
                </Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.headerTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
              {step === 'tag' ? 'Add a tag' : 'New insight'}
            </Text>

            {step === 'tag' ? (
              <TouchableOpacity onPress={handleNext} disabled={!canNext}>
                <Text
                  style={[
                    styles.headerButton,
                    {
                      color: canNext ? t.color.accent : t.color.textMuted,
                      fontFamily: t.typeface.ui,
                      fontWeight: '600',
                    },
                  ]}>
                  Next
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSave} disabled={!canSave || saving}>
                <Text
                  style={[
                    styles.headerButton,
                    {
                      color: canSave && !saving ? t.color.accent : t.color.textMuted,
                      fontFamily: t.typeface.ui,
                      fontWeight: '600',
                    },
                  ]}>
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {step === 'tag' ? (
            <>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    backgroundColor: t.color.surfaceElevated,
                    borderColor: t.color.border,
                    color: t.color.textPrimary,
                    fontFamily: t.typeface.ui,
                  },
                ]}
                placeholder="Search"
                placeholderTextColor={t.color.textMuted}
                value={searchText}
                onChangeText={setSearchText}
              />

              <FlatList
                data={allTags}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                  <>
                    {recentTags.length > 0 && !searchText && (
                      <>
                        <Text style={[styles.sectionTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
                          Recent
                        </Text>
                        <View style={styles.tagGrid}>
                          {recentTags.map((tag) => {
                            const isSelected = selectedTag === tag.name;
                            return (
                              <TouchableOpacity
                                key={tag.id}
                                style={[
                                  styles.tagPill,
                                  {
                                    backgroundColor: isSelected ? t.color.accent : t.color.surfaceElevated,
                                    borderColor: isSelected ? t.color.accent : t.color.border,
                                  },
                                ]}
                                onPress={() => handleSelectTag(tag.name)}>
                                <Text
                                  style={[
                                    styles.tagPillText,
                                    {
                                      color: isSelected ? '#fff' : t.color.textPrimary,
                                      fontFamily: t.typeface.ui,
                                    },
                                  ]}>
                                  {tag.name.replace('-', ' ')}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </>
                    )}

                    <Text style={[styles.sectionTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
                      All tags
                    </Text>

                    <View style={styles.tagGrid}>
                      {searchText.trim() && (
                        <TouchableOpacity
                          style={[styles.tagPill, { backgroundColor: t.color.surfaceElevated, borderColor: t.color.accent }]}
                          onPress={handleCreateTag}
                          disabled={isCreating}>
                          <Text style={[styles.tagPillText, { color: t.color.accent, fontFamily: t.typeface.ui }]}>
                            + Create a tag
                          </Text>
                        </TouchableOpacity>
                      )}
                      {!searchText.trim() && (
                        <TouchableOpacity
                          style={[styles.tagPill, { backgroundColor: t.color.surfaceElevated, borderColor: t.color.border }]}
                          disabled>
                          <Text style={[styles.tagPillText, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
                            + Create a tag
                          </Text>
                        </TouchableOpacity>
                      )}
                      {allTags.map((tag) => {
                        const isSelected = selectedTag === tag.name;
                        return (
                          <TouchableOpacity
                            key={tag.id}
                            style={[
                              styles.tagPill,
                              {
                                backgroundColor: isSelected ? t.color.accent : t.color.surfaceElevated,
                                borderColor: isSelected ? t.color.accent : t.color.border,
                              },
                            ]}
                            onPress={() => handleSelectTag(tag.name)}>
                            <Text
                              style={[
                                styles.tagPillText,
                                {
                                  color: isSelected ? '#fff' : t.color.textPrimary,
                                  fontFamily: t.typeface.ui,
                                },
                              ]}>
                              {tag.name.replace('-', ' ')}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                }
                renderItem={() => null}
                style={styles.flex}
                contentContainerStyle={styles.listContent}
              />
            </>
          ) : (
            <View style={styles.writeContent}>
              <View style={[styles.selectedTagPill, { backgroundColor: t.color.accent }]}>
                <Text style={[styles.selectedTagText, { color: '#fff', fontFamily: t.typeface.ui }]}>
                  {selectedTag?.replace('-', ' ')}
                </Text>
              </View>

              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: t.color.surfaceElevated,
                    borderColor: t.color.border,
                    color: t.color.textPrimary,
                    fontFamily: t.typeface.display,
                  },
                ]}
                placeholder="What just became clear…"
                placeholderTextColor={t.color.textMuted}
                value={text}
                onChangeText={(newText) => {
                  if (newText.length <= MAX_CHARS) {
                    setText(newText);
                  }
                }}
                multiline
                maxLength={MAX_CHARS}
                editable={!saving}
                autoFocus
              />

              <Text style={[styles.charCount, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
                {text.length}/{MAX_CHARS}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '90%',
    paddingTop: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    fontSize: 16,
    lineHeight: 20,
  },
  headerTitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tagPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagPillText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  writeContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  selectedTagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedTagText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    lineHeight: 26,
    minHeight: 180,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
});
