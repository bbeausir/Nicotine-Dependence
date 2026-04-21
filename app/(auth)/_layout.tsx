import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AuthLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerLeft: ({ tintColor }) => (
          <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="chevron-back" size={24} color={tintColor} />
          </Pressable>
        ),
      }}>
      <Stack.Screen name="sign-in" options={{ title: 'Sign in' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Create account' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot password' }} />
      <Stack.Screen name="update-password" options={{ title: 'Set new password' }} />
    </Stack>
  );
}
