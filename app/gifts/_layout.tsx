import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function GiftsLayout() {
  const colorScheme = useColorScheme();
  const primary = Colors[colorScheme ?? 'light'].primary;

  return (
    <Stack
      screenOptions={{
        title: 'All Products (Gifts)',
        headerStyle: { backgroundColor: primary },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'PlusJakartaSans_600SemiBold',
          fontSize: 18,
        },
      }}>
      <Stack.Screen name="all" options={{ title: 'All Products (Gifts)' }} />
    </Stack>
  );
}
