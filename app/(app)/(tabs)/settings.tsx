import { Alert, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import Constants from 'expo-constants';

import { SettingsRow } from '@/components/ui/SettingsRow';
import { SettingsSection } from '@/components/ui/SettingsSection';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/providers/AuthProvider';
import { useAssessment } from '@/providers/AssessmentProvider';
import { getTokens } from '@/theme/tokens';

export default function SettingsTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const { user, signOut } = useAuth();
  const { clear: clearAssessment } = useAssessment();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?';

  function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          setIsSigningOut(true);
          const { error } = await signOut();
          if (error) {
            setIsSigningOut(false);
            Alert.alert('Sign out failed', error);
            return;
          }
          clearAssessment();
        },
      },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert('Delete account', 'Account deletion is coming soon. Contact support if you need help.');
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
        Settings
      </Text>

      {/* User identity header */}
      <View
        style={[
          styles.identityCard,
          {
            backgroundColor: t.color.surfaceElevated,
            borderRadius: t.radius.lg,
            borderColor: t.color.border,
          },
        ]}>
        <View style={[styles.avatar, { backgroundColor: t.color.accent }]}>
          <Text style={[styles.avatarText, { color: '#ffffff', fontFamily: t.typeface.uiSemibold }]}>
            {initial}
          </Text>
        </View>
        <Text style={[styles.email, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          {user?.email}
        </Text>
      </View>

      {/* Settings sections */}
      <SettingsSection header="Profile">
        <SettingsRow
          icon="person-outline"
          label="Edit profile"
          onPress={() => router.push('/settings/profile')}
          isLast
        />
      </SettingsSection>

      <SettingsSection header="Notifications">
        <SettingsRow
          icon="notifications-outline"
          label="Notification preferences"
          onPress={() => router.push('/settings/notifications')}
          isLast
        />
      </SettingsSection>

      <SettingsSection header="Privacy & Data">
        <SettingsRow
          icon="shield-outline"
          label="Privacy & data"
          onPress={() => router.push('/settings/privacy')}
          isLast
        />
      </SettingsSection>

      <SettingsSection header="Account">
        <SettingsRow
          icon="log-out-outline"
          label="Sign out"
          onPress={handleSignOut}
          showChevron={false}
          disabled={isSigningOut}
          loading={isSigningOut}
        />
        <SettingsRow
          icon="trash-outline"
          label="Delete account"
          onPress={handleDeleteAccount}
          showChevron={false}
          labelColor={t.color.danger}
          isLast
        />
      </SettingsSection>

      <Text style={[styles.version, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
        Version {Constants.expoConfig?.version ?? '—'}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 24,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  identityCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
  },
  email: {
    fontSize: 14,
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    paddingBottom: 8,
  },
});
