import { useRouter } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type ProfileMenuProps = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileMenu({ visible, onClose }: ProfileMenuProps) {
  const router = useRouter();
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  const handleNavigate = (path: '/settings/profile' | '/settings') => {
    onClose();
    router.push(path);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.menuCard,
            {
              backgroundColor: t.color.surface,
              borderColor: t.color.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}>
          <MenuItem
            icon="person-outline"
            label="Edit Profile"
            onPress={() => handleNavigate('/settings/profile')}
            colors={t}
          />
          <View style={[styles.divider, { backgroundColor: t.color.border }]} />
          <MenuItem
            icon="settings-outline"
            label="Settings"
            onPress={() => handleNavigate('/settings')}
            colors={t}
            isLast
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type MenuItemProps = {
  icon: string;
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof getTokens>;
  isLast?: boolean;
};

function MenuItem({ icon, label, onPress, colors, isLast }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.menuItem,
        {
          paddingVertical: isLast ? 12 : 12,
        },
      ]}>
      <Ionicons name={icon as any} size={20} color={colors.color.textSecondary} />
      <Text
        style={[
          styles.menuLabel,
          {
            color: colors.color.textPrimary,
            fontFamily: colors.typeface.ui,
          },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  menuCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuLabel: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
});
